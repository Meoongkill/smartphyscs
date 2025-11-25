/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import QuestionNumBox from "./QuestionNumBox";

export default function ModalQuestion({
    isOpen,
    onClose,
    questions,
    answers,
    flags,
    onQuestionChange,
    setQuestionIndex,
    openModal,
}) {
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
                            <Dialog.Panel className="h-full relative transform overflow-hidden rounded-lg bg-white md:p-4 text-left shadow-xl transition-all sm:my-8 w-full sm:p-6">
                                <div>
                                    <div className="md:m-3 text-center sm:mt-5">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-xl my-4 font-medium leading-6 text-gray-900 mb-3"
                                        >
                                            Daftar Soal
                                        </Dialog.Title>
                                        <div className="overflow-y-auto h-96">
                                            <QuestionNumBox
                                                questions={questions}
                                                answers={answers}
                                                flags={flags}
                                                onQuestionChange={
                                                    onQuestionChange
                                                }
                                                setQuestionIndex={
                                                    setQuestionIndex
                                                }
                                                onClose={onClose}
                                            />
                                        </div>
                                        <button
                                            className="bg-cyan-700 m-2 text-white w-full rounded-xl mx-auto py-2 w-2/3 text-lg"
                                            onClick={() => {
                                                onQuestionChange();
                                                onClose(false);
                                                openModal();
                                            }}
                                        >
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
