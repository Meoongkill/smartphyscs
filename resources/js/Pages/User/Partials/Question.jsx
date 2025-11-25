import React, { useMemo, useState } from "react";
import LexicalEditor from "@/Components/LexicalEditor";
import LexicalViewer from "@/Components/LexicalViewer";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Checkbox } from "@/Components/ui/checkbox";
import { Badge } from "@/Components/ui/badge";
import {
    EyeIcon,
    EyeSlashIcon,
    TrashIcon,
    FlagIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";

const Question = (props) => {
    const {
        questions,
        index,
        answer,
        flags,
        handleClear,
        onOptionChange,
        toggleFlag,
        editorKey,
    } = props;
    const question = questions?.[index];
    const [showAnswer, setShowAnswer] = useState(true);

    const styles = {
        table: {
            border: "1px solid #e5e7eb",
            borderCollapse: "collapse",
            width: "100%",
        },
        tableCell: {
            border: "1px solid #e5e7eb",
            padding: "12px",
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
        return htmlContent?.replace(
            /<oembed url="(.+?)"><\/oembed>/g,
            (match, url) => {
                const videoId =
                    new URL(url).searchParams.get("v") || url.split("/").pop();
                return `
                    <iframe
                        width="100%"
                        height="315"
                        src="https://www.youtube.com/embed/${videoId}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen
                        class="rounded-lg shadow-sm"
                    ></iframe>
                `;
            }
        );
    };

    const handleClearAnswer = () => {
        // Delegate to parent-provided clear handler
        if (typeof handleClear === "function") {
            handleClear();
        }
    };

    const countTextLengthFromLexicalJSON = (jsonString) => {
        if (!jsonString) return 0;
        try {
            const obj =
                typeof jsonString === "string"
                    ? JSON.parse(jsonString)
                    : jsonString;
            const walk = (node) => {
                if (!node) return 0;
                if (Array.isArray(node))
                    return node.reduce((sum, n) => sum + walk(n), 0);
                let sum = 0;
                if (node.type === "text" && typeof node.text === "string") {
                    sum += node.text.length;
                }
                if (node.children) sum += walk(node.children);
                return sum;
            };
            return walk(obj.root?.children || []);
        } catch (_) {
            return 0;
        }
    };

    const answerLength = useMemo(
        () => countTextLengthFromLexicalJSON(answer),
        [answer]
    );

    const formatQuestionContent = (content) => {
        return convertOembedToIframe(
            content
                ?.replace(
                    /<table>/g,
                    `<table style="border: ${styles.table.border}; border-collapse: ${styles.table.borderCollapse}; width: ${styles.table.width}; margin: 16px 0;" class="rounded-lg overflow-hidden shadow-sm">`
                )
                .replace(
                    /<td>/g,
                    `<td style="border: ${styles.tableCell.border}; padding: ${styles.tableCell.padding}; text-align: ${styles.tableCell.textAlign};">`
                )
                .replace(
                    /<th>/g,
                    `<th style="border: ${styles.tableCell.border}; padding: ${styles.tableCell.padding}; text-align: ${styles.tableCell.textAlign}; background-color: #f9fafb; font-weight: 600;">`
                )
                .replace(
                    /<ul>/g,
                    `<ul style="list-style-type: ${styles.unorderedList.listStyleType}; padding-left: ${styles.unorderedList.paddingLeft}; margin: 12px 0;">`
                )
                .replace(
                    /<ol>/g,
                    `<ol style="list-style-type: ${styles.orderedList.listStyleType}; padding-left: ${styles.orderedList.paddingLeft}; margin: 12px 0;">`
                )
        );
    };

    // CONSOLE.LOG ANSWER INI ADA
    console.log(answer);

    return (
        <div className="space-y-6">
            {/* Question Section */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Badge
                                variant="default"
                                className="bg-blue-600 text-white px-3 py-1 text-sm font-semibold"
                            >
                                Soal {index}
                            </Badge>
                            <div className="flex items-center space-x-2 text-blue-600">
                                <DocumentTextIcon className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    Pertanyaan
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAnswer(!showAnswer)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                            {showAnswer ? (
                                <>
                                    <EyeSlashIcon className="w-4 h-4 mr-2" />
                                    Sembunyikan Jawaban
                                </>
                            ) : (
                                <>
                                    <EyeIcon className="w-4 h-4 mr-2" />
                                    Tampilkan Jawaban
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="bg-white rounded-lg p-6 border border-blue-100 shadow-sm">
                        <div className="prose prose-blue max-w-none text-gray-800 leading-relaxed">
                            <LexicalViewer value={question?.pertanyaan || ""} />
                        </div>

                        {/* PDF Attachment */}
                        {question?.file_path && (
                            <div className="mt-6 border-t border-gray-200 pt-6">
                                <div className="flex items-center space-x-2 mb-3">
                                    <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        Lampiran Dokumen
                                    </span>
                                </div>
                                <iframe
                                    src={`/storage/${question.file_path}`}
                                    width="100%"
                                    height="500"
                                    title="PDF Viewer"
                                    className="border border-gray-200 rounded-lg shadow-sm"
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Answer Section */}
            {showAnswer && (
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-green-800 flex items-center">
                                <DocumentTextIcon className="w-5 h-5 mr-2" />
                                Jawaban Anda
                            </CardTitle>
                            <div className="flex items-center space-x-4">
                                {/* Doubtful Checkbox */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="doubtful"
                                        checked={Boolean(
                                            flags?.get(question?.id)
                                        )}
                                        onCheckedChange={() =>
                                            typeof toggleFlag === "function" &&
                                            toggleFlag()
                                        }
                                        className="border-yellow-400 data-[state=checked]:bg-yellow-500"
                                    />
                                    <label
                                        htmlFor="doubtful"
                                        className="text-sm font-medium text-yellow-600 cursor-pointer flex items-center"
                                    >
                                        <FlagIcon className="w-4 h-4 mr-1" />
                                        Ragu-ragu
                                    </label>
                                </div>

                                {/* Clear Answer Button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearAnswer}
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    Hapus Jawaban
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-white rounded-lg border border-green-100 shadow-sm">
                            <LexicalEditor
                                key={`${question?.id}-${editorKey}`}
                                value={answer}
                                onChange={(jsonContent) => {
                                    const mockEditor = {
                                        getData: () => jsonContent,
                                    };
                                    onOptionChange(undefined, mockEditor);
                                }}
                                placeholder="Tuliskan jawaban Anda di sini..."
                            />
                        </div>

                        {/* Answer Status */}
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${(() => {
                                        try {
                                            const parsed = answer
                                                ? JSON.parse(answer)
                                                : null;
                                            const text =
                                                parsed?.root?.children?.[0]?.children?.[0]?.text?.trim();
                                            return text
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-100 text-gray-600";
                                        } catch {
                                            return "bg-gray-100 text-gray-600";
                                        }
                                    })()}`}
                                >
                                    {(() => {
                                        try {
                                            const parsed = answer
                                                ? JSON.parse(answer)
                                                : null;
                                            const text =
                                                parsed?.root?.children?.[0]?.children?.[0]?.text?.trim();
                                            return text
                                                ? "Terjawab"
                                                : "Belum dijawab";
                                        } catch {
                                            return "Belum dijawab";
                                        }
                                    })()}
                                </span>

                                {Boolean(flags?.get(question?.id)) && (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 flex items-center">
                                        <FlagIcon className="w-3 h-3 mr-1" />
                                        Ragu-ragu
                                    </span>
                                )}
                            </div>
                            <span className="text-gray-500">
                                {answerLength} karakter
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Question;
