import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
export default function ImporExcelModal({ isOpen, onClose }) {
    const [fileData, setFileData] = useState([]);
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
    });

    const generateKode = () => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}${
            date.getMonth() + 1
        }${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
        const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        return `SOAL-${formattedDate}-${randomNum}`;
    };

    // Fungsi untuk mengimpor file Excel dan memproses data
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // Template header yang diharapkan (kolom harus sesuai urutan ini)
            const expectedHeader = [
                "Tipe Soal",
                "Pertanyaan",
                "Dimensi",
                "Kunci Jawaban",
            ];

            // Validasi apakah file sesuai dengan template header
            const fileHeader = jsonData[0] || [];
            const isValidFile = expectedHeader.every(
                (header, index) => header === fileHeader[index]
            );

            if (!isValidFile) {
                Swal.fire({
                    icon: "error",
                    title: "Format file tidak sesuai dengan template yang diharapkan",
                    text: "Harap unggah file dengan kolom sesuai template",
                });
                return;
            }
            // Memproses data dari setiap baris menjadi format payload yang diinginkan
            const processedData = jsonData.slice(1).map((row) => ({
                kode: generateKode(),
                pertanyaan: `<p>${row[1]}</p>`,
                dimensi: row[2],
                type: "studi_kasus",
                key_answer: `<p>${row[3]}</p>`,
            }));

            setFileData(processedData); // Simpan data impor ke state
            Swal.fire({
                icon: "success",
                title: "File barhasil diimpor, siap untuk dikirim",
            });
        };
        reader.readAsArrayBuffer(file);
    };

    // Fungsi untuk mengirimkan payload saat Submit ditekan
    const handleSubmit = () => {
        if (fileData.length === 0) {
            toast.error("Silakan impor file sebelum submit.");
            return;
        }
        axios
            .post(route("admin.createSoalexcel"), fileData, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((res) => {
                toast.fire({
                    icon: res.data.error ? "error" : "success",
                    title: res.data.message,
                });
                router.visit("/bank-soal");
            })
            .catch((error) => {
                toast.fire({
                    icon: res.data.error ? "error" : "success",
                    title: res.data.message,
                });
            });
        onClose(false);
    };

    const exportTemplate = () => {
        const templateData = [
            ["Tipe Soal", "Pertanyaan", "Dimensi", "Kunci Jawaban"],
        ];

        // Buat worksheet dari data
        const worksheet = XLSX.utils.aoa_to_sheet(templateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

        // Ekspor file Excel
        try {
            const excelBuffer = XLSX.write(workbook, {
                bookType: "xlsx",
                type: "array",
            });
            const data = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(data, "template.xlsx");
            Swal.fire({
                icon: "success",
                title: "File barhasil diimpor, siap untuk dikirim",
            });
        } catch (error) {
            console.error("Gagal mengekspor template:", error);
            Swal.fire({
                icon: "error",
                title: "File barhasil diimpor, siap untuk dikirim",
            });
        }
    };

    return (
        <Transition.Root appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="z-10 my-auto"
                onClose={() => onClose(false)}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform rounded-lg bg-white p-3 text-left shadow-xl transition-all sm:my-8 sm:w-7xl sm:w-5/12 sm:p-6"
                                style={{ maxHeight: "90vh", overflowY: "auto" }}
                            >
                                <div className="mt-3 text-center sm:mt-5">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-2xl font-black leading-6 text-blue-800 my-4"
                                    >
                                        Upload Excel
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <form onSubmit={handleSubmit}>
                                            <div className="space-y-3">
                                                <div className="flex justify-start">
                                                    <button
                                                        className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                        onClick={exportTemplate}
                                                    >
                                                        Unduh Templat
                                                    </button>
                                                </div>
                                                <label className="block border border-gray-300 rounded-lg bg-gray-100 p-1">
                                                    <span className="sr-only">
                                                        Upload File
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept=".xlsx, .xls"
                                                        onChange={
                                                            handleFileUpload
                                                        }
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-800 file:text-white hover:file:bg-blue-900 focus:file:outline-none focus:file:ring-2 focus:file:ring-cyan-700 transition ease-in-out duration-150"
                                                    />
                                                </label>
                                            </div>
                                            <div className="bg-white rounded-xl rounded-t-none">
                                                <div className="flex gap-4 mt-4">
                                                    <button
                                                        type="submit"
                                                        className="py-2 w-full bg-blue-800 border border-transparent rounded-md font-semibold text-xs text-white hover:bg-blue-900 focus:bg-cyan-700 active:bg-gray-900 focus:text-white focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        <h1
                                                            id="container"
                                                            className="text-lg font-bold"
                                                        >
                                                            Submit
                                                        </h1>
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
