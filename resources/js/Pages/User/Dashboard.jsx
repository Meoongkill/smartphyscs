import AuthenticatedLayout from "@/Layouts/AuthenticatedUserLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import InputCodeModal from "./Modal/InputCodeModal";
import KebijakanTesModal from "./Modal/KebijakanTesModal";
import AgendaTesModal from "./Modal/AgendaTesModal";
import axios from "axios";
import Swal from "sweetalert2";
import { PlayIcon, ClipboardDocumentListIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export default function Dashboard(props) {
    const { auth, enrolled } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isKebijakanTesModalOpen, setIsKebijakanTesModalOpen] = useState(false);
    const [isAgendaTesModalOpen, setIsAgendaTesModalOpen] = useState(false);
    const [sessionData, setSessionData] = useState();
    const [code, setCode] = useState("");
    
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
    });

    const handleInputCodeSubmit = (e) => {
        e.preventDefault();
        axios.get(`/validate-test/${code}`).then((res) => {
            console.log("error", res);
            toast.fire({
                icon: res.data.error ? "error" : "success",
                title: res.data.message,
                padding: "10px 20px",
            });
            if (!res.data.error) {
                setIsModalOpen(false);
                setIsKebijakanTesModalOpen(true);
                console.log(res.data.data);
                setSessionData(res.data.data);
            }
        });
    };

    const handleButtonBersedia = () => {
        setIsKebijakanTesModalOpen(false);
        setIsAgendaTesModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsKebijakanTesModalOpen(false);
        setIsAgendaTesModalOpen(false);
        setCode("");
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
                {/* Hero Section */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="space-y-6">
                                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    <UserGroupIcon className="w-4 h-4 mr-2" />
                                    Selamat datang, {auth.user.name}
                                </div>
                                
                                <h1 className="text-5xl lg:text-6xl font-bold text-blue-900 leading-tight">
                                    SmartPsy Assessment
                                </h1>
                                
                                <p className="text-xl text-blue-700 leading-relaxed max-w-2xl">
                                    Asisten Penilaian Asesmen Psikologi Berbasis Artificial Intelligence. 
                                    Mulai perjalanan asesmen psikologi Anda dengan teknologi terdepan.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                    size="lg"
                                >
                                    <PlayIcon className="w-5 h-5 mr-2" />
                                    Mulai Asesmen
                                </Button>
                                
                                <Button
                                    variant="outline"
                                    className="border-blue-300 text-blue-700 hover:bg-blue-50 py-4 px-8 rounded-lg font-semibold"
                                    size="lg"
                                >
                                    <ClipboardDocumentListIcon className="w-5 h-5 mr-2" />
                                    Panduan Asesmen
                                </Button>
                            </div>
                        </div>

                        {/* Right Content - Hero Image */}
                        <div className="relative">
                            <div 
                                className="w-full h-96 lg:h-[500px] bg-no-repeat bg-contain bg-center"
                                style={{
                                    backgroundImage: "url('/img/bguser.svg')",
                                }}
                            />
                            {/* Decorative elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200 rounded-full opacity-20"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-300 rounded-full opacity-20"></div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-blue-900 mb-4">
                            Mengapa Memilih SmartPsy Assessment?
                        </h2>
                        <p className="text-blue-700 text-lg max-w-2xl mx-auto">
                            Platform asesmen psikologi yang menggunakan teknologi AI untuk memberikan hasil yang akurat dan komprehensif
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="text-center pb-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ClipboardDocumentListIcon className="w-8 h-8 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl font-bold text-blue-900">
                                    Asesmen Komprehensif
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-blue-700">
                                    Tes psikologi yang dirancang secara ilmiah untuk mengukur berbagai aspek kepribadian dan kemampuan kognitif
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="text-center pb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-xl font-bold text-blue-900">
                                    Hasil Akurat
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-blue-700">
                                    Menggunakan algoritma AI terdepan untuk menganalisis hasil tes dan memberikan interpretasi yang tepat
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="text-center pb-4">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-xl font-bold text-blue-900">
                                    Proses Cepat
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-center text-blue-700">
                                    Dapatkan hasil asesmen dalam waktu singkat dengan proses yang efisien dan user-friendly
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isModalOpen && (
                <InputCodeModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSubmit={handleInputCodeSubmit}
                    code={code}
                    setCode={setCode}
                />
            )}
            {isKebijakanTesModalOpen && (
                <KebijakanTesModal
                    isOpen={isKebijakanTesModalOpen}
                    onClose={closeModal}
                    handleButton={handleButtonBersedia}
                />
            )}
            {isAgendaTesModalOpen && (
                <AgendaTesModal
                    isOpen={isAgendaTesModalOpen}
                    onClose={closeModal}
                    data={sessionData}
                    code={code}
                />
            )}
        </AuthenticatedLayout>
    );
}
