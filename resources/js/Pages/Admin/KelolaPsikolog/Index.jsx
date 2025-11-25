import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PlusIcon, MagnifyingGlassIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Input } from "@/Components/ui/input";
import { Badge } from "@/Components/ui/badge";
import { Inertia } from "@inertiajs/inertia";
import EditPsikologModal from "./EditPsikologModal";
import AddPsikologModal from "./AddPsikologModal";

const Index = ({ auth, data, sessions }) => {
    const dataPsikolog = data;

    const [searchInput, setSearchInput] = useState("");
    const [filteredData, setFilteredData] = useState(dataPsikolog);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    useEffect(() => {
        const filtered = dataPsikolog.filter(user =>
            // user.id.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.nik.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.email.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchInput, dataPsikolog]);

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const handleEdit = (data) => {
        console.log("edit user", data);
        setSelectedUser(data.id);
        setIsModalEditOpen(true);
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className=" mx-auto py-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-semibold text-blue-800 text-center">
                            Manajemen Psikolog
                        </CardTitle>
                        <CardDescription className="text-center">
                            Kelola data psikolog dalam sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                            <div className="relative w-full sm:w-96">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Cari Psikolog..."
                                    value={searchInput}
                                    onChange={handleSearch}
                                    className="pl-10"
                                />
                            </div>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-800 hover:bg-blue-700"
                            >
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Tambah Psikolog
                            </Button>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-16">No</TableHead>
                                        <TableHead>ID</TableHead>
                                        <TableHead>NIK</TableHead>
                                        <TableHead>Nama</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Nomor HP</TableHead>
                                        <TableHead>Alamat</TableHead>
                                        <TableHead className="text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                                Tidak ada data psikolog ditemukan
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredData.map((psikolog, index) => (
                                            <TableRow key={psikolog.id}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{psikolog.id}</Badge>
                                                </TableCell>
                                                <TableCell>{psikolog.nik}</TableCell>
                                                <TableCell className="font-medium">{psikolog.name}</TableCell>
                                                <TableCell>{psikolog.email}</TableCell>
                                                <TableCell>{psikolog.nohp}</TableCell>
                                                <TableCell className="max-w-xs truncate">{psikolog.alamat}</TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(psikolog)}
                                                        className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                                                    >
                                                        <PencilIcon className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {isModalOpen && (
                <AddPsikologModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    sessions={sessions}
                />
            )}
            {isModalEditOpen && (
                <EditPsikologModal
                    isOpen={isModalEditOpen}
                    onClose={() => setIsModalEditOpen(false)}
                    data={dataPsikolog}
                    selectedUserId={selectedUser}
                    sessions={sessions}
                />
            )}
        </AuthenticatedLayout>
    );
};

export default Index;
