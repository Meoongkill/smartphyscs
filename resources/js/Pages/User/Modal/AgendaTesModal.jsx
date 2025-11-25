import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Inertia } from "@inertiajs/inertia";

export default function AgendaTesModal({ isOpen, onClose, data, code }) {
    const handleButton = (e) => {
        e.preventDefault();
        window.location.href = `/istirahat/${code}`;
        onClose(false);
    }
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
                                            Agenda Assessment
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <div className="bg-gray-200 p-2">
                                                <p>
                                                    Asesmen kecenderungan kompetensi ini akan dilakukan dalam 3 tahapan.
                                                    Peserta diminta untuk mengerjakan setiap tahapan sesuai waktu yang diberikan.
                                                    Ke-tiga tahapan tersebut adalah :
                                                </p>
                                                <p>1. Studi Kasus ({data.duration_1} menit) - Istirahat (10 menit)</p>
                                                <p>2. Intray Analisis ({data.duration_2} menit) - Istirahat (10 menit)</p>
                                                <p>3. Kuesioner Perilaku ({data.duration_3} menit) - Selesai</p>
                                                <br />
                                                <p className="font-semibold">
                                                    Bacalah setiap pengantar dan instruksi dengan seksama pada setiap bagian
                                                    simulasi tertulis sehingga pengerjaannya dapat optimal.
                                                </p>
                                                <br />
                                                <p>
                                                    Peserta harus mengerjakan simulasi secara berurutan, jika setiap bagian simulasi sudah
                                                    selesai dikerjakan, bar tahapan tes akan berubah warna, sehingga dapat mengerjakan simulasi
                                                    selanjutnya dengan mengklik bar tes selanjutnya.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-xl rounded-t-none">
                                    <div className="flex flex-row gap-4 mt-4">
                                        <button
                                            type="button"
                                            className="py-2 w-full bg-blue-800 border border-transparent rounded-md font-semibold text-xs text-white hover:bg-blue-200 hover:text-blue-800 transition ease-in-out duration-150"
                                            onClick={handleButton}
                                        >
                                            <h1
                                                id="container"
                                                className="text-lg font-bold"
                                            >
                                                Lanjutkan
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
