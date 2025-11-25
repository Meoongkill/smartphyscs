import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

export default function DetailSoal({ auth, data }) {
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
                // If the URL is from YouTube, convert it to iframe
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
    const [hide, setHide] = useState(false);
    const filePath = `/storage/${data.file_path}`;
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h1 className="text-center text-3xl font-semibold text-blue-800 mb-10">
                    Detail Soal
                </h1>
            }
        >
            <div className="mb-4">
                <Card>
                    <CardHeader>
                        <div className="flex flex-row justify-between items-center">
                            <CardTitle>Soal {data.id}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Dimensi:</span>
                            <Badge variant="secondary">{data.dimensi}</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="w-full px-4 py-2 bg-gray-50 rounded-lg border">
                            <div
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
                        </div>
                        {data.file_path && (
                            <div className="space-y-2">
                                <Button
                                    onClick={() => setHide(!hide)}
                                    variant="outline"
                                >
                                    {hide ? "Hide PDF" : "Show PDF"}
                                </Button>
                                {hide && (
                                    <iframe
                                        src={filePath}
                                        width="100%"
                                        height="600"
                                        title="PDF Viewer"
                                        className="border rounded-lg"
                                    />
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
