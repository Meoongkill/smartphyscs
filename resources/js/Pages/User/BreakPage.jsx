import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Head, Link } from "@inertiajs/react";
import { Button } from "primereact/button";
import TimerIstirahat from "./Partials/TimerIstirahat";

export default function BreakPage({ auth, data }) {
    const ISTIRAHAT_KEY = `istirahat_${auth.user.id}`;
    const [duration, setDuration] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    let activeButton = data.status;

    const buttons = [
        { id: 'studi_kasus', text: 'Studi Kasus', description: `${data.duration} menit | ${data.total_questions} Soal` },
        { id: 'intray_analisis', text: 'Intray Analisis', description: `${data.duration} menit | ${data.total_questions} Soal` },
        { id: 'kuisioner_perilaku', text: 'Kuisioner Perilaku', description: `${data.duration} menit | ${data.total_questions} Soal` },
    ];

    const getStatus = (id) => {
        const activeIndex = buttons.findIndex(button => button.id === activeButton);
        const buttonIndex = buttons.findIndex(button => button.id === id);

        if (buttonIndex < activeIndex) {
            return "Done";
        } else if (buttonIndex === activeIndex) {
            return "Doing";
        } else {
            return "Wait";
        }
    };

    const handleButton = () => {
        clearInterval(intervalId);
        localStorage.clear();
        
        // POST ke /result untuk create test_result kategori istirahat, baru reload
        const dataCode = { code: data.session.code };
        
        axios.post("/result", dataCode)
            .then((res) => {
                // Reload dengan timestamp untuk bypass cache
                window.location.href = `/istirahat/${data.session.code}?t=${Date.now()}`;
            })
            .catch((error) => {
                console.error('Error:', error);
                // Tetap reload meskipun error
                window.location.href = `/istirahat/${data.session.code}?t=${Date.now()}`;
            });
    }


    // get duration dari localstorage ketika pertama reload atau di refresh
    useEffect(() => {
        let storedDuration = localStorage.getItem(ISTIRAHAT_KEY);
        if (storedDuration) {
            setDuration(parseInt(storedDuration));
        } else {
            storedDuration = 10 * 60; // 10 menit
            localStorage.setItem(ISTIRAHAT_KEY, storedDuration);
            setDuration(parseInt(storedDuration));
        }
    }, []);

    // update data duration di localstorage berkurang 1 setiap detik
    useEffect(() => {
        const interval = setInterval(() => {
            const storedDuration = localStorage.getItem(ISTIRAHAT_KEY);
            const prevDuration = parseInt(storedDuration);

            if (prevDuration <= 0) {
                clearInterval(interval);
                localStorage.setItem(ISTIRAHAT_KEY, 0);
            } else {
                const newDuration = prevDuration - 1;
                localStorage.setItem(ISTIRAHAT_KEY, newDuration);
            }
        }, 1000);

        setIntervalId(interval); // Store the interval ID

        return () => clearInterval(interval);
    }, []);


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-center item-center">
                    <h1 className="font-bold text-4xl text-blue-800">
                        {activeButton !== "studi_kasus" ? "Istirahat Asesmen" : "Kerjakan Asesmen"}
                    </h1>
                </div>
            }
        >
            <Head title="Break Test" />
            <div className="flex flex-col md:flex-row py-8 gap-4">
                <div className="flex flex-col md:w-2/5 w-full bg-blue-700 rounded py-4 px-8 text-white">
                    <p className="font-semibold flex justify-center items-center  text-xl pb-8">
                        Data Peserta
                    </p>
                    <table className="justify-start" >
                        <tbody>
                            <tr>
                                <td className="pb-6">NIK</td>
                                <td className="pb-6">:</td>
                                <td className="pb-6">
                                    {data.user.nik}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-6">Nama</td>
                                <td className="pb-6 pl-0">:</td>
                                <td className="pb-6">
                                    {data.user.name}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-6">Email</td>
                                <td className="pb-6">:</td>
                                <td className="pb-6">
                                    {data.user.email}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-6">Kode Tes</td>
                                <td className="pb-6">:</td>
                                <td className="pb-6">
                                    {data.session.code}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className="relative card flex flex-col md:w-3/5 w-full rounded border border-blue-700 py-4 px-8 gap-6 min-h-[340px]">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-between gap-4">
                            <p className="font-semibold text-blue-800 text-xl">
                                Pilih Paket Soal
                            </p>
                            {/* PAGE ISTIRAHAT */}
                            {duration !== undefined && duration > 0 && (
                                <TimerIstirahat handleSubmit={handleButton} duration={duration} activeButton={activeButton} />
                            )}
                        </div>
                        <div className="flex flex-col justify-start items-start gap-4">
                            {buttons.map(button => {
                                const status = getStatus(button.id);
                                if (status === "Doing") {
                                    return (
                                        <div
                                            key={button.id}
                                            className="flex flex-row justify-between items-center w-full rounded-md border border-gray-400 pl-4 shadow-md"
                                        >
                                            <div>
                                                {button.description}
                                            </div>
                                            <div className="btn bg-blue-800 text-white px-4 py-2 rounded font-semibold">
                                                {button.text}
                                            </div>
                                        </div>
                                    );
                                } else if (status === "Wait") {
                                    return (
                                        <div
                                            key={button.id}
                                            className="bg-blue-200 text-blue-800 py-2 px-4 rounded font-semibold"
                                        >
                                            {button.text}
                                        </div>
                                    );
                                } else if (status === "Done") {
                                    return (
                                        <div
                                            key={button.id}
                                            className="bg-blue-800 text-white py-2 px-4 rounded font-semibold"
                                        >
                                            {button.text}
                                        </div>
                                    );
                                }
                                return null;
                            })}

                        </div>
                    </div>
                    <div className="absolute bottom-6 right-6">
                        <Button
                            className="btn bg-blue-800 hover:bg-blue-200 text-white hover:text-blue-800 py-2 px-4 rounded font-semibold"
                            onClick={handleButton}
                        >
                            Kerjakan Sekarang
                        </Button>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}