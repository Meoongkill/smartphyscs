import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { EyeIcon, CpuChipIcon } from "@heroicons/react/24/outline";

export default function HasilTes({ auth, results, test }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingId, setLoadingId] = useState(null);

    const handlePrediksi = async (resultId) => {
        setIsLoading(true);
        setLoadingId(resultId);
        try {
            const response = await fetch(`/admin/predict/${resultId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            if (response.ok) {
                // Refresh the page to show updated results
                window.location.reload();
            } else {
                console.error('Prediction failed');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
            setLoadingId(null);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-center font-bold text-3xl text-blue-800 leading-tight">
                    Hasil Assessment {test.nama_test}
                </h2>
            }
        >
            <Head title="Hasil Assessment" />
            <div className="p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-900">
                            Daftar Hasil Assessment
                        </CardTitle>
                        <CardDescription>
                            Kelola dan lihat hasil assessment dari peserta untuk tes "{test.nama_test}"
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-50">
                                        <TableHead className="font-semibold text-blue-900">No</TableHead>
                                        <TableHead className="font-semibold text-blue-900">Nama</TableHead>
                                        <TableHead className="font-semibold text-blue-900">Email</TableHead>
                                        <TableHead className="font-semibold text-blue-900">Tanggal</TableHead>
                                        <TableHead className="font-semibold text-blue-900">Status</TableHead>
                                        <TableHead className="font-semibold text-blue-900 text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                Belum ada hasil assessment untuk tes ini
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        results.map((result, index) => (
                                            <TableRow key={result.id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell className="font-medium text-gray-900">
                                                    {result.users.name}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {result.users.email}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {new Date(result.created_at).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={result.is_predicted ? "default" : "secondary"}
                                                        className={
                                                            result.is_predicted 
                                                                ? "bg-green-100 text-green-800 border-green-300" 
                                                                : "bg-yellow-100 text-yellow-800 border-yellow-300"
                                                        }
                                                    >
                                                        {result.is_predicted ? 'Sudah Diprediksi' : 'Belum Diprediksi'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-2">
                                                        {!result.is_predicted && (
                                                            <Button
                                                                onClick={() => handlePrediksi(result.id)}
                                                                disabled={isLoading && loadingId === result.id}
                                                                size="sm"
                                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                                            >
                                                                <CpuChipIcon className="w-4 h-4 mr-1" />
                                                                {isLoading && loadingId === result.id ? 'Loading...' : 'Prediksi'}
                                                            </Button>
                                                        )}
                                                        <Button
                                                            onClick={() => location.href = `/admin/detail_test/${result.id}/${test.id}`}
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-green-300 text-green-700 hover:bg-green-50"
                                                        >
                                                            <EyeIcon className="w-4 h-4 mr-1" />
                                                            Detail
                                                        </Button>
                                                    </div>
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
        </AuthenticatedLayout>
    );
}
