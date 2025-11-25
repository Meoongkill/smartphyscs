import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Search } from 'lucide-react';
import { Inertia } from "@inertiajs/inertia";
import { router } from "@inertiajs/react";


const SessionParticipant = ({ auth, session, sessionParticipants }) => {
    const datauser = sessionParticipants;
    const [searchInput, setSearchInput] = useState("");
    const [filteredData, setFilteredData] = useState(datauser);
    console.log(datauser);
    // console.log(sessionParticipants);
    useEffect(() => {
        const filtered = datauser.filter((data) =>
            data.user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        data.user.nik.includes(searchInput.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchInput, datauser]);

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const questionBodyTemplate = (rowData) => {
        return (
            <span dangerouslySetInnerHTML={{ __html: rowData.pertanyaan }} />
        );
    };

    const handleDelete = (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus peserta ini?")) {
            Inertia.delete(`/session/${id}/participants/delete`, {
                onSuccess: () => {
                    alert("Peserta berhasil dihapus.");
                },
                onError: () => {
                    alert("Gagal menghapus peserta.");
                },
            });
            router.visit(`/session/${session.code}`);
        }
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex justify-center">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(rowData.id)}
                >
                    <TrashIcon className="w-4 h-4 mr-1" />
                    Delete
                </Button>
            </div>
        );
    };
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    Daftar Peserta Sesi {session.name}
                </h1>
                <Button asChild>
                    <a href={`/session/${session.id}/participants/create`}>
                        <Search className="w-5 h-5 mr-2" />
                        Tambah Peserta
                    </a>
                </Button>
            </div>

            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                    type="text"
                    placeholder="Cari peserta..."
                    value={searchInput}
                    onChange={handleSearch}
                    className="pl-10"
                />
            </div>
            </div>
            <br />
            <br />
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Peserta</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No</TableHead>
                                <TableHead>NIK</TableHead>
                                <TableHead>Nama Peserta</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((participant, index) => (
                                    <TableRow key={participant.id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{participant.user.nik}</TableCell>
                                        <TableCell>{participant.user.name}</TableCell>
                                        <TableCell>{participant.user.email}</TableCell>
                                        <TableCell className="text-center">
                                            {actionBodyTemplate(participant)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
};

export default SessionParticipant;
