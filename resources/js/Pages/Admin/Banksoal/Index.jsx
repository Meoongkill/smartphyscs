import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PlusIcon, MagnifyingGlassIcon, DocumentArrowUpIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import ImporExcelModal from "./ImporExcelModal";
import LexicalViewer from "@/Components/LexicalViewer";


const Index = ({ auth, questions }) => {
    const datasoal = questions;
    const [searchInput, setSearchInput] = useState("");
    const [filteredData, setFilteredData] = useState(datasoal);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const filtered = datasoal.filter(
            (soal) =>
                soal.pertanyaan
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()) ||
                soal.dimensi
                    .toLowerCase()
                    .includes(searchInput.toLowerCase()) ||
                soal.kode.toLowerCase().includes(searchInput.toLowerCase())
        );
        setFilteredData(filtered);
    }, [searchInput, datasoal]);


    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const questionBodyTemplate = (rowData) => {
        return (
            <span
                className="line-clamp-2 h-fit my-auto"
                dangerouslySetInnerHTML={{ __html: rowData.pertanyaan }}
            />
        );
    };

    const actionBodyTemplate = (rowData, nomorSoal) => {
        rowData.nomorSoal = nomorSoal;
        return (
            <div className="justify-center flex">
                <Link
                    className="flex flex-row bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    href={`/bank-soal/${rowData.kode}`}
                >
                    Detail
                </Link>
            </div>
        );
    };

    const mapDataTypeToDisplayText = (dataType) => {
        switch (dataType) {
            case "studi_kasus":
                return "Studi Kasus";
            case "intray_analisis":
                return "Intray Analisis";
            case "kuisioner_perilaku":
                return "Kuisioner Perilaku";
            default:
                return dataType;
        }
    };


    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="mx-auto py-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-semibold text-blue-800 text-center">
                            Bank Soal
                        </CardTitle>
                        <CardDescription className="text-center">
                            Kelola dan atur koleksi soal assessment
                        </CardDescription>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
                            <div>
                                <CardTitle className="text-xl font-semibold text-gray-900">
                                    Daftar Soal
                                </CardTitle>
                                <CardDescription>
                                    Total {filteredData.length} soal tersedia
                                </CardDescription>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Button
                                    onClick={() => location.href = '/bank-soal/create'}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Tambah Soal
                                </Button>
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    variant="outline"
                                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                >
                                    <DocumentArrowUpIcon className="w-4 h-4 mr-2" />
                                    Upload Excel
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search Input */}
                        <div className="relative max-w-md">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Cari berdasarkan kode, dimensi, atau soal..."
                                className="pl-10"
                                onChange={handleSearch}
                                value={searchInput}
                            />
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-50">
                                        <TableHead className="font-semibold text-blue-900 w-16">No</TableHead>
                                        <TableHead className="font-semibold text-blue-900">Kode Soal</TableHead>
                                        <TableHead className="font-semibold text-blue-900">Tipe Soal</TableHead>
                                        <TableHead className="font-semibold text-blue-900">Dimensi</TableHead>
                                        <TableHead className="font-semibold text-blue-900">Soal</TableHead>
                                        <TableHead className="font-semibold text-blue-900 text-center">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredData.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                {searchInput ? 'Tidak ada soal yang ditemukan' : 'Belum ada soal tersedia'}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredData.map((soal, index) => (
                                            <TableRow key={soal.id} className="hover:bg-gray-50">
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    <Badge variant="outline" className="bg-gray-100">
                                                        {soal.kode}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant="secondary"
                                                        className="bg-blue-100 text-blue-800"
                                                    >
                                                        {mapDataTypeToDisplayText(soal.type)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant="outline"
                                                        className="bg-green-50 text-green-700 border-green-200"
                                                    >
                                                        {soal.dimensi}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="max-w-md">
                                                    {typeof soal.pertanyaan === 'string' && soal.pertanyaan.trim().startsWith('{') ? (
                                                        <LexicalViewer
                                                            value={soal.pertanyaan}
                                                            className="line-clamp-2 text-sm text-gray-600"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="line-clamp-2 text-sm text-gray-600"
                                                            dangerouslySetInnerHTML={{ __html: soal.pertanyaan }}
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Button
                                                        onClick={() => location.href = `/bank-soal/${soal.kode}`}
                                                        size="sm"
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    >
                                                        Detail
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

                {/* Modal */}
                {isModalOpen && (
                    <ImporExcelModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
