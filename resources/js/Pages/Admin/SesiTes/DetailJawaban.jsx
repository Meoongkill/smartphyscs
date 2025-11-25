import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Accordion from "@/Components/Accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

const DetailJawaban = ({ auth, session, test_results, user }) => {
    console.log("session;", session);
    const [answers, setAnswers] = useState([]);
    const [filteredAnswers, setFilteredAnswers] = useState([]);
    const [sumScoreBot, setSumScoreBot] = useState(0);
    const [sumScorePsikolog, setSumScorePsikolog] = useState(0);
    const [selectedKategori, setSelectedKategori] = useState(null);

    const paket = [
        { name: "Studi Kasus", code: "studi_kasus" },
        { name: "Intray Analisis", code: "intray_analisis" },
        { name: "Kuisioner Perilaku", code: "kuisioner_perilaku" },
    ];

    const dataSoal = test_results.filter(
        (item) => Array.isArray(item.answers) && item.answers.length > 0
    );

    // extract data jawaban, soal, score
    const extractData = () => {
        let answers = [];
        let sumScoreBot = 0;
        let sumScorePsikolog = 0;

        dataSoal.forEach(item => {
            if (item.answers) {
                item.answers.forEach(answer => {
                    answers.push(answer);
                    sumScoreBot += answer.score_bot || 0;
                    sumScorePsikolog += answer.score_psikolog || 0;
                });
            }
        });

        setAnswers(answers);
        setSumScoreBot(sumScoreBot);
        setSumScorePsikolog(sumScorePsikolog);
    };

    // filter answers based on selected category
    const filterAnswers = () => {
        if (selectedKategori) {
            const filtered = answers.filter(answer => answer.question.type === selectedKategori.code);
            setFilteredAnswers(filtered);
        } else {
            setFilteredAnswers(answers);
        }
    };

    // get data every time page is reload
    useEffect(() => {
        extractData();
    }, []);

    // update filtered answers when selected category changes
    useEffect(() => {
        filterAnswers();
    }, [selectedKategori, answers]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="grid grid-cols-3">
                    <div></div>
                    <h1 className="text-center text-3xl font-semibold text-blue-800 mb-10">
                        Detail Jawaban
                    </h1>
                </div>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Detail Sesi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="font-medium">Nama Sesi:</span>
                                    <span>{session.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Kode Sesi:</span>
                                    <span>{session.code}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Deskripsi:</span>
                                    <span>{session.description}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Tanggal Mulai:</span>
                                    <span>{session.start_date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Tanggal Selesai:</span>
                                    <span>{session.end_date}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Detail Peserta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="font-medium">NIK:</span>
                                    <span>{user.nik}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Nama:</span>
                                    <span>{user.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Email:</span>
                                    <span>{user.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Hasil Tes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <Badge variant="secondary" className="mb-2">
                                        Total Score Bot
                                    </Badge>
                                    <div className="text-3xl font-bold text-blue-600">
                                        {sumScoreBot}
                                    </div>
                                </div>
                                <div className="text-center">
                                    <Badge variant="secondary" className="mb-2">
                                        Total Score Psikolog
                                    </Badge>
                                    <div className="text-3xl font-bold text-blue-600">
                                        {sumScorePsikolog}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Paket Soal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {
                                    session.test_collections.map((item, index) => (
                                        <Badge key={index} variant="outline" className="w-full justify-center p-2">
                                            {item.test_collection.nama}
                                        </Badge>
                                    ))
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="flex justify-end mb-8">
                <Select value={selectedKategori?.code} onValueChange={(value) => setSelectedKategori(paket.find(p => p.code === value) || null)}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Pilih Kategori Soal" />
                    </SelectTrigger>
                    <SelectContent>
                        {paket.map((item) => (
                            <SelectItem key={item.code} value={item.code}>
                                {item.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {
                filteredAnswers.length > 0 ? (
                    <div className='gap-2'>
                        {filteredAnswers.map((item, index) => (
                            <Accordion key={index} data={item} />
                        ))}
                    </div>
                ) : (null)
            }
        </AuthenticatedLayout>
    );
};

export default DetailJawaban;
