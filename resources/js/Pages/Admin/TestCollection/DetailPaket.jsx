import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { PlusIcon, ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link, router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";

const toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
});

export default function DetailPaket({ auth, testCollection, questions }) {
    console.log(questions);
    const handleDelete = (id) => {
        const data = {
            id: id,
        };
        axios.patch("/test-collection/delete-question", data).then((res) => {
            toast.fire({
                icon: res.data.error ? "error" : "success",
                title: res.data.message,
            });
            router.visit(`/test-collection/${testCollection.kode}`);
        });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(rowData.id)}
            >
                <TrashIcon className="h-4 w-4" />
            </Button>
        );
    };

    const textBodyTemplate = (rowData) => {
        return (
            <div>
                <span
                    className="line-clamp-2 h-fit my-auto"
                    dangerouslySetInnerHTML={{
                        __html: rowData.question.pertanyaan,
                    }}
                />
                {rowData.question.pertanyaan.length > 10 && (
                    <Link
                        href={`/test-collection/detail/${rowData.question_id}`}
                        className="p-button-link"
                    >
                        Selengkapnya
                    </Link>
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col">
                    <div className="flex flex-row md:flex-col mx-auto text-center justify-center item-center gap-4">
                        <h2 className="font-semibold text-4xl text-gray-800 leading-tight">
                            Paket Soal {testCollection.nama} - {testCollection.kode}
                        </h2>
                        <p className="text-xl">{testCollection.deskripsi}</p>
                    </div>
                </div>
            }
        >
            <Head title="Paket Soal" />

            {/* <div className="py-8 flex flex-row justify-center items-center gap-8">
                <button
                    className={`${activeFilter === "Studi kasus" ? 'bg-blue-800 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-800'} text-white font-bold py-2 px-4 rounded`}
                    onClick={() => handleFilter("Studi kasus")}
                >
                    Studi Kasus
                </button>
                <button
                    className={`${activeFilter === "Intray analisis" ? 'bg-blue-800 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-800'} text-white font-bold py-2 px-4 rounded`}
                    onClick={() => handleFilter("Intray analisis")}
                >
                    Intray Analisis
                </button>
                <button
                    className={`${activeFilter === "Kuisioner Perilaku" ? 'bg-blue-800 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-800'} text-white font-bold py-2 px-4 rounded`}
                    onClick={() => handleFilter("Kuisioner Perilaku")}
                >
                    Kuisioner Perilaku
                </button>
            </div> */}

            <div className="flex justify-end my-4">
                <Button asChild>
                    <Link href={`/test-collection/${testCollection.kode}/add-soal`}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Tambah Soal
                    </Link>
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Soal dalam Paket</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>Kode Soal</TableHead>
                                <TableHead>Dimensi</TableHead>
                                <TableHead>Pertanyaan</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                questions.map((question, index) => (
                                    <TableRow key={question.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{question.question.kode}</TableCell>
                                        <TableCell>{question.question.dimensi}</TableCell>
                                        <TableCell className="max-w-xs">
                                            <div 
                                                className="line-clamp-2"
                                                dangerouslySetInnerHTML={{ 
                                                    __html: question.question.pertanyaan 
                                                }} 
                                            />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {actionBodyTemplate(question)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
}
