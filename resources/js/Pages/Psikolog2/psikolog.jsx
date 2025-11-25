import { Head, Link, router } from "@inertiajs/react";
import React, { useState } from "react";

export default function SesiPsikologi({ sessions, auth }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const handleSelectSession = (sessionId) => {
        router.visit(route('psikolog2.peserta', sessionId));
    };

    // Pagination logic
    const totalSessions = sessions?.length || 0;
    const totalPages = Math.ceil(totalSessions / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentSessions = sessions?.slice(startIndex, endIndex) || [];

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Show first page
            pageNumbers.push(1);
            
            // Calculate range around current page
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);
            
            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pageNumbers.push('...');
            }
            
            // Add pages around current page
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
            
            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }
            
            // Show last page
            if (totalPages > 1) {
                pageNumbers.push(totalPages);
            }
        }
        
        return pageNumbers;
    };

    return (
        <>
            <Head title="Sesi Psikologi" />
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
                    {/* Title */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-blue-600">Sesi Psikologi</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentSessions && currentSessions.length > 0 ? currentSessions.map((session) => (
                            <div key={session.id} className="bg-white rounded-2xl shadow-md hover:shadow-lg overflow-hidden border border-gray-200 flex flex-col h-full transition">
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold mb-3 line-clamp-2 min-h-[3.5rem]">
                                        {session.name || 'Sesi Evaluasi Psikologi Komprehensif'}
                                    </h3>
                                    <p className="text-gray-600 mb-6 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
                                        {session.description || 'Sesi tes psikologi yang mencangkup studi kasus, analisis situasi, dan evaluasi perilaku untuk penilaian menyeluruh'}
                                    </p>
                                    
                                    <button 
                                        onClick={() => handleSelectSession(session.id)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition mt-auto mb-4"
                                    >
                                        Lihat Sesi Ini
                                    </button>
                                    
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                            </svg>
                                            <span className="font-medium">{session.participants_count || 10} Peserta</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                            <span className="font-medium">
                                                {session.start_date ? new Date(session.start_date).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '05/11/2025'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 text-lg">Tidak ada sesi yang tersedia</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination - Always show if there's data */}
                    {sessions && sessions.length > 0 && (
                        <div className="flex justify-center items-center gap-2 mt-8">
                            {/* Previous Button */}
                            <button 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center transition ${
                                    currentPage === 1 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                </svg>
                            </button>

                            {/* Page Numbers */}
                            {getPageNumbers().map((pageNum, index) => (
                                pageNum === '...' ? (
                                    <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                                ) : (
                                    <button
                                        key={pageNum}
                                        onClick={() => handlePageChange(pageNum)}
                                        className={`w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center font-medium transition ${
                                            currentPage === pageNum
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                )
                            ))}

                            {/* Next Button */}
                            <button 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center transition ${
                                    currentPage === totalPages 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-white hover:bg-gray-50 text-gray-700'
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