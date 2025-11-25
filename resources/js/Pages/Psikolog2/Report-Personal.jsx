import React from 'react';
import { ChevronLeft, FileText, Table2 } from 'lucide-react';
import { router } from '@inertiajs/react';

const PersonalReport = ({ session, user, reportData }) => {
  const handleBack = () => {
    // Kembali ke halaman peserta sesi
    router.visit(route('psikolog2.peserta', session.id));
  };

  const downloadPDF = () => {
    window.print();
  };

  const downloadCSV = () => {
    const headers = ['Dimension', 'Nilai Rekomendasi', 'Nilai Psikolog'];
    const rows = reportData.scores.map(s => [s.dimension, s.recommended, s.psychologist]);
    const meta = [
      ['ID', reportData.id],
      ['Full Name', reportData.fullName],
      ['Session', reportData.session],
      ['Examination Date', reportData.examinationDate]
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
    link.setAttribute('download', `personal_report_${reportData.id}_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleProceed = () => {
    if (session && session.id) {
      window.location.href = `/psikolog2/peserta/${session.id}`;
    } else {
      window.location.href = '/psikolog2/dashboard';
    }
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
          {/* Back Button */}
          <div className="px-6 pt-6 pb-4">
            <button 
              onClick={handleBack}
              className="flex items-center text-gray-700 hover:text-gray-900 transition"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Header with Blue Line */}
          <div className="px-6">
            <div className="text-center pb-4">
              <div className="flex items-center justify-center mb-3">
                <div className="w-14 h-14 border-2 border-blue-600 rounded flex items-center justify-center mr-3 flex-col">
                  <span className="text-blue-600 font-bold text-xs leading-tight">SMART</span>
                  <span className="text-blue-600 font-bold text-xs leading-tight">PSYCH</span>
                  <span className="text-blue-600 font-bold text-xs leading-tight">ASSIST</span>
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-bold text-gray-900">SmartPsy Assessment</h1>
                  <p className="text-base font-semibold text-gray-700 mt-1">REPORT TEST</p>
                </div>
              </div>
            </div>
            <div className="h-1 bg-blue-600 rounded-full mb-6"></div>
          </div>

          {/* Personal Information */}
          <div className="px-6 mb-6">
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Nama</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{reportData.fullName}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">NIK</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{reportData.nik || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Nomor Handphone</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{reportData.phone || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Psikolog</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{reportData.psychologist}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-52 text-gray-900">Tanggal Tes</span>
                <span className="mx-3">:</span>
                <span className="font-medium text-gray-900">{reportData.examinationDate}</span>
              </div>
            </div>
          </div>

          {/* Score Table */}
          <div className="px-6 mb-6">
            <div className="overflow-x-auto border border-gray-300 rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="border-b border-r border-gray-300 px-4 py-3 text-left font-bold text-gray-900 w-20">No.</th>
                    <th className="border-b border-r border-gray-300 px-4 py-3 text-left font-bold text-gray-900">Dimensi</th>
                    <th className="border-b border-r border-gray-300 px-4 py-3 text-center font-bold text-gray-900">Nilai Rekomendasi</th>
                    <th className="border-b border-gray-300 px-4 py-3 text-center font-bold text-gray-900">Nilai Psikolog</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.scores.map((score, index) => (
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
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendation Section */}
          {reportData.recommendation && (
            <div className="px-6 mb-6">
              <div className="bg-white">
                <h3 className="font-bold text-base mb-3 text-gray-900">Deskripsi Rekomendasi</h3>
                <p className="text-sm leading-relaxed text-gray-800 text-justify">
                  {reportData.recommendation}
                </p>
              </div>
            </div>
          )}

          <div className="px-6 mb-6">
            <p className="text-xs text-gray-600 italic">
              *Hasil test ini agar dipergunakan dengan sebaik-baiknya
            </p>
          </div>

          {/* Footer Signature */}
          <div className="px-6 mb-8">
            <div className="text-right">
              <p className="font-semibold text-gray-900 mb-4">Bandung, {reportData.date}</p>
              <div className="mt-4">
                <div className="flex justify-end mb-2">
                  {reportData.psychologistSignature ? (
                    <img src={reportData.psychologistSignature} alt="TTD" className="h-16 object-contain" />
                  ) : (
                    <p className="font-medium text-gray-700 mb-8">(TTD)</p>
                  )}
                </div>
                <p className="font-bold text-gray-900">{reportData.psychologist}</p>
                <p className="text-sm text-gray-700">Psikolog Sesi {reportData.sessionNumber}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
    </>
  );
};

export default PersonalReport;