import React, { useState, useEffect } from 'react'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Accordion from "@/Components/Accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import Lottie from 'lottie-react';
import NotFoundAnimation from "@/Assets/NotFoundAnimation.json";

// PILIHAN DROPDOWN BUAT PILIHAN SHOW SEMUA DATA
export default function ResultPage({ auth }) {
    const [selectedKategori, setSelectedKategori] = useState(null);
    const paket = [
        { name: "Studi Kasus", code: "Studi Kasus" },
        { name: "Intray Analisis", code: "Intray Analisis" },
        { name: "Kuisioner Perilaku", code: "Kuisioner Perilaku" },
    ];
    const dataPeserta = {
        nik: "123123123",
        nama: "bayu",
        email: "bayu@gmail.com"
    }
    const data = [
        {
            id: 1,
            pertanyaan: "pertanyaan 1",
            jawaban: "jawaban 1",
            score_bot: 90,
            score_psikolog: 90,
            type: "Studi Kasus"
        },
        {
            id: 2,
            pertanyaan: "pertanyaan 2",
            jawaban: "jawaban 2",
            score_bot: 90,
            score_psikolog: 90,
            type: "Intray Analisis"
        },
        {
            id: 3,
            pertanyaan: "pertanyaan 3",
            jawaban: "jawaban 3",
            score_bot: 90,
            score_psikolog: 90,
            type: "Kuisioner Perilaku"
        },
    ]

    // FILTER DROPDOWN
    const [filteredData, setFilteredData] = useState(data);

    useEffect(() => {
        if (selectedKategori) {
            const filtered = data.filter((item) => item.type === selectedKategori.code);
            setFilteredData(filtered);
            console.log("filtered dropdown data:", filtered);
        }
    }, [selectedKategori])

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h1 className="text-center text-3xl font-semibold text-blue-800 mb-10">
                    Hasil Tes
                </h1>
            }
        >
            <div>
                <div className='grid grid-cols-2 gap-4 lg:px-32 px-8'>
                    <div className="flex flex-col w-full bg-blue-700 rounded py-4 px-8 text-white">
                        <p className="font-semibold flex justify-center items-center  text-xl pb-4">
                            Data Peserta
                        </p>
                        <table className="justify-start" >
                            <tr>
                                <td className="pb-2">NIK</td>
                                <td className="pb-2">
                                    : {dataPeserta.nik}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-2">Nama</td>
                                <td className="pb-2">
                                    : {dataPeserta.nama}
                                </td>
                            </tr>
                            <tr>
                                <td className="pb-2">Email</td>
                                <td className="pb-2">
                                    : {dataPeserta.email}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div className="w-full bg-blue-700 rounded py-4 px-8 text-white">
                        <p className="font-semibold flex justify-center items-center  text-xl pb-4">
                            Hasil Test
                        </p>
                        <div className="grid md:grid-cols-2 grid-cols-1 text-center gap-4">
                            <div>
                                <h1 className="bg-blue-100 text-blue-800 font-medium rounded-md py-2 px-4 mb-3">
                                    Total Score Bot
                                </h1>
                                <h1 className="text-3xl text-center text-yellow-500 font-bold">
                                    90
                                </h1>
                            </div>
                            <div>
                                <h1 className="bg-blue-100 text-blue-800 font-medium rounded-md py-2 px-4 mb-3">
                                    Total Score Psikolog
                                </h1>
                                <h1 className="text-3xl text-center text-yellow-500 font-bold">
                                    90
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card flex justify-end py-8">
                    <Select
                        value={selectedKategori?.code}
                        onValueChange={(value) => {
                            const selected = paket.find(item => item.code === value);
                            setSelectedKategori(selected);
                        }}
                    >
                        <SelectTrigger className="w-48 bg-blue-100 md:w-56 rounded-lg">
                            <SelectValue placeholder="Pilih Kategory Soal" />
                        </SelectTrigger>
                        <SelectContent>
                            {paket.map((item) => (
                                <SelectItem key={item.code} value={item.code}>
                                    {item.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                {
                    data.length > 0 ? (
                        <div className='gap-2'>
                            {filteredData.map((item, index) => (
                                <Accordion key={index} title={"list soal"} data={item} />
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 flex flex-col justify-center items-center w-full flex-grow">
                            <Lottie animationData={NotFoundAnimation} loop={true} className="h-96 w-auto" />
                            <p className="font-poppins text-lg">Belum ada hasil</p>
                        </div>
                    )
                }

            </div>
        </AuthenticatedLayout>
    )
}