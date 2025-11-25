import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Checkbox } from "@/Components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Search } from 'lucide-react';
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";
import axios from "axios";

const toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
});

const CreateSessionParticipant = ({ auth, session, users }) => {
    const datauser = users;
    const [searchInput, setSearchInput] = useState("");
    const [filteredData, setFilteredData] = useState(datauser);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        const filtered = datauser.filter(
            (data) =>
                data.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                data.nik.includes(searchInput)
        );
        setFilteredData(filtered);
    }, [searchInput, datauser]);

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSubmit = () => {
        const users = selectedUsers.map((user) => ({
            session_id: session.id,
            user_id: user.id,
        }));
        axios.post(`/session/${session.id}/participants/add`, { users: users }).then((res) => {
            toast.fire({
                icon: res.data.error ? "error" : "success",
                title: res.data.message,
            });
            router.visit(`/session/${res.data.kode}`);
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="container mx-auto px-4">
                <h1 className="text-center text-3xl font-semibold text-blue-800 mb-10">
                    Tambah Peserta sesi {session.name}
                </h1>
                <div className="relative mb-6 w-[50%] mx-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search by name or NIK..."
                        className="pl-10"
                        onChange={handleSearch}
                        value={searchInput}
                    />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Select Participants</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">
                                    <Checkbox
                                        checked={selectedUsers.length === filteredData.length && filteredData.length > 0}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setSelectedUsers(filteredData);
                                            } else {
                                                setSelectedUsers([]);
                                            }
                                        }}
                                    />
                                </TableHead>
                                <TableHead>No</TableHead>
                                <TableHead>NIK</TableHead>
                                <TableHead>Nama Peserta</TableHead>
                                <TableHead>Email</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedUsers.some(selected => selected.id === user.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedUsers([...selectedUsers, user]);
                                                    } else {
                                                        setSelectedUsers(selectedUsers.filter(selected => selected.id !== user.id));
                                                    }
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{user.nik}</TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
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
                    <div className="mt-6 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            {selectedUsers.length} of {filteredData.length} participants selected
                        </p>
                        <Button
                            onClick={handleSubmit}
                            disabled={selectedUsers.length === 0}
                        >
                            Add Selected Participants
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </AuthenticatedLayout>
    );
};

export default CreateSessionParticipant;
