import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { UserPlusIcon } from "@heroicons/react/24/outline";

export default function Users({ auth, users }) {
    const handleAddPsikolog = () => {
        Inertia.post("/users/add");
        window.location.reload();
    };
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-4xl text-blue-800 leading-tight">
                    Data Psikolog
                </h2>
            }
            pages={'pengguna'}
        >
            <Head title="Dashboard" />
            <div className="p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-2">
                                <CardTitle className="text-2xl font-semibold text-gray-900">
                                    Akun Psikolog
                                </CardTitle>
                                <CardDescription className="text-base text-gray-600 max-w-3xl">
                                    Daftar Akun Psikolog yang terdata pada sistem. Anda dapat menambahkan akun
                                    psikolog baru dengan menekan tombol "Tambah Psikolog" disamping.
                                    <br />
                                    Password default untuk semua akun baru adalah "psikolog123". User akan diminta
                                    untuk mengganti password ketika login pertama kali.
                                </CardDescription>
                            </div>
                            <Button
                                onClick={handleAddPsikolog}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-auto"
                            >
                                <UserPlusIcon className="w-5 h-5 mr-2" />
                                Tambah Psikolog
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="font-semibold text-gray-900">Nama</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Email</TableHead>
                                        <TableHead className="font-semibold text-gray-900">Role</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.email} className="hover:bg-gray-50/50">
                                            <TableCell className="font-medium text-gray-900">
                                                {user.name}
                                            </TableCell>
                                            <TableCell className="text-gray-600">
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                                                    {user.roles[0].name}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* <AddUserModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                }}
            /> */}
        </AuthenticatedLayout>
    );
}
