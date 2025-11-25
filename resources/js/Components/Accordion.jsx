import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { space } from "postcss/lib/list";
// import Lottie from "lottie-react";
// import EmptyAnimation from "@/Components/empty.json";

const Accordion = ({ data = null }) => {
    const [accordionOpen, SetAccordionOpen] = useState(false);
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
    return (
        <div className="flex flex-col card rounded border border-gray-200 p-4 shadow-md mb-4">
            <div className="py-2">
                <button
                    onClick={() => SetAccordionOpen(!accordionOpen)}
                    className="flex justify-between w-full font-bold text-lg items-center"
                >
                    <div className="flex flex-row gap-4">
                        <div className="bg-blue-100 py-2 px-4 text-center p-1 rounded-md flex items-center justify-center">
                            <p className="text-sm font-bold text-blue-800">
                                {data.question
                                    ? data.question.kode
                                    : "Kode Soal"}
                            </p>
                        </div>
                        <div className="bg-blue-100 py-2 px-4 text-center p-1 rounded-md flex items-center justify-center">
                            <p className="text-sm font-bold text-blue-800">
                                {data.question
                                    ? mapDataTypeToDisplayText(
                                          data.question.type
                                      )
                                    : "Kategori Soal"}
                            </p>
                        </div>
                    </div>
                    {accordionOpen ? (
                        <>
                            <div className="flex gap-3 items-center">
                                <ChevronUpIcon className="w-12 h-12 font-bold" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex gap-3 items-center">
                                <ChevronDownIcon className="w-12 h-12 font-bold" />
                            </div>
                        </>
                    )}
                </button>

                <p className="text-md font-bold text-yellow-500 pb-2 pt-2">
                    Score Bot: {data.score_bot ? data.score_bot : "0"} | Score
                    Psikolog: {data.score_psikolog ? data.score_psikolog : "0"}
                </p>
                <p className="text-md font-bold pb-4">
                    {data.question.pertanyaan.endsWith(".pdf") ? (
                        <span>
                            <iframe
                                src="http://127.0.0.1:8000/storage/pertanyaan/n6ijWlaD77oXFVyj8emyuxZdgaaBCpW8w5OLIsgd.pdf"
                                width="100%"
                                height="700"
                                title="PDF Viewer"
                                style={{ border: "none" }}
                            />
                        </span>
                    ) : (
                        <p>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: convertOembedToIframe(
                                        data.question.pertanyaan
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
                        </p>
                    )}
                </p>
                <div
                    className={`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-800 text-sm ${
                        accordionOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                    } `}
                >
                    <div className="overflow-hidden">
                        <p className="text-md font-bold pb-2">
                            {data.jawaban
                                ? data.jawaban
                                : "Jawaban peserta untuk pertanyaan 1"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Accordion;
