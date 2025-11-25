/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Inertia } from "@inertiajs/inertia";

export default function AddKoleksiModal({ isOpen, onClose }) {
    let [changelog, setChangelog] = useState("");

    function handleSubmit() {
        let data = {
            changelog: changelog,
            file_training: file_training,
        };
        Inertia.post("/admin/train-models", data);
        window.location.reload();
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
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-7xl sm:w-5/12 sm:p-6">
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-2xl font-black leading-6 text-blue-800 my-4"
                                            >
                                                Tambah Model
                                            </Dialog.Title>
                                            <div className="mt-5">
                                                <textarea
                                                    placeholder={
                                                        "Masukan model"
                                                    }
                                                    value={changelog}
                                                    onChange={(e) =>
                                                        setChangelog(e.target.value)
                                                    }
                                                    className="w-full rounded-xl text-base font-normal resize-y min-h-20"
                                                    rows="6"
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>
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
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
