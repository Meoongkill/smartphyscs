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
import EditUserModal from "./EditUserModal";
import AddUserModal from "./AddUserModal";

const Index = ({ auth, users }) => {
    const dataUser = users;

    const [searchInput, setSearchInput] = useState("");
    const [filteredData, setFilteredData] = useState(dataUser);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    useEffect(() => {
        const filtered = dataUser.filter(user =>
            // user.id.includes(searchInput) ||
            user.nik.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
            user.email.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchInput, dataUser]);

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
                            Manajemen Peserta
                        </CardTitle>
                        <CardDescription className="text-center">
                            Kelola data peserta dalam sistem
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                            <div className="relative w-full sm:w-96">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Cari Peserta..."
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
                                Tambah Peserta
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
                                        <TableHead className="text-center w-24">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((user, index) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{user.id}</Badge>
                                                </TableCell>
                                                <TableCell>{user.nik}</TableCell>
                                                <TableCell className="font-medium">{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>{user.nohp}</TableCell>
                                                <TableCell className="max-w-xs truncate">{user.alamat}</TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(user)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                                Tidak ada data peserta ditemukan
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {isModalOpen && (
                <AddUserModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            {isModalEditOpen && (
                <EditUserModal
                    isOpen={isModalEditOpen}
                    onClose={() => setIsModalEditOpen(false)}
                    data={dataUser}
                    selectedUserId={selectedUser}
                />
            )}
        </AuthenticatedLayout>
    );
};

export default Index;
