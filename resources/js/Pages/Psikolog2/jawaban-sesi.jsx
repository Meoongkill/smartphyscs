import { Head, router } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

export default function JawabanPeserta({ questions, user, session, auth }) {
    const [scores, setScores] = useState({});
    const [editedScores, setEditedScores] = useState({}); // Track which scores have been edited
    const [showDropdown, setShowDropdown] = useState(false);

    // CSS to hide number input spinner
    const inputNumberStyle = `
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        input[type=number] {
            -moz-appearance: textfield;
        }
    `;

    // Sentimen yang tersedia (9 sentimen)
    const sentimens = [
        'Integritas', 
        'Kerja Sama', 
        'Komunikasi', 
        'Orientasi Pada Hasil',
        'Pelayanan Publik',
        'Pengembangan Diri Dan Orang Lain',
        'Mengelola Perubahan',
        'Pengambilan Keputusan',
        'Perekat Bangsa'
    ];

    useEffect(() => {
        // Initialize scores from questions data
        if (questions) {
            const initialScores = {};
            const initialEditedScores = {};
            questions.forEach(q => {
                initialScores[q.id] = {};
                initialEditedScores[q.id] = {};
                sentimens.forEach(sentimen => {
                    const rekomendasiScore = q.scores?.[sentimen]?.rekomendasi || 0;
                    const psikologScore = q.scores?.[sentimen]?.psikolog;
                    
                    initialScores[q.id][sentimen] = {
                        rekomendasi: rekomendasiScore,
                        psikolog: psikologScore !== undefined && psikologScore !== null ? psikologScore : rekomendasiScore
                    };
                    
                    // Mark as edited if psikolog score exists and is different from rekomendasi
                    initialEditedScores[q.id][sentimen] = psikologScore !== undefined && psikologScore !== null && psikologScore !== rekomendasiScore;
                });
            });
            setScores(initialScores);
            setEditedScores(initialEditedScores);
            console.log('Initialized scores:', initialScores);
            console.log('Initialized edited flags:', initialEditedScores);
        }
    }, [questions]);

    const handleBack = () => {
        router.visit(route('psikolog2.peserta', session.id));
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const handleScoreChange = (questionId, sentimen, value) => {
        setScores(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                [sentimen]: {
                    ...prev[questionId][sentimen],
                    psikolog: value
                }
            }
        }));
        
        // Mark this score as edited
        setEditedScores(prev => ({
            ...prev,
            [questionId]: {
                ...prev[questionId],
                [sentimen]: true
            }
        }));
    };

    const handleDownloadReport = () => {
        // Redirect to Report Personal page
        router.visit(route('psikolog2.reportPersonal', [session.id, user.id]));
    };

    const handleSelesai = () => {
        console.log('=== DEBUG handleSelesai ===');
        console.log('Current scores state:', scores);
        console.log('Questions:', questions);
        
        // Prepare scores data for submission
        const scoresData = [];
        Object.keys(scores).forEach(questionId => {
            console.log(`Processing question ${questionId}:`, scores[questionId]);
            Object.keys(scores[questionId]).forEach(sentimen => {
                console.log(`  - Sentimen ${sentimen}:`, scores[questionId][sentimen]);
                const psikologScore = scores[questionId][sentimen].psikolog;
                // Include score if it has a value (including 0)
                if (psikologScore !== '' && psikologScore !== null && psikologScore !== undefined) {
                    scoresData.push({
                        question_id: questionId,
                        sentimen: sentimen,
                        score: psikologScore
                    });
                }
            });
        });

        console.log('Prepared scoresData:', scoresData);
        console.log('ScoresData length:', scoresData.length);
        console.log('User ID:', user.id);
        console.log('Session ID:', session.id);
        
        if (scoresData.length === 0) {
            alert('Silakan isi nilai psikolog terlebih dahulu!');
            return;
        }
        
        const payload = {
            user_id: user.id,
            session_id: session.id,
            scores: scoresData
        };
        
        console.log('Full payload:', JSON.stringify(payload, null, 2));

        // Send data to backend and navigate to hasil akhir after success
        router.post(route('psikolog2.saveScores'), payload, {
            onSuccess: () => {
                console.log('Save successful, navigating to personal report page...');
                // Navigate to personal report page after successful save
                router.visit(route('psikolog2.reportPersonal', {
                    sessionId: session.id,
                    userId: user.id
                }));
            },
            onError: (errors) => {
                console.error('Error saving scores:', errors);
                console.error('Full error object:', JSON.stringify(errors, null, 2));
                alert('Gagal menyimpan nilai. Error: ' + JSON.stringify(errors));
            }
        });
    };

    return (
        <>
            <Head title="Jawaban Peserta" />
            <style>{inputNumberStyle}</style>
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
                <div className="w-full py-8">
                    {/* Title and Buttons */}
                    <div className="flex items-center justify-between mb-6 px-6">
                        <h1 className="text-3xl font-bold text-blue-600">
                            Jawaban {user?.name || 'Muhammad Fathan Putra'}
                        </h1>
                        <div className="flex gap-3">
                            <button 
                                onClick={handleDownloadReport}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Download
                            </button>
                            <button 
                                onClick={handleBack}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mx-6">
                        <table className="w-full table-fixed">
                            <thead>
                                <tr className="bg-white border-b-2 border-gray-300">
                                    <th className="px-4 py-4 text-left font-bold text-gray-800 text-sm border-r border-gray-300" style={{width: '60px'}}>
                                        No.
                                    </th>
                                    <th className="px-4 py-4 text-left font-bold text-gray-800 text-sm border-r border-gray-300" style={{width: '20%'}}>
                                        Pertanyaan
                                    </th>
                                    <th className="px-4 py-4 text-left font-bold text-gray-800 text-sm border-r border-gray-300" style={{width: '20%'}}>
                                        Jawaban
                                    </th>
                                    <th className="px-4 py-4 text-center font-bold text-gray-800 text-sm" style={{width: '60%'}}>
                                        Penilaian
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions && questions.length > 0 ? questions.map((q, index) => (
                                    <tr key={q.id} className="border-b border-gray-200">
                                        <td className="px-4 py-6 align-top font-semibold text-gray-700 border-r border-gray-300">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-6 align-top border-r border-gray-300">
                                            <div className="bg-blue-400 rounded-2xl p-4 text-sm leading-relaxed text-white break-words">
                                                {q.question}
                                            </div>
                                        </td>
                                        <td className="px-4 py-6 align-top border-r border-gray-300">
                                            <div className="bg-blue-400 rounded-2xl p-4 text-sm leading-relaxed text-white break-words">
                                                {q.answer}
                                            </div>
                                        </td>
                                        <td className="px-4 py-6 align-top">
                                            <div className="grid grid-cols-5 gap-3">
                                                {sentimens.map(sentimen => {
                                                    const isEdited = editedScores[q.id]?.[sentimen];
                                                    const textColorClass = isEdited ? 'text-gray-900' : 'text-gray-400';
                                                    
                                                    return (
                                                        <div key={sentimen} className="flex flex-col items-center gap-2">
                                                            {/* Header with Rekomendasi Score */}
                                                            <div className="bg-blue-500 rounded-2xl p-3 text-white text-center w-full min-h-[96px] flex flex-col justify-center">
                                                                <div className="text-xs font-semibold mb-2 leading-tight break-words">
                                                                    {sentimen}
                                                                </div>
                                                                <div className="text-xs">
                                                                    Nilai Rekomendasi: {scores[q.id]?.[sentimen]?.rekomendasi || 0}
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Psikolog Input */}
                                                            <input 
                                                                type="number" 
                                                                className={`w-full px-3 py-3 border-2 border-gray-300 rounded-2xl text-center text-base font-semibold focus:outline-none focus:border-blue-500 bg-white ${textColorClass}`}
                                                                placeholder="0"
                                                                value={scores[q.id]?.[sentimen]?.psikolog || ''}
                                                                onChange={(e) => handleScoreChange(q.id, sentimen, e.target.value)}
                                                                min="0"
                                                                max="100"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                            Tidak ada data pertanyaan
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Button Submit */}
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleSelesai}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-12 rounded-lg text-lg transition-all shadow-md"
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}