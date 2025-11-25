import React, { useState, useEffect, useRef } from "react";
import { Inertia } from "@inertiajs/inertia";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Swal from "sweetalert2";
import axios from "axios";
import { router } from "@inertiajs/react";
import ImporPdfModal from "./ImporPdfModal";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { DocumentArrowUpIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import LexicalEditor from "@/Components/LexicalEditor";

const Create = ({ question, auth }) => {
    const [pertanyaan, setPertanyaan] = useState(
        question ? question.pertanyaan : ""
    );
    const [kunciJawaban, setKunciJawaban] = useState(
        question ? question.key_answer : ""
    );
    const [dimensi, setDimensi] = useState(question ? question.dimensi : "");
    const [tipeSoal, setTipeSoal] = useState(question ? question.type : "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pdfContent, setPdfContent] = useState(
        question ? question.file_path : null
    );
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
    });

    useEffect(() => {
        if (question) {
            setPertanyaan(question.pertanyaan);
            setDimensi(question.dimensi);
        }
    }, [question]);

    // clean data from html tag
    function stripHTML(html) {
        var temp = document.createElement("div");
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!pertanyaan) {
            Swal.fire({
                icon: "warning",
                title: "Peringatan!",
                text: "Harap lengkapi kolom pertanyaan",
            });
            return;
        } else if (!dimensi) {
            Swal.fire({
                icon: "warning",
                title: "Peringatan!",
                text: "Harap pilih dimensi",
            });
            return;
        } else if (!tipeSoal) {
            Swal.fire({
                icon: "warning",
                title: "Peringatan!",
                text: "Harap pilih tipe soal",
            });
            return;
        } else if (!kunciJawaban) {
            Swal.fire({
                icon: "warning",
                title: "Peringatan!",
                text: "Harap lengkapi kolom kunci jawaban",
            });
            return;
        }
        if (question) {
            const payload = {
                id: question.id,
                kode: question.kode,
                pertanyaan: pertanyaan,
                dimensi,
                type: tipeSoal,
                key_answer: kunciJawaban,
                pdfFile: pdfContent,
            };
            axios.post("/bank-soal/update", payload,{
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }).then((res) => {
                toast.fire({
                    icon: res.data.error ? "error" : "success",
                    title: res.data.message,
                });
                router.visit("/bank-soal");
            });
            window.history.replaceState({}, "", `/bank-soal/${question.kode}`);
        } else {
            const payload = {
                kode: generateKode(),
                pertanyaan: pertanyaan,
                dimensi,
                type: tipeSoal,
                key_answer: kunciJawaban,
                pdfFile: pdfContent,
            };
            console.log(payload);

            axios
                .post("/add-soal", payload, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    toast.fire({
                        icon: res.data.error ? "error" : "success",
                        title: res.data.message,
                    });
                    router.visit("/bank-soal");
                });
        }
    }

    const generateKode = () => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}${
            date.getMonth() + 1
        }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
        const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        return `SOAL-${formattedDate}-${randomNum}`;
    };
    const handleDataImport = (fileData) => {
        setPdfContent(fileData); // Atur state pdfContent atau lainnya sesuai kebutuhan
    };
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => router.visit('/bank-soal')}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Kembali
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800">
                            {question ? "Edit Soal" : "Tambah Soal"}
                        </h1>
                        <p className="text-gray-600">
                            {question ? "Perbarui informasi soal" : "Buat soal assessment baru"}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold text-gray-900">
                                Informasi Soal
                            </CardTitle>
                            <CardDescription>
                                Lengkapi informasi dasar untuk soal assessment
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Tipe Soal */}
                            <div className="space-y-2">
                                <Label htmlFor="tipeSoal" className="text-sm font-medium text-gray-700">
                                    Tipe Soal *
                                </Label>
                                <Select value={tipeSoal} onValueChange={setTipeSoal}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih tipe soal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="studi_kasus">Studi Kasus</SelectItem>
                                        <SelectItem value="intray_analisis">Intray Analisis</SelectItem>
                                        <SelectItem value="kuisioner_perilaku">Kuisioner Perilaku</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Pertanyaan */}
                            <div className="space-y-2">
                                <Label htmlFor="pertanyaan" className="text-sm font-medium text-gray-700">
                                    Pertanyaan *
                                </Label>
                                <LexicalEditor
                                    value={pertanyaan}
                                    onChange={setPertanyaan}
                                    placeholder="Tulis pertanyaan disini..."
                                />
                            </div>

                            {/* Upload PDF */}
                            <div className="space-y-2">
                                <Label htmlFor="pdfContent" className="text-sm font-medium text-gray-700">
                                    Upload PDF (Opsional)
                                </Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept=".pdf"
                                        name="pdfContent"
                                        onChange={(e) => setPdfContent(e.target.files[0])}
                                        className="flex-1"
                                    />
                                    <DocumentArrowUpIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                {question && pdfContent && (
                                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                                            Preview PDF:
                                        </Label>
                                        <iframe
                                            src={`/storage/${pdfContent}`}
                                            width="100%"
                                            height="400px"
                                            className="border rounded-md"
                                        />
                                    </div>
                                )}
                            </div>
                            {/* Dimensi */}
                            <div className="space-y-2">
                                <Label htmlFor="dimensi" className="text-sm font-medium text-gray-700">
                                    Dimensi *
                                </Label>
                                <Select value={dimensi} onValueChange={setDimensi}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih dimensi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Integritas">Integritas</SelectItem>
                                        <SelectItem value="Kerjasama">Kerjasama</SelectItem>
                                        <SelectItem value="Komunikasi">Komunikasi</SelectItem>
                                        <SelectItem value="Orientasi pada hasil">Orientasi pada hasil</SelectItem>
                                        <SelectItem value="Pelayanan publik">Pelayanan publik</SelectItem>
                                        <SelectItem value="Pengembangan diri dan orang lain">Pengembangan diri dan orang lain</SelectItem>
                                        <SelectItem value="Mengelola perubahan">Mengelola perubahan</SelectItem>
                                        <SelectItem value="Pengambilan keputusan">Pengambilan keputusan</SelectItem>
                                        <SelectItem value="Perekat bangsa">Perekat bangsa</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Kunci Jawaban */}
                            <div className="space-y-2">
                                <Label htmlFor="kunciJawaban" className="text-sm font-medium text-gray-700">
                                    Kunci Jawaban *
                                </Label>
                                <LexicalEditor
                                    value={kunciJawaban}
                                    onChange={setKunciJawaban}
                                    placeholder="Tulis kunci jawaban disini..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/bank-soal')}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                        >
                            {question ? "Update Soal" : "Simpan Soal"}
                        </Button>
                    </div>

                    {/* Modal */}
                    {isModalOpen && (
                        <ImporPdfModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onDataImport={handleDataImport}
                        />
                    )}
                </form>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
