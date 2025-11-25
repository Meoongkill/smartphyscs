import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import Modal from "@/Pages/Admin/SesiTes/AddSesiTes";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
export default function HasilTes({ auth, session, user_result }) {
    console.log("user result:", user_result);
    // const handleDetail = (id) => {
    //     console.log(id);
    // };

    const scoreBotTemplate = (rowData) => {
        return (
            <div className="text-center">
                {rowData.total_score_bot !== null ? rowData.total_score_bot : 0}
            </div>
        );
    };

    const scoreHumanTemplate = (rowData) => {
        return (
            <div className="text-center">
                {rowData.total_score_psikolog !== null ? rowData.total_score_psikolog : 0}
            </div>
        );
    };
    const actionBodyTemplate = (rowData, session) => {
        return (
            <div className="flex">
                <Link href={`/psikolog/result/${rowData.id}/${session}`}>
                    <Button variant="default" size="sm" className="bg-blue-800 hover:bg-blue-700">
                        Detail
                    </Button>
                </Link>
                {/* <Button
                    variant="default" 
                    size="sm"
                    onClick={() => handleDetail(rowData)}
                >
                    Validasi
                </Button> */}
            </div>
        );
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-4xl text-blue-800 leading-tight text-center">
                    Jawaban Asesmen {session.name}
                </h2>
            }
        >
            <Head title="Dashboard" />
            {/* <div className="py-8">
                <div className="mx-auto">
                    <div className="bg-white overflow-hidden sm:rounded-lg">
                        <div className="">
                            <div className="sm:flex sm:items-center">
                                <div className="sm:flex-auto">
                                    <h1 className="text-xl font-semibold text-gray-900">
                                        Deskripsi
                                    </h1>
                                    <p className="mt-2 text-base text-gray-700">
                                        {session[0]?.description}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 flex flex-col">
                                <input
                                    type="text"
                                    placeholder="Cari Pengguna"
                                    className="w-full mb-5 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-300 border ">
                                                <thead className="bg-gray-50 ">
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-base font-semibold text-gray-900 sm:pl-6 text-center"
                                                        >
                                                            Nama
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-base font-semibold text-gray-900 text-center"
                                                        >
                                                            Email
                                                        </th>

                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-base font-semibold text-gray-900 text-center"
                                                        >
                                                            Detail
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white text-center">
                                                    {filteredResults.map(
                                                        (tes) => (
                                                            <tr key={tes.skor}>
                                                                <td className="py-4 pl-4 pr-3 text-base font-medium text-gray-900 sm:pl-6 w-1/4">
                                                                    {
                                                                        tes
                                                                            .users
                                                                            .name
                                                                    }
                                                                </td>
                                                                <td className="px-3 py-4 text-base text-gray-500 w-1/4">
                                                                    {
                                                                        tes
                                                                            .users
                                                                            .email
                                                                    }
                                                                </td>

                                                                <td className="px-3 py-4 text-base text-gray-500 w-1/4">
                                                                    <a
                                                                        href={`/psikolog/result-detail/${tes.users.id}/${session[0].id}`}
                                                                        type="button"
                                                                        className=" items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
                                                                    >
                                                                        Detail
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="mb-6 w-10/12 mx-auto">
                <Card className="pt-20">
                    <CardHeader>
                        <CardTitle>Hasil Tes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead className="text-center">Score Bot</TableHead>
                                    <TableHead className="text-center">Score Psikolog</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {user_result && user_result.length > 0 ? (
                                    user_result.map((rowData, index) => (
                                        <TableRow key={rowData.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{rowData.name}</TableCell>
                                            <TableCell className="text-center">
                                                {scoreBotTemplate(rowData)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {scoreHumanTemplate(rowData)}
                                            </TableCell>
                                            <TableCell>
                                                {actionBodyTemplate(rowData, session.id)}
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
            </div>
        </AuthenticatedLayout>
    );
}
