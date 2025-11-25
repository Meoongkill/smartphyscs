/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from '@inertiajs/inertia-react';

export default function ModalJoin({isOpen, onClose,}) {

    const [kode, setKode] = useState();
    const { data, setData, post } = useForm({ code: '' });

    const handleSubmit = () => {
        post('/verify-test', { data });
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-7xl sm:w-5/12 sm:p-6">
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <div className="text-center">
                                            <div className="flex flex-col md:flex-row gap-3">
                                                <input
                                                    type="text"
                                                    className="flex-1 rounded-lg p-4 bg-gray-100 border-none"
                                                    value={data.kode}
                                                    onChange={(e) =>setData('kode',e.target.value)}
                                                    placeholder="Masukan kode tes"
                                                />
                                                <button
                                                    type="submit"
                                                    className="md:ml-2 py-2 px-8 bg-blue-800 border border-transparent rounded-md font-semibold text-xs text-white hover:bg-blue-900 focus:bg-cyan-700 active:bg-gray-900 focus:text-white focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    <h1 className="text-lg font-bold">
                                                        Gabung
                                                    </h1>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
