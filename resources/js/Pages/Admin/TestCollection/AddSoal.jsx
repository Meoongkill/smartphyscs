import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Lottie from "lottie-react";
import NotFoundAnimation from "@/Assets/NotFoundAnimation.json";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";

export default function AddSoal({ auth, testCollection, questions }) {

    const [searchTerm, setSearchTerm] = useState("");
    const [filteredQuestions, setFilteredQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
    });

    useEffect(() => {
        const filteredData = questions.filter((question) =>
            question.pertanyaan.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredQuestions(filteredData);
    }, [searchTerm, questions]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleAddSoal = (e) => {
        e.preventDefault();
        const data = selectedQuestions.map((question) => ({
            test_collection_id: testCollection.id,
            question_id: question.id,
        }));
        const requestData = {
            requests: data,
        };
        axios.post("/test-collection/add-question", requestData).then((res) => {
            toast.fire({
                icon: res.data.error ? "error" : "success",
                title: res.data.message,
            });
            router.visit(`/test-collection/${testCollection.kode}`);

        });
    };

    const questionBodyTemplate = (rowData) => {
        return (
            <div>
                <span
                    className="line-clamp-2 h-fit my-auto"
                    dangerouslySetInnerHTML={{ __html: rowData.pertanyaan }}
                />
                {rowData.pertanyaan.length > 10 && (
                    <Link
                        href={`/test-collection/detail/${rowData.id}`}
                        className="p-button-link"
                    >
                        Selengkapnya
                    </Link>
                )}
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
            <div>
                <h1 className="text-center text-3xl font-semibold text-blue-800 mb-10">
                    Tambah Soal
                </h1>
                {questions.length > 0 ? (
                    <>
                        <div className="flex justify-start w-full mb-4">
                            <div className="relative w-full">
                                <Input
                                    type="text"
                                    placeholder="Cari Soal"
                                    onChange={handleSearch}
                                    className="pl-10"
                                />
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                        <div className="flex justify-end w-full">
                            <Button onClick={handleAddSoal}>
                                <PlusIcon className="h-4 w-4 mr-2" />
                                Tambahkan
                            </Button>
                        </div>
                    </>
                ) : null}
                {filteredQuestions.length === 0 ? (
                    <div className="px-4 flex flex-col justify-center items-center w-full flex-grow">
                        <Lottie
                            animationData={NotFoundAnimation}
                            loop={true}
                            className="h-96 w-auto"
                        />
                        <p className="font-poppins text-lg">Belum ada soal</p>
                    </div>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Daftar Soal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedQuestions(filteredQuestions);
                                                    } else {
                                                        setSelectedQuestions([]);
                                                    }
                                                }}
                                            />
                                        </TableHead>
                                        <TableHead>Kode Soal</TableHead>
                                        <TableHead>Tipe Soal</TableHead>
                                        <TableHead>Dimensi</TableHead>
                                        <TableHead>Soal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredQuestions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center">
                                                No data found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredQuestions.map((question) => (
                                            <TableRow key={question.id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedQuestions.some(q => q.id === question.id)}
                                                        onCheckedChange={(checked) => {
                                                            if (checked) {
                                                                setSelectedQuestions([...selectedQuestions, question]);
                                                            } else {
                                                                setSelectedQuestions(selectedQuestions.filter(q => q.id !== question.id));
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{question.kode}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {mapDataTypeToDisplayText(question.type)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{question.dimensi}</TableCell>
                                                <TableCell className="max-w-xs">
                                                    <div 
                                                        className="line-clamp-2"
                                                        dangerouslySetInnerHTML={{ 
                                                            __html: question.pertanyaan 
                                                        }} 
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            {selectedQuestions.length > 0 && (
                                <div className="mt-4 text-sm text-gray-600">
                                    {selectedQuestions.length} soal dipilih
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
