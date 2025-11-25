import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import Modal from "@/Pages/Admin/AddSoalModal";
import ModalEditQuestion from "@/Pages/Admin/EditSoalModal";
import { Inertia } from "@inertiajs/inertia";
import { PlusIcon, PencilSquareIcon, TrashIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

function UnsafeComponent({ html }) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function Detail({ auth, test, question }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    
    const handleDelete = (id) => {
        console.log(id);
        const data = {
            id,
        };
        console.log(data);
        Inertia.post("/delete-soal", data);
        window.location.reload();
    };

    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const handleEdit = (questionId) => {
        setSelectedQuestionId(questionId);
        setIsModalEditOpen(true);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="w-full">
                    <h2 className="font-semibold text-4xl text-blue-800 leading-tight break-words">
                        {test.nama}
                    </h2>
                </div>
            }
        >
            <Head title="Dashboard" />
            <div className="p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <CardTitle className="text-2xl font-semibold text-gray-900">
                                    Informasi Test
                                </CardTitle>
                                <CardDescription className="text-base text-gray-600 break-words">
                                    {test.deskripsi}
                                </CardDescription>
                            </div>
                            
                            <div className="flex flex-wrap gap-4 text-sm">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    📅 {test.tanggal}
                                </Badge>
                                {(test.jam > 0 || test.menit > 0) && (
                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                        ⏱️ {test.jam > 0 ? `${test.jam} Jam ` : ""}{test.menit > 0 ? `${test.menit} Menit` : ""}
                                    </Badge>
                                )}
                                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                                    🔑 Kode: {test.kode}
                                </Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <Button
                                    onClick={() => location.replace(`/detail-test/${test.id}/hasil`)}
                                    variant="outline"
                                    className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-6 py-2 h-auto"
                                >
                                    <ChartBarIcon className="w-5 h-5 mr-2" />
                                    Hasil Tes
                                </Button>
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-auto"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Tambah Soal
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                <div className="space-y-6">
                    {question.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <div className="space-y-4">
                                    <div className="text-gray-400 text-6xl">📝</div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            Belum Ada Soal
                                        </h3>
                                        <p className="text-gray-600">
                                            Anda belum memiliki soal untuk test ini. Ayo buat soal sekarang!
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <PlusIcon className="w-5 h-5 mr-2" />
                                        Buat Soal Pertama
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        question?.map((soalItem, index) => (
                            <Card key={index} className="border-l-4 border-l-blue-500">
                                <CardHeader>
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                        <div className="space-y-2">
                                            <CardTitle className="text-xl font-semibold text-gray-900">
                                                Soal {index + 1}
                                            </CardTitle>
                                            <Badge variant="secondary" className="w-fit">
                                                Dimensi: {soalItem.dimensi}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEdit(soalItem.id)}
                                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                                            >
                                                <PencilSquareIcon className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleDelete(soalItem.id)}
                                                className="border-red-200 text-red-600 hover:bg-red-50"
                                            >
                                                <TrashIcon className="w-4 h-4 mr-1" />
                                                Hapus
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="bg-gray-50 p-4 rounded-lg border">
                                        <UnsafeComponent html={soalItem.pertanyaan} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        testId={test.id}
                    />
                )}
                {isModalEditOpen && (
                    <ModalEditQuestion
                        isOpen={isModalEditOpen}
                        onClose={() => setIsModalEditOpen(false)}
                        question={question}
                        questionId={selectedQuestionId}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
