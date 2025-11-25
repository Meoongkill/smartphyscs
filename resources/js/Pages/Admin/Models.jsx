import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import AddModelModal from "./AddModelModal";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import { CpuChipIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default function Users({ auth, users }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileTraining, setFileTraining] = useState(null);
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-center font-semibold text-4xl text-blue-800 leading-tight">
                    Data Model
                </h2>
            }
            pages={'model'}
        >
            <Head title="Dashboard" />
            <div className="p-6 space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="space-y-2">
                                <CardTitle className="text-2xl font-semibold text-gray-900">
                                    Model Management
                                </CardTitle>
                                <CardDescription className="text-base text-gray-600">
                                    Kelola model machine learning untuk sistem prediksi psikologi.
                                </CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-auto"
                                >
                                    <CpuChipIcon className="w-5 h-5 mr-2" />
                                    Train Model
                                </Button>
                                <div className="relative">
                                    <Button
                                        variant="outline"
                                        className="w-full sm:w-48 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 h-auto"
                                    >
                                        <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                                        Upload Data Training
                                    </Button>
                                    <Input
                                        type="file"
                                        onChange={(e) => setFileTraining(e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        name="file_training"
                                        id="file_training"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border rounded-lg overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="text-center font-semibold text-gray-900">Versi</TableHead>
                                        <TableHead className="text-center font-semibold text-gray-900">Log Perubahan</TableHead>
                                        <TableHead className="text-center font-semibold text-gray-900">Tanggal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow className="hover:bg-gray-50/50">
                                        <TableCell className="text-center font-medium text-gray-900">
                                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                                v1.0.0
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-gray-600">
                                            Initial model training
                                        </TableCell>
                                        <TableCell className="text-center text-gray-600">
                                            2024-01-15
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <AddModelModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                }}
            />
        </AuthenticatedLayout>
    );
}
