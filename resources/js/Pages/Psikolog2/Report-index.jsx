import React, { useState } from 'react';
import { ChevronLeft, FileText, Table2 } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

const ReportIndex = ({ session, participants }) => {
  const { auth } = usePage().props;
  const [showDetail, setShowDetail] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  const handleDetailClick = (participant) => {
    setSelectedParticipant(participant);
  };

  const handleBack = () => {
    setSelectedParticipant(null);
  };

  const handleBackToPeserta = () => {
    console.log('Auth data:', auth);
    console.log('Roles:', auth?.roles);
    console.log('Is admin?', auth?.roles?.includes('admin'));
    console.log('Session ID:', session.id);
    
    // Check if user is admin, redirect to admin session detail page
    if (auth?.roles?.includes('admin')) {
      console.log('Redirecting to admin session detail');
      router.visit(route('admin.detailSession', session.id));
    } else {
      // Otherwise go to psikolog peserta page
      console.log('Redirecting to psikolog peserta');
      router.visit(route('psikolog2.peserta', session.id));
    }
  };

  const downloadPDF = () => {
    // Inject style untuk A3
    const style = document.createElement('style');
    style.id = 'print-style-a3';
    style.innerHTML = `
      @media print {
        @page {
          size: A3 landscape !important;
          margin: 15mm !important;
        }
        body {
          width: 420mm !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Print
    window.print();
    
    // Cleanup setelah print
    setTimeout(() => {
      const styleElement = document.getElementById('print-style-a3');
      if (styleElement) {
        styleElement.remove();
      }
    }, 1000);
  };

  const downloadCSV = () => {
    const headers = [
      'No', 'ID', 'Nama Peserta Sesi', 'Integritas', 'Kerjasama', 'Komunikasi', 'Orientasi', 'Pelayanan', 'Pengembangan', 'Mengelola', 'Pengambilan', 'Perekat'
    ];
    const rows = participants.map((p, i) => [
      i + 1, p.id, p.name, p.integritas, p.kerjasama || 0, p.komunikasi || 0, p.orientasi || 0, p.pelayanan || 0, p.pengembangan || 0, p.mengelola || 0, p.pengambilan || 0, p.perekat || 0
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `report_session_${session.id}_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleProceed = () => {
    router.visit(route('psikolog2.peserta', session.id));
  };

  if (selectedParticipant) {
    return <DetailPage participant={selectedParticipant} onBack={handleBack} session={session} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-8 py-6">
              <div className="text-center pb-4">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-14 h-14 border-2 border-blue-600 rounded flex items-center justify-center mr-3 flex-col">
                    <span className="text-blue-600 font-bold text-xs leading-tight">SMART</span>
                    <span className="text-blue-600 font-bold text-xs leading-tight">PSYCH</span>
                    <span className="text-blue-600 font-bold text-xs leading-tight">ASSIST</span>
                  </div>
                  <div className="text-left">
                    <h1 className="text-xl font-bold text-gray-900">SmartPsy Assessment</h1>
                    <p className="text-base font-semibold text-gray-700">REPORT TEST</p>
                  </div>
                </div>
              </div>
              <div className="h-1 bg-blue-600 rounded-full mb-6"></div>
            </div>

          <div className="px-6 mb-6">
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Nama Sesi</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{session.name}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Kode Sesi</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{session.code}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Psikolog</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{session.psychologist}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Tanggal Tes</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{session.examinationDate}</span>
              </div>
            </div>
          </div>

          <div className="px-6 mb-4">
            <h2 className="text-center font-bold text-base text-gray-900">Rata - Rata Skor Rekap</h2>
          </div>

          <div className="px-6 mb-6">
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">No.</th>
                    <th className="border-b border-r border-gray-300 px-4 py-3 text-center font-bold text-gray-900">Nama Peserta Sesi</th>
                    <th className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">Integritas</th>
                    <th className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">Kerjasama</th>
                    <th className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">Komunikasi</th>
                    <th className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                      Orientasi<br/>Pada Hasil
                    </th>
                    <th className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                      Pelayanan<br/>Publik
                    </th>
                    <th className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                      Pengembangan<br/>diri dan Orang Lain
                    </th>
                    <th className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                      Mengelola<br/>Perubahan
                    </th>
                    <th className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                      Pengambilan<br/>Keputusan
                    </th>
                    <th className="border-b border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                      Perekat<br/>Bangsa
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((participant, index) => (
                    <tr key={participant.id} className="bg-white hover:bg-gray-50">
                      <td className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                        {index + 1}.
                      </td>
                      <td className="border-b border-r border-gray-300 px-4 py-3 text-gray-900">
                        {participant.name}
                      </td>
                      <td className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                        {participant.integritas}
                      </td>
                      <td className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                        {participant.kerjasama}
                      </td>
                      <td className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                        {participant.komunikasi}
                      </td>
                      <td className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                        {participant.orientasi}
                      </td>
                      <td className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                        {participant.pelayanan}
                      </td>
                      <td className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                        {participant.pengembangan}
                      </td>
                      <td className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                        {participant.mengelola}
                      </td>
                      <td className="border-b border-r border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                        {participant.pengambilan}
                      </td>
                      <td className="border-b border-gray-300 px-3 py-3 text-center font-bold text-gray-900">
                        {participant.perekat}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="px-6 mb-6">
            <p className="text-xs text-gray-600 italic">
              *Hasil test ini agar dipergunakan dengan sebaik-baiknya
            </p>
          </div>

          <div className="px-6 mb-8">
            <div className="text-right">
              <p className="font-semibold text-gray-900 mb-16">Bandung, {session.date}</p>
              <div className="mt-4">
                <div className="flex justify-end mb-2">
                  {session.psychologistSignature ? (
                    <img src={session.psychologistSignature} alt="TTD" className="h-16 object-contain" />
                  ) : (
                    <p className="font-medium text-gray-700 mb-8">(TTD)</p>
                  )}
                </div>
                <p className="font-bold text-gray-900">{session.psychologist}</p>
                <p className="text-sm text-gray-700">Psikolog Sesi {session.id}</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={downloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Download PDF
              </button>
              <button 
                onClick={downloadCSV}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Table2 className="w-5 h-5" />
                Download CSV
              </button>
              <button 
                onClick={handleProceed}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailPage = ({ participant, onBack, session }) => {
  // Calculate total score from all dimensions
  const totalScore = (
    (participant.integritas || 0) +
    (participant.kerjasama || 0) +
    (participant.komunikasi || 0) +
    (participant.orientasi || 0) +
    (participant.pelayanan || 0) +
    (participant.pengembangan || 0) +
    (participant.mengelola || 0) +
    (participant.pengambilan || 0) +
    (participant.perekat || 0)
  );

  const detailData = {
    id: participant.id,
    fullName: participant.name,
    age: null,
    dateOfBirth: null,
    sex: null,
    session: session.name,
    sessionNumber: session.id,
    examinationDate: session.examinationDate,
    psychologist: session.psychologist,
    psychologistTitle: session.psychologistTitle,
    scores: [
      { dimension: 'Integritas', recommended: participant.integritas || 0, psychologist: participant.integritas || 0 },
      { dimension: 'Kerja Sama', recommended: participant.kerjasama || 0, psychologist: participant.kerjasama || 0 },
      { dimension: 'Komunikasi', recommended: participant.komunikasi || 0, psychologist: participant.komunikasi || 0 },
      { dimension: 'Orientasi Pada Hasil', recommended: participant.orientasi || 0, psychologist: participant.orientasi || 0 },
      { dimension: 'Pelayanan Publik', recommended: participant.pelayanan || 0, psychologist: participant.pelayanan || 0 },
      { dimension: 'Pengembangan Diri dan Orang Lain', recommended: participant.pengembangan || 0, psychologist: participant.pengembangan || 0 },
      { dimension: 'Mengelola Perubahan', recommended: participant.mengelola || 0, psychologist: participant.mengelola || 0 },
      { dimension: 'Pengambilan Keputusan', recommended: participant.pengambilan || 0, psychologist: participant.pengambilan || 0 },
      { dimension: 'Perekat Bangsa', recommended: participant.perekat || 0, psychologist: participant.perekat || 0 }
    ],
    totalScore: totalScore,
    recommendation: null
  };

  const downloadPDF = () => {
    window.print();
  };

  const downloadCSV = () => {
    const headers = ['Dimension', 'Nilai Rekomendasi', 'Nilai Psikolog'];
    const rows = detailData.scores.map(s => [s.dimension, s.recommended, s.psychologist]);
    const meta = [
      ['ID', detailData.id],
      ['Full Name', detailData.fullName],
      ['Session', detailData.session],
      ['Examination Date', detailData.examinationDate]
    ];
    const csvLines = [];
    meta.forEach(m => csvLines.push(`${m[0]},"${m[1]}"`));
    csvLines.push('\n' + headers.join(','));
    rows.forEach(r => csvLines.push(r.map(c => `"${c}"`).join(',')));
    const csvContent = csvLines.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `personal_report_${detailData.id}_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 20mm;
          }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 py-6">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 pt-6 pb-4">
              <button 
                onClick={onBack}
                className="flex items-center text-gray-700 hover:text-gray-900 transition"
              >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="px-6">
            <div className="text-center pb-4">
              <h1 className="text-xl font-bold text-gray-900">SmartPsy Assessment</h1>
              <p className="text-base font-semibold text-gray-700 mt-1">REPORT TEST</p>
            </div>
            <div className="h-1 bg-blue-600 rounded-full mb-6"></div>
          </div>

          <div className="px-6 mb-6">
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">ID</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{detailData.id}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Full Name</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{detailData.fullName}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Age</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{detailData.age || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Date of Birth</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{detailData.dateOfBirth || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Sex</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{detailData.sex || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Session</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{detailData.session}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Examination Date</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{detailData.examinationDate}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Psychologist</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{detailData.psychologist}</span>
              </div>
            </div>
          </div>

          <div className="px-6 mb-6">
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="border-b border-r border-gray-300 px-4 py-3 text-left font-bold text-gray-900 w-20">No.</th>
                    <th className="border-b border-r border-gray-300 px-4 py-3 text-left font-bold text-gray-900">Dimensi</th>
                    <th className="border-b border-gray-300 px-4 py-3 text-center font-bold text-gray-900" colSpan="2">
                      Skor Rekap
                    </th>
                  </tr>
                  <tr className="bg-white">
                    <th className="border-b border-r border-gray-300 px-4 py-2"></th>
                    <th className="border-b border-r border-gray-300 px-4 py-2"></th>
                    <th className="border-b border-r border-gray-300 px-4 py-2 text-center font-bold text-gray-900">
                      Nilai Rekomendasi
                    </th>
                    <th className="border-b border-gray-300 px-4 py-2 text-center font-bold text-gray-900">
                      Nilai Psikolog
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detailData.scores.map((score, index) => (
                    <tr key={index} className="bg-white">
                      <td className="border-b border-r border-gray-300 px-4 py-3 text-center font-bold text-gray-900">
                        {index + 1}.
                      </td>
                      <td className="border-b border-r border-gray-300 px-4 py-3 text-gray-900">
                        {score.dimension}
                      </td>
                      <td className="border-b border-r border-gray-300 px-4 py-3 text-center font-bold text-lg text-gray-900">
                        {score.recommended}
                      </td>
                      <td className="border-b border-gray-300 px-4 py-3 text-center font-bold text-lg text-gray-900">
                        {score.psychologist}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-white">
                    <td colSpan="2" className="border-r border-gray-300 px-4 py-4 text-center font-bold text-gray-900">
                      Total Score
                    </td>
                    <td colSpan="2" className="px-4 py-4 text-center font-bold text-xl text-gray-900">
                      {detailData.totalScore}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {detailData.recommendation && (
            <div className="px-6 mb-6">
              <div className="bg-white">
                <h3 className="font-bold text-base mb-3 text-gray-900">Deskripsi Rekomendasi</h3>
                <p className="text-sm leading-relaxed text-gray-800 text-justify">
                  {detailData.recommendation}
                </p>
              </div>
            </div>
          )}

          <div className="px-6 mb-6">
            <p className="text-xs text-gray-600 italic">
              *Hasil test ini agar dipergunakan dengan sebaik-baiknya
            </p>
          </div>

          <div className="px-6 mb-8">
            <div className="text-right">
              <p className="font-semibold text-gray-900 mb-16">Bandung, {session.date}</p>
              <div className="mt-4">
                <div className="flex justify-end mb-2">
                  {session.psychologistSignature ? (
                    <img src={session.psychologistSignature} alt="TTD" className="h-16 object-contain" />
                  ) : (
                    <p className="font-medium text-gray-700 mb-8">(TTD)</p>
                  )}
                </div>
                <p className="font-bold text-gray-900">{detailData.psychologist}</p>
                <p className="text-sm text-gray-700">Psikolog Sesi {detailData.sessionNumber}</p>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-4">
              <button 
                onClick={downloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Download PDF
              </button>
              <button 
                onClick={downloadCSV}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Table2 className="w-5 h-5" />
                Download CSV
              </button>
              <button 
                onClick={onBack}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default ReportIndex;