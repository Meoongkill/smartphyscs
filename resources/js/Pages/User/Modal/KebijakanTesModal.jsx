import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Inertia } from "@inertiajs/inertia";

export default function KebijakanTesModal({ isOpen, onClose, handleButton }) {

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
                                className="relative transform rounded-lg bg-white p-3 text-left shadow-xl transition-all sm:my-8 sm:w-7xl sm:w-3/4 sm:p-6"
                                style={{ maxHeight: "90vh", overflowY: "auto" }}
                            >
                                <div>
                                    <div className="mt-3 sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl text-center font-black leading-6 text-blue-800 my-4"
                                        >
                                            Kebijakan Tes
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <div className="bg-gray-200 p-2">
                                                <p>
                                                    Asesmen ini merupakan bagian dari riset yang bertujuan akhir
                                                    untuk mengembangkan analisis otomatis berbasis Artificial
                                                    Intelligence. Namun demikian, hasil asesmen ini dapat
                                                    digunakan oleh pihak manajemen perusahaan sebagai gambaran
                                                    kecenderungan kompetensi dari pegawainya.
                                                </p>
                                                <br />
                                                <p>
                                                    Peserta akan menghadapi serangkaian simulasi tertulis dan diminta untuk
                                                    menuliskan respon sesuai dengan instruksi yang tertera di masing-masing
                                                    bagian simulasi. Waktu total untuk mengerjakan simulasi ini adalah sekitar
                                                    3 jam (180 menit) dengan 2 kali istirahat diantara setiap simulasi.
                                                </p>
                                                <br />
                                                <p>
                                                    Ketidaknyamanan yang timbul dalam proses tergolong ringan seperti kelelahan
                                                    mata atau tangan. Untuk itu, peserta  dihimbau untuk mengambil waktu istirahat
                                                    yang disediakan dengan sebaik-baiknya tanpa menggunakan gawai atau benda elektronik.
                                                </p>
                                                <br />
                                                <p>
                                                    Jika terdapat keluhan dalam proses asesmen maka mohon untuk dapat menghubungi Sdr.
                                                    Rezki Ashriyana Sulistiobudi di email <span className="text-blue-800">rezki.ashriyana@unpad.ac.id</span>
                                                </p>
                                                <br />
                                                <p className="text-blue-800">
                                                    Berdasarkan penjelasan diatas, apakah Anda bersedia untuk melakukan asesmen ini ?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl rounded-t-none">
                                    <div className="flex flex-row gap-4 mt-4">
                                        <button
                                            type="button"
                                            className="py-2 w-full bg-blue-200 border border-transparent rounded-md font-semibold text-xs text-blue-800 hover:text-white hover:bg-blue-800 transition ease-in-out duration-150"
                                            onClick={() => onClose(false)}
                                        >
                                            <h1
                                                id="container"
                                                className="text-lg font-bold"
                                            >
                                                Tidak Bersedia
                                            </h1>
                                        </button>
                                        <button
                                            type="button"
                                            className="py-2 w-full bg-blue-800 border border-transparent rounded-md font-semibold text-xs text-white hover:bg-blue-200 hover:text-blue-800 transition ease-in-out duration-150"
                                            onClick={handleButton}
                                        >
                                            <h1
                                                id="container"
                                                className="text-lg font-bold"
                                            >
                                                Bersedia
                                            </h1>
                                        </button>

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
