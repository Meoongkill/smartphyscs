import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import React from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { 
    ClipboardDocumentListIcon, 
    EyeIcon, 
    CalendarDaysIcon,
    UserGroupIcon,
    ChartBarIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";

export default function Dashboard(props) {
    const { auth, sessions } = props;

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Psikolog" />
            
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
                {/* Header Section */}
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
                            <UserGroupIcon className="w-4 h-4 mr-2" />
                            Selamat datang, {auth.user.name}
                        </div>
                        
                        <h1 className="text-4xl lg:text-5xl font-bold text-green-900 mb-4">
                            Dashboard Psikolog
                        </h1>
                        
                        <p className="text-xl text-green-700 leading-relaxed max-w-3xl">
                            Kelola dan review hasil asesmen psikologi dengan mudah. 
                            Akses semua sesi asesmen yang memerlukan tinjauan profesional Anda.
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">Total Sesi</p>
                                        <p className="text-3xl font-bold text-green-900">{sessions?.length || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <CalendarDaysIcon className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600">Perlu Review</p>
                                        <p className="text-3xl font-bold text-blue-900">
                                            {sessions?.filter(session => !session.reviewed)?.length || 0}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <ClipboardDocumentListIcon className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-600">Selesai</p>
                                        <p className="text-3xl font-bold text-purple-900">
                                            {sessions?.filter(session => session.reviewed)?.length || 0}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                        <ChartBarIcon className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-orange-600">Laporan</p>
                                        <p className="text-3xl font-bold text-orange-900">{sessions?.length || 0}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                        <DocumentTextIcon className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sessions List */}
                    <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-2xl font-bold text-green-900 flex items-center">
                                <ClipboardDocumentListIcon className="w-6 h-6 mr-2" />
                                Sesi Asesmen yang Perlu Direview
                            </CardTitle>
                            <CardDescription className="text-green-700">
                                Daftar sesi asesmen yang memerlukan tinjauan dan analisis profesional Anda
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {sessions && sessions.length > 0 ? (
                                <div className="space-y-4">
                                    {sessions.map((session, index) => (
                                        <div 
                                            key={index}
                                            className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-green-50 rounded-lg border border-green-100 hover:shadow-md transition-all duration-300"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                        <CalendarDaysIcon className="w-6 h-6 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-green-900">
                                                            Sesi #{session.id || index + 1}
                                                        </h3>
                                                        <p className="text-green-700">
                                                            {session.name || `Sesi Asesmen ${index + 1}`}
                                                        </p>
                                                        <div className="flex items-center space-x-4 mt-2 text-sm text-green-600">
                                                            <span>Kode: {session.code || 'N/A'}</span>
                                                            <span>•</span>
                                                            <span>Tanggal: {session.date || new Date().toLocaleDateString('id-ID')}</span>
                                                            {session.participants && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{session.participants} Peserta</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-3">
                                                {session.reviewed ? (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        ✓ Selesai
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Perlu Review
                                                    </span>
                                                )}
                                                
                                                <Link href={`/psikolog/detail/${session.id || index + 1}`}>
                                                    <Button 
                                                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                                    >
                                                        <EyeIcon className="w-4 h-4 mr-2" />
                                                        Detail
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ClipboardDocumentListIcon className="w-12 h-12 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-green-900 mb-2">
                                        Belum Ada Sesi Asesmen
                                    </h3>
                                    <p className="text-green-600 max-w-md mx-auto">
                                        Saat ini belum ada sesi asesmen yang perlu direview. 
                                        Sesi baru akan muncul di sini ketika ada peserta yang menyelesaikan asesmen.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-green-900 mb-6">Aksi Cepat</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <ChartBarIcon className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                                        Laporan Analisis
                                    </h3>
                                    <p className="text-green-700 text-sm">
                                        Lihat laporan komprehensif dari semua asesmen yang telah selesai
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <DocumentTextIcon className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                                        Template Laporan
                                    </h3>
                                    <p className="text-green-700 text-sm">
                                        Kelola template laporan untuk berbagai jenis asesmen psikologi
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm cursor-pointer">
                                <CardContent className="p-6 text-center">
                                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <UserGroupIcon className="w-8 h-8 text-orange-600" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-green-900 mb-2">
                                        Profil Peserta
                                    </h3>
                                    <p className="text-green-700 text-sm">
                                        Lihat dan kelola profil peserta yang telah mengikuti asesmen
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
