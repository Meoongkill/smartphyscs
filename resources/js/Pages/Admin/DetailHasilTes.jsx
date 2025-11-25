import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { ChevronLeftIcon, ChevronRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

function UnsafeComponent({html}) {
    return <div dangerouslySetInnerHTML={
        {__html: html}
    }/>;
}

export default function DetailHasilTes({ auth, questions, answers, result, endpoints }) {
    const formattedDate = new Date(result.created_at).toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const [currentEndpoint, setCurrentEndpoint] = useState('0/0');
    const isFirstEndpoint = endpoints.length > 0 && currentEndpoint === endpoints[0];
    const isLastEndpoint = endpoints.length > 0 && currentEndpoint === endpoints[endpoints.length - 1];

    useEffect(() => {
        sessionStorage.setItem('endpoints', endpoints);
    }, [endpoints]);

    useEffect(() => {
        const path = window.location.pathname;
        const fractionMatch = path.match(/admin\/detail_test\/(\d+)\/(\d+)/);
        if (fractionMatch) {
            const numerator = fractionMatch[1];
            const denominator = fractionMatch[2];
            setCurrentEndpoint(`${numerator}/${denominator}`);
        }
    }, []);

    const handlePrev = () => {
        const currentIndex = endpoints.indexOf(currentEndpoint);
        if (currentIndex > 0) {
            const prevEndpoint = endpoints[currentIndex - 1];
            setCurrentEndpoint(prevEndpoint);
            updateUrl(prevEndpoint);
        }
    };

    const handleNext = () => {
        const currentIndex = endpoints.indexOf(currentEndpoint);
        if (currentIndex < endpoints.length - 1) {
            const nextEndpoint = endpoints[currentIndex + 1];
            setCurrentEndpoint(nextEndpoint);
            updateUrl(nextEndpoint);
        }
    };

    const updateUrl = (endpoint) => {
        const url = `/admin/detail_test/${endpoint}`;
        location.replace(url);
    };
      
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="text-center font-bold text-3xl text-blue-800 leading-tight">
                    Detail Hasil Assessment
                </h2>
            }
        >
            <Head title="Assessment Result" />
            <div className="p-6 space-y-6">
                {/* Navigation Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <Button
                        onClick={handlePrev}
                        disabled={isFirstEndpoint}
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        <ChevronLeftIcon className="w-4 h-4 mr-2" />
                        Sebelumnya
                    </Button>
                    
                    <Button
                        onClick={() => location.href = `/detail-test/${result.test_id}/hasil`}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Kembali ke Daftar Hasil
                    </Button>
                    
                    <Button
                        onClick={handleNext}
                        disabled={isLastEndpoint}
                        variant="outline"
                        className="w-full sm:w-auto"
                    >
                        Selanjutnya
                        <ChevronRightIcon className="w-4 h-4 ml-2" />
                    </Button>
                </div>

                {/* User Information Card */}
                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="bg-blue-600 text-white rounded-t-lg">
                        <CardTitle className="text-xl font-semibold">
                            Informasi Peserta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Nama</p>
                                <p className="text-lg font-semibold text-gray-900">{result.users.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Email</p>
                                <p className="text-lg text-gray-900">{result.users.email}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Tanggal Pengerjaan</p>
                                <p className="text-lg text-gray-900">{formattedDate}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Questions and Answers */}
                <div className="space-y-6">
                    {questions.map((question, questionIndex) => (
                        <Card key={questionIndex} className="border-l-4 border-l-green-500">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <CardTitle className="text-xl font-semibold text-gray-900">
                                        Pertanyaan {questionIndex + 1}
                                    </CardTitle>
                                    <Badge variant="secondary" className="w-fit">
                                        Dimensi: {question.dimensi}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Question Content */}
                                <div className="bg-gray-50 p-4 rounded-lg border">
                                    <UnsafeComponent html={question.pertanyaan} />
                                </div>

                                {/* Answers */}
                                {answers
                                    .filter((answer) => answer.question_id === question.id)
                                    .map((filteredAnswer, answerIndex) => (
                                        <div key={answerIndex} className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                            <div className="lg:col-span-3">
                                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                                    <p className="text-sm font-medium text-blue-700 mb-2">Jawaban Peserta:</p>
                                                    <p className="text-gray-900">{filteredAnswer.jawaban}</p>
                                                </div>
                                            </div>
                                            <div className="lg:col-span-1">
                                                <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                                                    <p className="text-sm font-medium text-green-700 mb-2">Label Prediksi</p>
                                                    <Badge 
                                                        variant="outline" 
                                                        className="bg-green-100 text-green-800 border-green-300 text-lg font-bold"
                                                    >
                                                        {filteredAnswer.skor}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
