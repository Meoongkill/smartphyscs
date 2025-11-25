import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import Modal from "@/Pages/Admin/SesiTes/AddSesiTes";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { EyeIcon, PencilIcon } from "@heroicons/react/24/outline";

const DetailSession = ({ auth, session, testCollection, user_result }) => {
    console.log("test collection:", testCollection);
    console.log("user result:", user_result);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isTestEnded = new Date() > new Date(session.end_date);
    let paket = session.test_collections;
    paket = paket.map((item) => item.test_collection);

    // const handleDetail = (id) => {
    //     console.log(id);
    // };
    const actionBodyTemplate = (rowData, nomorSoal) => {
        rowData.nomorSoal = nomorSoal;
        return (
            <div className="flex gap-2">
                <Button asChild size="sm">
                    <Link href={`/session/${session.code}/detail/${rowData.id}`}>
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Detail
                    </Link>
                </Button>
            </div>
        );
    };
    return (
        <>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h1 className="text-center text-3xl font-semibold text-blue-800 mb-5">
                        {session.name}
                    </h1>
                }
            >
                {!isTestEnded && (
                    <div className="mb-5 flex justify-center gap-4">
                        <Button asChild>
                            <Link href={`/session/${session.id}/participants/create`}>
                                Tambah Peserta
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={`/session/${session.id}/participants`}>
                                Daftar Peserta
                            </Link>
                        </Button>
                        <Button asChild variant="secondary">
                            <Link href={route('psikolog2.reportIndex', session.id)}>
                                Hasil
                            </Link>
                        </Button>
                    </div>
                )}
                <div className="mb-6 w-10/12 mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="text-blue-800">
                                    Kode Sesi: {session.code}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-slate-100 rounded-lg min-h-[200px]">
                                    <p className="text-gray-700">{session.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-sm text-gray-600">
                                            Start Date - End Date
                                        </CardTitle>
                                        <CardDescription className="text-blue-800 font-bold text-base mt-1">
                                            {new Date(
                                                session.start_date
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}{" "}
                                            -{" "}
                                            {new Date(
                                                session.end_date
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </CardDescription>
                                    </div>
                                    {!isTestEnded && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsModalOpen(true)}
                                        >
                                            <PencilIcon className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h5 className="text-sm text-gray-600">Durasi Studi Kasus:</h5>
                                    <p className="text-blue-800 font-bold">
                                        {session.duration_1} menit
                                    </p>
                                </div>

                                <div>
                                    <h5 className="text-sm text-gray-600">Durasi Intray Analisis:</h5>
                                    <p className="text-blue-800 font-bold">
                                        {session.duration_2} menit
                                    </p>
                                </div>

                                <div>
                                    <h5 className="text-sm text-gray-600">Durasi Kuisioner Perilaku:</h5>
                                    <p className="text-blue-800 font-bold">
                                        {session.duration_3} menit
                                    </p>
                                </div>

                                <div>
                                    <h5 className="text-sm text-gray-600 mb-2">Paket Soal</h5>
                                    <div className="flex flex-wrap gap-2">
                                        {paket.map((item, index) => (
                                            <Badge key={index} variant="secondary">
                                                {item.nama}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    {isTestEnded && (
                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle className="text-center text-2xl text-blue-800">
                                    Jawaban User
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>No</TableHead>
                                            <TableHead>Nama</TableHead>
                                            <TableHead className="text-center">Score Bot</TableHead>
                                            <TableHead className="text-center">Score Psikolog</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {user_result.length > 0 ? (
                                            user_result.map((rowData, index) => (
                                                <TableRow key={rowData.id}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{rowData.name}</TableCell>
                                                    <TableCell className="text-center">
                                                        {rowData.total_score_bot}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {rowData.total_score_psikolog}
                                                    </TableCell>
                                                    <TableCell>
                                                        {actionBodyTemplate(rowData, index + 1)}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-gray-500">
                                                    No data found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </AuthenticatedLayout>
            {isModalOpen && (
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={session}
                    paket={testCollection}
                />
            )}
        </>
    );
};

export default DetailSession;
