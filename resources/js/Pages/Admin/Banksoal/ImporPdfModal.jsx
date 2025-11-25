import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ImporPdfModal({ isOpen, onClose, onDataImport }) {
    const [fileData, setFileData] = useState(null);
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
    });

    // Fungsi untuk menangani upload file PDF
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFileData(file); // Set file ke state
        toast.fire({ icon: "success", title: "File PDF berhasil dipilih!" });
    };

    // Fungsi untuk menangani submit form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Ini mencegah form dari submit secara default
        if (!fileData) {
            toast.fire({
                icon: "error",
                title: "Silakan pilih file PDF terlebih dahulu.",
            });
            return;
        }

        const formData = new FormData();
        formData.append("file", fileData);
        // Kirim data ke parent
        onDataImport(fileData);
        onClose(); // Tutup modal setelah upload
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
                                        Upload PDF
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <form onSubmit={handleSubmit}>
                                            <div className="space-y-3">
                                                <label className="block border border-gray-300 rounded-lg bg-gray-100 p-1">
                                                    <span className="sr-only">
                                                        Upload File
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept=".pdf"
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
