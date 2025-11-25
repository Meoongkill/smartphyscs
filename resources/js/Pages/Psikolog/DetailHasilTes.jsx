import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import Swal from "sweetalert2";
import axios from "axios";
import { router } from "@inertiajs/react";

export default function DetailHasilTes({ auth, test_results, user, session, dimensions, is_predicted }) {
    console.log("test result:", test_results);
    console.log("user:", user);
    console.log("session:", session);
    console.log("dimensions:", dimensions);
    console.log("is_predicted:", is_predicted);
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
    });

    const tipe = [
        { name: "Studi Kasus", value: "studi_kasus" },
        { name: "Intray Analisis", value: "intray_analisis" },
        { name: "Kuisioner Perilaku", value: "kuisioner_perilaku" },
    ];
    const defaultSelectedTipe = tipe.map((t) => t.value);
    const [selectedtipe, setSelectedTipe] = useState(defaultSelectedTipe);
    const [inputValue, setInputValue] = useState("");
    const sessionstr = session[0];

    const [correctedScores, setCorrectedScores] = useState({});

    const separateAnswersByType = (answers) => {
        const categorizedAnswers = {};

        answers.map((item) => {
            item.answers.map((answer) => {
                const type = answer.question.type;
                if (!categorizedAnswers[type]) {
                    categorizedAnswers[type] = [];
                }
                categorizedAnswers[type].push(answer);
            });
        });

        return categorizedAnswers;
    };

    const answers = test_results.filter(
        (item) => Array.isArray(item.answers) && item.answers.length > 0
    );
    const jawabanbytipe = separateAnswersByType(answers);
    console.log("jawabanbytipe:", jawabanbytipe);
    const studi_kasus = jawabanbytipe.studi_kasus || [];
    const intray_analisis = jawabanbytipe.intray_analisis || [];
    const kuisioner_perilaku = jawabanbytipe.kuisioner_perilaku || [];
    const handleInputChange = (e, itemId) => {
        setCorrectedScores({
            ...correctedScores,
            [itemId]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const scoresArray = Object.keys(correctedScores).map((key) => ({
            id: parseInt(key),
            skor_psikolog: correctedScores[key],
        }));

        console.log("Corrected scores:", scoresArray);
        try {
            axios
                .post("/psikolog/score", {
                    scores: scoresArray,
                })
                .then((res) => {
                    toast.fire({
                        icon: res.data.error ? "error" : "success",
                        title: res.data.message,
                    });
                    router.visit(
                        `/psikolog/result/${user.id}/${sessionstr.id}`
                    );
                });
        } catch (error) {
            console.error("Error submitting corrected scores:", error);
        }
    };

    const handleChange = (value, checked) => {
        if (checked) {
            setSelectedTipe([...selectedtipe, value]);
        } else {
            setSelectedTipe(selectedtipe.filter(item => item !== value));
        }
    };
    const styles = {
        table: {
            border: "1px solid black",
            borderCollapse: "collapse",
            width: "100%",
        },
        tableCell: {
            border: "1px solid black",
            padding: "8px",
            textAlign: "left",
        },
        unorderedList: {
            listStyleType: "disc",
            paddingLeft: "20px",
        },
        orderedList: {
            listStyleType: "decimal",
            paddingLeft: "20px",
        },
    };
    const convertOembedToIframe = (htmlContent) => {
        // Regular expression to find oembed tag and extract the URL
        return htmlContent.replace(
            /<oembed url="(.+?)"><\/oembed>/g,
            (match, url) => {
                // If the URL is from YouTube, convert it to iframe
                const videoId =
                    new URL(url).searchParams.get("v") || url.split("/").pop();
                return `
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/${videoId}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            `;
            }
        );
    };
    const renderContent = (data, type) =>
        data.map((item, index) => (
            <div key={item.id}>
                <div className="grid grid-cols-12 gap-4 mt-5 rounded-lg">
                    <div className="col-span-10 h-full border rounded-lg">
                        <div className="flex flex-col card rounded p-4 shadow-md gap-4 mt-5">
                            <div className="w-full py-2">
                                <p>
                                    {index + 1}.{" "}
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: convertOembedToIframe(
                                                item.question.pertanyaan
                                                    .replace(
                                                        /<table>/g,
                                                        `<table style="border: ${styles.table.border}; border-collapse: ${styles.table.borderCollapse}; width: ${styles.table.width};">`
                                                    )
                                                    .replace(
                                                        /<td>/g,
                                                        `<td style="border: ${styles.tableCell.border}; padding: ${styles.tableCell.padding}; text-align: ${styles.tableCell.textAlign};">`
                                                    )
                                                    .replace(
                                                        /<ul>/g,
                                                        `<ul style="list-style-type: ${styles.unorderedList.listStyleType}; padding-left: ${styles.unorderedList.paddingLeft};">`
                                                    )
                                                    .replace(
                                                        /<ol>/g,
                                                        `<ol style="list-style-type: ${styles.orderedList.listStyleType}; padding-left: ${styles.orderedList.paddingLeft};">`
                                                    )
                                            ),
                                        }}
                                    />
                                </p>
                            </div>
                            <p className="font-bold">Jawaban:</p>
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-10 py-2 p-2 bg-gray-200 rounded">
                                    <p>{item.jawaban}</p>
                                </div>
                                <div className="col-span-2 py-2 p-2 bg-gray-200 rounded text-center flex flex-col justify-center items-center min-h-auto">
                                    <p className="text-xl">Nilai</p>
                                    <p className="text-4xl">{item.score_bot}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 h-full">
                        <div className="flex flex-col card rounded border p-4 shadow-md gap-4 text-center h-full">
                            <p className="text-lg font-bold">Koreksi Nilai</p>
                            <div className="bg-gray-200 rounded h-full flex flex-col items-center">
                                <input
                                    type="text"
                                    className="w-full h-full px-4 py-2 text-7xl rounded bg-gray-200 border border-gray-200 focus:outline-none focus:border-blue-500 text-center"
                                    value={
                                        correctedScores[item.id] !== undefined
                                            ? correctedScores[item.id]
                                            : item.score_psikolog || ""
                                    }
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Cek apakah input hanya berisi angka 0-9
                                        if (/^\d*$/.test(value)) {
                                            handleInputChange(e, item.id);
                                        }
                                    }}
                                    maxLength={1}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));

    const score_bot_sk = studi_kasus.reduce(
        (sum, item) => sum + item.score_bot,
        0
    );
    const score_bot_ia = intray_analisis.reduce(
        (sum, item) => sum + item.score_bot,
        0
    );
    const score_bot_kp = kuisioner_perilaku.reduce(
        (sum, item) => sum + item.score_bot,
        0
    );

    const score_psikolog_sk = studi_kasus.reduce(
        (sum, item) => sum + item.score_psikolog,
        0
    );
    const score_psikolog_ia = intray_analisis.reduce(
        (sum, item) => sum + item.score_psikolog,
        0
    );
    const score_psikolog_kp = kuisioner_perilaku.reduce(
        (sum, item) => sum + item.score_psikolog,
        0
    );
    // console.log("selectedtipe", selectedtipe);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-center font-bold text-3xl text-blue-800 leading-tight">
                    Hasil Asesmen {sessionstr.name}
                </h2>
            }
        >
            <Head title="Assesment Result" />
            
            {/* Prediction Results Section - Fixed Width, Dynamic Height */}
            {is_predicted && dimensions && dimensions.length > 0 && (
                <div className="mb-8 pt-10 w-1/2 mx-auto">
                    <div className="rounded-lg bg-gradient-to-r from-blue-800 to-blue-600 p-6 shadow-lg">
                        <h1 className="text-xl font-bold text-white text-center mb-6">
                            Hasil Prediksi AI - 9 Dimensi Kompetensi
                        </h1>
                        <div className="bg-white rounded-lg p-4">
                            <div className="grid gap-3">
                                {dimensions.map((dimension, index) => (
                                    <div 
                                        key={index}
                                        className="grid grid-cols-12 gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                        style={{ minHeight: '60px' }} // Dynamic height
                                    >
                                        {/* Dimension Name - Fixed Width */}
                                        <div className="col-span-5 flex items-center">
                                            <span className="font-semibold text-sm text-gray-800">
                                                {dimension.name}
                                            </span>
                                        </div>
                                        
                                        {/* Score Bot - Fixed Width */}
                                        <div className="col-span-2 flex flex-col items-center justify-center bg-blue-100 rounded px-1">
                                            <span className="text-xs text-gray-600">AI</span>
                                            <span className="text-xl font-bold text-blue-800">
                                                {dimension.score_bot || '-'}
                                            </span>
                                        </div>
                                        
                                        {/* Similarity - Fixed Width */}
                                        <div className="col-span-2 flex flex-col items-center justify-center bg-green-100 rounded px-1">
                                            <span className="text-xs text-gray-600">Conf</span>
                                            <span className="text-xs font-semibold text-green-800">
                                                {dimension.similarity ? (dimension.similarity * 100).toFixed(1) + '%' : '-'}
                                            </span>
                                        </div>
                                        
                                        {/* Score Human - Fixed Width */}
                                        <div className="col-span-3 flex flex-col items-center justify-center bg-yellow-100 rounded px-1">
                                            <span className="text-xs text-gray-600">Psikolog</span>
                                            <span className="text-xl font-bold text-yellow-800">
                                                {dimension.score_human || '-'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className=" mb-8 pt-10 max-w-5xl justify-center mx-auto">
                <div className="grid grid-cols-2 gap-4">
                    <div className=" rounded-lg bg-blue-800 p-5">
                        <h1 className="text-xl font-bold text-white text-center">
                            Data Peserta
                        </h1>
                        <div className="p-7">
                            <h1 className="text-lg text-white">
                                NIK : {user.nik}
                            </h1>
                            <h1 className="text-lg text-white">
                                Nama : {user.name}
                            </h1>
                            <h1 className="text-lg text-white">
                                Email : {user.email}
                            </h1>
                        </div>
                    </div>
                    <div className=" rounded-lg bg-blue-800 p-5">
                        <h1 className="text-xl font-bold text-white text-center">
                            Hasil Tes
                        </h1>
                        <div className="flex justify-center mt-4">
                            <table className="table-auto border-separate border-spacing-2">
                                <thead>
                                    <tr>
                                        <th className="bg-blue-100 text-blue-800 font-medium p-1">
                                            Tipe Soal
                                        </th>
                                        <th className="bg-blue-100 text-blue-800 font-medium p-1">
                                            Total Score Bot
                                        </th>
                                        <th className="bg-blue-100 text-blue-800 font-medium p-1">
                                            Total Score Psikolog
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="text-lg text-yellow-500 font-bold">
                                            {selectedtipe.includes(
                                                "studi_kasus"
                                            ) && <div>Studi Kasus</div>}
                                        </td>
                                        <td className="text-3xl text-center text-yellow-500 font-bold">
                                            {selectedtipe.includes(
                                                "studi_kasus"
                                            ) && <div>{score_bot_sk}</div>}
                                        </td>
                                        <td className="text-3xl text-center text-yellow-500 font-bold">
                                            {selectedtipe.includes(
                                                "studi_kasus"
                                            ) && <div>{score_psikolog_sk}</div>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg text-yellow-500 font-bold">
                                            {selectedtipe.includes(
                                                "intray_analisis"
                                            ) && <div>Intray Analisis</div>}
                                        </td>
                                        <td className="text-3xl text-center text-yellow-500 font-bold">
                                            {selectedtipe.includes(
                                                "intray_analisis"
                                            ) && <div>{score_bot_ia}</div>}
                                        </td>
                                        <td className="text-3xl text-center text-yellow-500 font-bold">
                                            {selectedtipe.includes(
                                                "intray_analisis"
                                            ) && <div>{score_psikolog_ia}</div>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-lg text-yellow-500 font-bold">
                                            {selectedtipe.includes(
                                                "kuisioner_perilaku"
                                            ) && <div>Kuisioner Perilaku</div>}
                                        </td>
                                        <td className="text-3xl text-center text-yellow-500 font-bold">
                                            {selectedtipe.includes(
                                                "kuisioner_perilaku"
                                            ) && <div>{score_bot_kp}</div>}
                                        </td>
                                        <td className="text-3xl text-center text-yellow-500 font-bold">
                                            {selectedtipe.includes(
                                                "kuisioner_perilaku"
                                            ) && <div>{score_psikolog_kp}</div>}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end mb-4">
                <div className="w-1/4 border rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="text-sm font-medium mb-3">Pilih tipe soal:</h3>
                    <div className="space-y-2">
                        {tipe.map((option) => (
                            <div key={option.value} className="flex items-center space-x-2">
                                <Checkbox
                                    id={option.value}
                                    checked={selectedtipe.includes(option.value)}
                                    onCheckedChange={(checked) => handleChange(option.value, checked)}
                                />
                                <label
                                    htmlFor={option.value}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {option.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                {selectedtipe.length === 0 && (
                    <div className="mt-5 text-center text-lg font-bold">
                        Pilih tipe soal!
                    </div>
                )}

                {selectedtipe.includes("studi_kasus") && (
                    <div>
                        <h2>Studi Kasus</h2>
                        {renderContent(studi_kasus, "studi_kasus")}
                    </div>
                )}

                {selectedtipe.includes("intray_analisis") && (
                    <div>
                        <h2>Intray Analisis</h2>
                        {renderContent(intray_analisis, "intray_analisis")}
                    </div>
                )}
                {selectedtipe.includes("kuisioner_perilaku") && (
                    <div>
                        <h2>Kuisioner Perilaku</h2>
                        {renderContent(kuisioner_perilaku, "kuisioner_perilaku")}
                    </div>
                )}

                <Button
                    type="submit"
                    className="mt-4 bg-blue-800 hover:bg-blue-700"
                >
                    Submit
                </Button>
            </form>
        </AuthenticatedLayout>
    );
}
