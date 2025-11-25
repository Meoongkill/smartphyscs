import { Head, router } from "@inertiajs/react";
import React from "react";

export default function HasilAkhir({ result, user, session }) {
    const handleKembali = () => {
        router.visit(route('psikolog2.dashboard'));
    };

    // Calculate progress percentage
    const progressPercentage = result?.progress || 0;
    const circumference = 2 * Math.PI * 120;
    const strokeDashoffset = circumference * (1 - progressPercentage / 100);

    return (
        <>
            <Head title="Hasil Akhir" />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-purple-300 px-6 py-6 flex items-center">
                    <button onClick={handleKembali} className="mr-4 hover:opacity-80 transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <h1 className="text-2xl font-bold text-white text-center flex-1">Hasil Akhir</h1>
                </div>

                {/* Content */}
                <div className="container mx-auto px-6 py-12">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Setelah banyak pertimbangan, maka hasil akhir dari kandidat adalah sebagai berikut
                    </h2>
                    
                    <div className="flex justify-center gap-8 flex-wrap">
                        {/* Card Kiri */}
                        <div className="bg-gradient-to-b from-purple-200 to-purple-300 rounded-3xl shadow-lg p-8 w-full max-w-md">
                            {/* Photo */}
                            <div className="bg-white rounded-3xl p-2 mb-6">
                                <img 
                                    src={user?.photo || '/images/default-avatar.png'} 
                                    alt={user?.name || 'Peserta'} 
                                    className="w-full h-80 object-cover rounded-3xl"
                                />
                            </div>
                            
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold">Overall Progress {progressPercentage}%</h3>
                                <p className="text-xl font-semibold">Score {result?.score || 0}/{result?.max_score || 100}</p>
                                <p className="text-xl font-semibold">Name : {user?.name || '-'}</p>
                                <p className="text-xl font-semibold">Vacancy : {result?.vacancy || session?.name || '-'}</p>
                            </div>
                        </div>
                        
                        {/* Card Kanan */}
                        <div className="bg-gradient-to-b from-purple-200 to-purple-300 rounded-3xl shadow-lg p-8 w-full max-w-md flex flex-col justify-center items-center">
                            <h3 className="text-2xl font-bold mb-6">Overall Progress {progressPercentage}%</h3>
                            
                            {/* Progress Circle */}
                            <div className="relative w-64 h-64 mb-6">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle 
                                        cx="128" 
                                        cy="128" 
                                        r="120" 
                                        stroke="#E5E7EB" 
                                        strokeWidth="16" 
                                        fill="none"
                                    />
                                    <circle 
                                        cx="128" 
                                        cy="128" 
                                        r="120" 
                                        stroke="#000000" 
                                        strokeWidth="16" 
                                        fill="none"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={strokeDashoffset}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-6xl font-bold">{progressPercentage}%</span>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-xl font-semibold mb-2">Saudara dinyatakan</p>
                                <p className="text-2xl font-bold mb-2">
                                    {progressPercentage >= 70 ? 'LAYAK' : 'TIDAK LAYAK'} untuk
                                </p>
                                <p className="text-2xl font-bold">
                                    Menjadi {result?.vacancy || session?.name || 'Kandidat'}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-center text-xl font-semibold mt-12 mb-6">
                        Demikian yang dapat saya sampaikan.
                    </p>
                    
                    {/* Button Kembali */}
                    <div className="flex justify-center">
                        <button 
                            onClick={handleKembali}
                            className="bg-purple-400 hover:bg-purple-500 text-white font-bold py-4 px-20 rounded-full text-xl transition shadow-lg"
                        >
                            Kembali
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}