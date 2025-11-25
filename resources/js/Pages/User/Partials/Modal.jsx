/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import QuestionNumBox from "./QuestionNumBox";
import { Inertia } from "@inertiajs/inertia";

export default function Modal({ isOpen, onClose, closeModal, onSubmitModal, message }) {
    return (
        <Transition.Root appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="z-10 my-auto"
                onClose={closeModal}
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 w-96 sm:p-6">
                                <div>
                                    <div className="m-3 text-center sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-bold leading-6 text-red-800 mb-3"
                                        >
                                            {message}

                                        </Dialog.Title>
                                        <p className="text-lg font-medium leading-6 text-gray-900 mb-3"
                                        >
                                            Apakah anda yakin ingin submit?
                                        </p>
                                        <button className="px-4 py-2 m-1 mt-5 rounded-md bg-red-800 hover:bg-red-200 text-white hover:text-red-800 font-medium cursor-pointer" onClick={closeModal}>
                                            Batal
                                        </button>
                                        <button className="px-4 py-2 m-1 mt-5 rounded-md bg-blue-900 hover:bg-blue-200 text-white hover:text-blue-800 font-medium cursor-pointer" onClick={onSubmitModal}>
                                            Submit
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
