import { Head, Link, router } from "@inertiajs/react";
import React, { useState } from "react";

export default function PesertaSesi({ participants, session, auth }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [showDropdown, setShowDropdown] = useState(false);
    const itemsPerPage = 10;

    // Calculate pagination
    const totalPages = Math.ceil(participants.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentParticipants = participants.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        router.visit(route('psikolog2.dashboard'));
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const handleCheckJawaban = (participantId) => {
        router.visit(route('psikolog2.jawaban', { sessionId: session.id, userId: participantId }));
    };

    const handleDownloadAll = () => {
        // Langsung redirect ke halaman Report-index untuk download semua dalam format PDF
        try {
            router.visit(route('psikolog2.reportIndex', session.id));
        } catch (e) {
            console.error('Gagal mengarahkan ke Report-index:', e);
        }
    };

    return (
        <>
            <Head title="Lihat Peserta Sesi" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white px-6 py-4 flex items-center justify-between border-b">
                    <div className="flex items-center gap-4">
                        <img src="/img/logo.png" alt="Smart Psych Assist" className="h-12" />
                    </div>

                    {/* User Account Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 font-medium transition"
                        >
                            <span>{auth?.user?.name || 'Psikolog'}</span>
                            <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-gray-200">
                                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                    <p className="text-sm font-semibold text-gray-800">{auth?.user?.name || 'User'}</p>
                                    <p className="text-xs text-gray-600">{auth?.user?.email || 'email@example.com'}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition flex items-center gap-2 text-red-600 font-medium"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="container mx-auto px-6 py-8">
                    {/* Title and Buttons */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-blue-600">Semua Peserta Sesi</h1>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleDownloadAll}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Download Data Peserta
                            </button>
                            <button 
                                onClick={handleBack}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentParticipants && currentParticipants.length > 0 ? currentParticipants.map((participant) => (
                            <div key={participant.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden border border-gray-200 flex flex-col transition">
                                <div className="p-6 flex flex-col">
                                    {/* Photo/Avatar */}
                                    <div className="flex justify-center mb-6">
                                        <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
                                            {participant.photo ? (
                                                <img 
                                                    src={participant.photo} 
                                                    alt={participant.name} 
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                </svg>
                                            )}
                                        </div>
                                    </div>

                                    {/* Border Line */}
                                    <div className="border-t border-blue-500 mb-4"></div>
                                    
                                    {/* Participant Info */}
                                    <div className="space-y-3 mb-6">
                                        {/* Name */}
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                            </svg>
                                            <span className="text-gray-700 text-sm">{participant.name || 'Muhammad Fathan Putra'}</span>
                                        </div>

                                        {/* Email */}
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                            </svg>
                                            <span className="text-gray-700 text-sm">{participant.email || 'fathan@gmail.com'}</span>
                                        </div>

                                        {/* Score/Questions */}
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
                                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
                                            </svg>
                                            <span className="text-gray-700 text-sm">{participant.total_questions || participant.total_answers || '70'}</span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleCheckJawaban(participant.id)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                                    >
                                        Check Jawaban
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">Tidak ada peserta yang tersedia</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination - Always show if there's data */}
                    {participants && participants.length > 0 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            {/* Previous Button */}
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition ${
                                    currentPage === 1 
                                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>

                            {/* Page Numbers */}
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNum = index + 1;
                                // Show first page, last page, current page, and pages around current
                                if (
                                    pageNum === 1 ||
                                    pageNum === totalPages ||
                                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-10 h-10 rounded-lg border transition ${
                                                currentPage === pageNum
                                                    ? 'border-blue-600 bg-blue-600 text-white'
                                                    : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                } else if (
                                    (pageNum === currentPage - 2 && currentPage > 3) ||
                                    (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                                ) {
                                    return <span key={pageNum} className="px-2 text-gray-500">...</span>;
                                }
                                return null;
                            })}

                            {/* Next Button */}
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition ${
                                    currentPage === totalPages 
                                        ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}