import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import ModalTailwind from "@/Components/Modal";
function UnsafeComponent({ html }) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Detail({ auth, test, question, answer }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between item-center">
                    <h2 className="font-semibold text-4xl text-blue-800 leading-tight">
                        {test.nama}
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />
            <div className="py-4 sm:py-6">
                <div className="mx-auto">
                    <div className="bg-white overflow-hidden sm:rounded-lg">
                        <main className="flex-1">
                            <h1>{test.deskripsi}</h1>
                            <div className="w-full xl:w-full bg-gray-300 rounded-lg shadow-md p-2 mt-6">
                                <p className="text-black">
                                    Nama: {auth.user.name}
                                </p>
                            </div>
                            <div className="pt-2">
                                {question?.length === 0 ? (
                                    <h1>
                                        Anda tidak memiliki soal, ayo buat
                                        sekarang!
                                    </h1>
                                ) : (
                                    question?.map((soalItem, index) => (
                                        <div className="mt-10" key={index}>
                                            <div className="w-full xl:w-full h-full p-4 rounded-lg shadow-md border-2 mb-4">
                                                <p className="pb-4">
                                                    <div className="flex gap-1">
                                                        <span>
                                                            {index + 1 }.{" "}
                                                        </span>
                                                        <UnsafeComponent
                                                            html={
                                                                soalItem.pertanyaan
                                                            }
                                                        />
                                                    </div>
                                                </p>
                                                <div className="flex flex-row gap-6">
                                                    <div className="basis-11/12 bg-gray-300 rounded-lg shadow-md">
                                                        <p className="text-black p-4">
                                                        {answer[index].jawaban}
                                                        </p>
                                                    </div>
                                                    <div className="basis-1/12 bg-gray-300 rounded-lg shadow-md text-center flex flex-col items-center justify-center">
                                                        <h1 className="text-2xl">
                                                            Nilai
                                                        </h1>
                                                        <h1 className="text-4xl">
                                                        {answer[index].skor}
                                                        </h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </main>
                        {isModalOpen && (
                            <ModalTailwind
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                titleForm="Tambah Koleksi"
                            />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
