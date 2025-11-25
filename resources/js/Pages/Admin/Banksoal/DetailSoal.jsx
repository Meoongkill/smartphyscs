import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import LexicalViewer from "@/Components/LexicalViewer";

export default function DetailSoal({ auth, data }) {
    const [hide, setHide] = useState(false);
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
    });

    const handleDelete = (id) => {
        const data = {
            id,
        };
        axios.patch("/bank-soal/delete", data).then((res) => {
            toast.fire({
                icon: res.data.error ? "error" : "success",
                title: res.data.message,
            });
            router.visit("/bank-soal");
        });
    };

    const mapDataTypeToDisplayText = (dataType) => {
        switch (dataType) {
            case "studi_kasus":
                return "Studi Kasus";
            case "intray_analisis":
                return "Intray Analisis";
            case "kuisioner_perilaku":
                return "Kuisioner Perilaku";
            default:
                return dataType;
        }
    };
    const styles = {
        table: {
            border: "1px solid black",
            borderCollapse: "collapse",
            width: "100%",
        },
        tableCell: {
            border: "1px solid black",
            padding: "8px",
            textAlign: "left",
        },
        unorderedList: {
            listStyleType: "disc",
            paddingLeft: "20px",
        },
        orderedList: {
            listStyleType: "decimal",
            paddingLeft: "20px",
        },
    };

    const convertOembedToIframe = (htmlContent) => {
        // Regular expression to find oembed tag and extract the URL
        return htmlContent.replace(
            /<oembed url="(.+?)"><\/oembed>/g,
            (match, url) => {
                const videoId =
                    new URL(url).searchParams.get("v") || url.split("/").pop();
                return `
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/${videoId}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            `;
            }
        );
    };
    const fileName = data.pertanyaan.replace(/^public\/pertanyaan\//, "");
    const appUrl = import.meta.env.VITE_APP_URL;
    const filePath = `/storage/${data.file_path}`;
    console.log(filePath);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.visit('/bank-soal')}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeftIcon className="h-4 w-4" />
                            Kembali
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Detail Soal
                        </h1>
                    </div>
                </div>
            }
        >
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <CardTitle className="text-xl">Kode Soal: {data.kode}</CardTitle>
                                <CardDescription>
                                    Detail informasi soal dan kunci jawaban
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route("admin.edit", { kode: data.kode })}
                                    method="get"
                                    as="button"
                                >
                                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                                        <PencilIcon className="h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(data.id)}
                                    className="flex items-center gap-2"
                                >
                                    <TrashIcon className="h-4 w-4" />
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Tipe Soal */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">Tipe Soal</h3>
                            <Badge variant="secondary" className="text-sm">
                                {mapDataTypeToDisplayText(data.type)}
                            </Badge>
                        </div>

                        {/* Pertanyaan */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">Pertanyaan</h3>
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                {typeof data.pertanyaan === 'string' && data.pertanyaan.trim().startsWith('{') ? (
                                    <LexicalViewer value={data.pertanyaan} />
                                ) : (
                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: convertOembedToIframe(
                                                data.pertanyaan
                                                    .replace(
                                                        /<table>/g,
                                                        `<table style="border: ${styles.table.border}; border-collapse: ${styles.table.borderCollapse}; width: ${styles.table.width};">`
                                                    )
                                                    .replace(
                                                        /<td>/g,
                                                        `<td style="border: ${styles.tableCell.border}; padding: ${styles.tableCell.padding}; text-align: ${styles.tableCell.textAlign};">`
                                                    )
                                                    .replace(
                                                        /<ul>/g,
                                                        `<ul style="list-style-type: ${styles.unorderedList.listStyleType}; padding-left: ${styles.unorderedList.paddingLeft};">`
                                                    )
                                                    .replace(
                                                        /<ol>/g,
                                                        `<ol style="list-style-type: ${styles.orderedList.listStyleType}; padding-left: ${styles.orderedList.paddingLeft};">`
                                                    )
                                            ),
                                        }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* PDF Viewer */}
                        {data.file_path && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-700">File PDF</h3>
                                <div className="space-y-3">
                                    <Button
                                        onClick={() => setHide(!hide)}
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        {hide ? (
                                            <>
                                                <EyeSlashIcon className="h-4 w-4" />
                                                Sembunyikan PDF
                                            </>
                                        ) : (
                                            <>
                                                <EyeIcon className="h-4 w-4" />
                                                Tampilkan PDF
                                            </>
                                        )}
                                    </Button>
                                    {hide && (
                                        <div className="border rounded-lg overflow-hidden">
                                            <iframe
                                                src={filePath}
                                                width="100%"
                                                height="600"
                                                title="PDF Viewer"
                                                className="border-0"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Dimensi */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">Dimensi</h3>
                            <Badge variant="outline" className="text-sm">
                                {data.dimensi}
                            </Badge>
                        </div>

                        {/* Kunci Jawaban */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium text-gray-700">Kunci Jawaban</h3>
                            <div className="p-4 bg-gray-50 rounded-lg border">
                                {typeof data.key_answer === 'string' && data.key_answer.trim().startsWith('{') ? (
                                    <LexicalViewer value={data.key_answer} />
                                ) : (
                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: data.key_answer,
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
