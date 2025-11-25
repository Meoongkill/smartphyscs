import React, { useState, useEffect, useRef } from "react";
import QuestionNumBox from "./Partials/QuestionNumBox";
import Question from "./Partials/Question";
import Timer from "./Partials/Timer";
import Modal from "./Partials/Modal";
import BottomNav from "./Partials/BottomNav";
import axios from "axios";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { Button } from "primereact/button";

export default function TestPage(props) {
    const data = props.data;
    const STORAGE_KEY = `jawaban_${props.auth.user.id}`;
    const FLAG_KEY = `flag_${props.auth.user.id}`;
    const DURATION_KEY = `duration_${props.auth.user.id}`;
    const questions = data.questions;
    
    // DEBUG: Log data yang diterima
    console.log('=== TESTPAGE DEBUG ===');
    console.log('props:', props);
    console.log('data:', data);
    console.log('questions:', questions);
    console.log('questions type:', typeof questions);
    console.log('questions is array?:', Array.isArray(questions));
    console.log('questions length:', questions?.length);
    console.log('first question:', questions?.[0]);
    
    const [flags, setFlags] = useState(new Map());
    const [answer, setAnswer] = useState(); // menyimpan jawaban soal satuan
    const [editorKey, setEditorKey] = useState(0);
    const [questionIndex, setQuestionIndex] = useState(0); // init nomor soal
    const [isModalOpen, setIsModalOpen] = useState(false); // modal untuk submit atau tidak
    const [messegeModal, setMessegeModal] = useState(""); // message ketika akan submit
    const [answers, setAnswers] = useState(new Map()); //menyimpan jawaban keseluruhan dengan labelnya id dan valuenya jawabannya
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [duration, setDuration] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
    });
    // let waktuTes = parseInt(props.test.jam) * 60 + parseInt(props.test.menit);

    // save ke localstorage
    const saveToLocalStorage = () => {
        // jawaban user
        const jawabanMap = Array.from(answers.entries());
        jawabanMap.sort((a, b) => a[0] - b[0]);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(jawabanMap));
        // flag user
        const flagMap = Array.from(flags.entries());
        flagMap.sort((a, b) => a[0] - b[0]);
        localStorage.setItem(FLAG_KEY, JSON.stringify(flagMap));
    };

    // tiap nge next/prev/submit, answer dari question itu disimpan ke answer global dan update localstoragenya
    const onQuestionChange = () => {
        if (answer !== "") {
            setAnswers((prev) => {
                const updated = new Map(prev);
                updated.set(questions[questionIndex].id, answer);
                return updated;
            });
        }

        setAnswer("");
        setEditorKey((prev) => prev + 1); // 🔥 reset LexicalEditor
    };

    // handle clear button
    const handleClear = () => {
        const qid = questions[questionIndex]?.id;

        // Hapus jawaban dari Map
        setAnswers((prev) => {
            const updated = new Map(prev);
            updated.delete(qid); // 🔥 hapus jawaban khusus pertanyaan ini
            return updated;
        });

        // Reset state & editor
        setAnswer("");
        setEditorKey((prev) => prev + 1);
    };

    // setiap ada perubahan di ckeditornya
    const onOptionChange = (e, editor) => {
        const newAnswer = editor.getData();
        setAnswer(newAnswer);
        setAnswers((prev) => {
            const updated = new Map(prev);
            updated.set(questions[questionIndex].id, newAnswer);
            return updated;
        });
    };

    // handle flag
    const toggleFlag = () => {
        setFlags((prevFlagged) => {
            const newFlagged = new Map(prevFlagged);
            newFlagged.set(
                questions[questionIndex].id,
                !newFlagged.get(questions[questionIndex].id)
            );
            return newFlagged;
        });
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // open modal submit
    const openModal = () => {
        checkSubmitMessage();
        setIsModalOpen(true);
    };

    // close modal submit
    const closeModal = () => setIsModalOpen(false);

    // cek pertanyaan
    const checkSubmitMessage = () => {
        if (
            Array.from(flags.values()).filter((value) => value === true)
                .length > 0
        ) {
            // jika masih ada yg ragu ragu
            setMessegeModal("Masih ada soal yang ragu-ragu!");
        } else if (
            Array.from(answers.values()).filter((value) => value === "")
                .length > 0
        ) {
            setMessegeModal("Masih ada jawaban yang kosong!");
        } else {
            setMessegeModal(""); // kalau tidak ada ragu ragu dan soal sudah dijawab semua
        }
    };

    // clean data from html tag
    function stripHTML(html) {
        var temp = document.createElement("div");
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
    }

    // submit
    const onSubmit = () => {
        saveToLocalStorage(); //save localstorage
        const answersData = Array.from(answers.entries()).map(
            ([key, value]) => ({
                question_id: key,
                answer: stripHTML(value) || "Tidak ada jawaban",
            })
        );
        const dataTest = {
            code: data.session.code,
            answers: answersData,
        };
        axios.post("/result", dataTest).then((res) => {
            toast.fire({
                icon: res.data.error ? "error" : "success",
                title: res.data.message,
                padding: "10px 20px",
            });
            clearInterval(intervalId);
            if (data.status !== "kuisioner_perilaku") {
                // router.replace(`/istirahat/${data.session.code}`);
                window.location.href = `/istirahat/${data.session.code}`;
            } else {
                router.replace("/dashboard");
            }
            localStorage.clear();
        });
    };

    // ambil jawaban dari localstorage ketika refresh/pertama kali masuk ke page kemudian disimpan di answer global
    useEffect(() => {
        const kumpulan_jawaban = new Map();
        const serializedData = localStorage.getItem(STORAGE_KEY);

        if (serializedData) {
            const arrayOfMaps = JSON.parse(serializedData);
            arrayOfMaps.forEach(([key, value]) => {
                kumpulan_jawaban.set(key, value);
            });
        } else {
            questions.forEach((question) => {
                kumpulan_jawaban.set(question.id, "");
            });
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(Array.from(kumpulan_jawaban.entries()))
            );
        }

        setAnswers(kumpulan_jawaban);

        // FLAG PART
        const kumpulan_flag = new Map();
        const flagData = localStorage.getItem(FLAG_KEY);
        if (flagData) {
            JSON.parse(flagData).forEach(([key, value]) => {
                kumpulan_flag.set(key, value);
            });
        } else {
            questions.forEach((question) => {
                kumpulan_flag.set(question.id, false);
            });
            localStorage.setItem(
                FLAG_KEY,
                JSON.stringify(Array.from(kumpulan_flag.entries()))
            );
        }
        setFlags(kumpulan_flag);

        // DURATION
        let storedDuration = localStorage.getItem(DURATION_KEY);
        if (storedDuration) {
            setDuration(parseInt(storedDuration));
        } else {
            storedDuration = data.duration * 60;
            localStorage.setItem(DURATION_KEY, storedDuration);
            setDuration(parseInt(storedDuration));
        }
    }, []);

    useEffect(() => {
                // --- Tambahan: set answer untuk questionIdx ---
        if (questions[questionIndex]) {
            const initialAnswer =
                answers.get(questions[questionIndex].id) || "";

            setAnswer(initialAnswer);
        }

    }, [answers]);

    // ngambil jawaban dari answer global untuk nomor soal tersebut, kalau gaada ya dikosongin
    useEffect(() => {
        const qid = questions[questionIndex]?.id;
        const savedAnswer = answers.get(qid) || "";

        setAnswer(savedAnswer);
        setEditorKey((prev) => prev + 1); // reset editor ke value baru
    }, [questionIndex]);

    // untuk update data answers dan flags di localstorage
    useEffect(() => {
        saveToLocalStorage();
    }, [answers, flags]);

    // update data duration di localstorage berkurang 1 setiap detik
    useEffect(() => {
        const interval = setInterval(() => {
            const storedDuration = localStorage.getItem(DURATION_KEY);
            const prevDuration = parseInt(storedDuration);

            if (prevDuration <= 0) {
                clearInterval(interval);
                localStorage.setItem(DURATION_KEY, 0);
            } else {
                const newDuration = prevDuration - 1;
                localStorage.setItem(DURATION_KEY, newDuration);
            }
        }, 1000);
        setIntervalId(interval);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <Head title="Test" />
            <div className="px-12 border border-black">
                <div className="flex justify-center items-center pt-10 pb-4">
                    <h1 className="font-bold text-4xl text-blue-800">
                        Asesmen Psikologi
                    </h1>
                </div>

                {duration !== undefined && duration > 0 && (
                    <Timer
                        onSubmit={onSubmit}
                        totalQuestions={questions.length}
                        answers={answers}
                        duration={duration}
                    />
                )}
                <Question
                    questions={questions}
                    index={questionIndex}
                    answer={answer}
                    flags={flags}
                    handleClear={handleClear}
                    onOptionChange={onOptionChange}
                    toggleFlag={toggleFlag}
                    editorKey={editorKey}
                />
                <BottomNav
                    questionIndex={questionIndex}
                    length={questions.length}
                    onNext={() => {
                        onQuestionChange(); // answernya disimpan ke answer global dan localstorage
                        setQuestionIndex((prev) =>
                            Math.min(prev + 1, questions.length)
                        );
                    }}
                    onPrev={() => {
                        onQuestionChange(); // answernya disimpan ke answer global dan localstorage
                        setQuestionIndex((prev) => Math.max(prev - 1, 0));
                    }}
                    openModal={openModal}
                    onQuestionChange={onQuestionChange}
                />
                <Modal
                    isOpen={isModalOpen}
                    onSubmitModal={onSubmit}
                    message={messegeModal}
                    closeModal={closeModal}
                />
                <div className="w-full">
                    <button
                        onClick={toggleSidebar}
                        className={`fixed right-0 top-1/2 transform -translate-y-1/2 bg-blue-800 text-white pr-2 pl-4 py-2 rounded-l-full text-xl font-bold transition-transform duration-300 ease-in-out z-20 ${
                            isSidebarOpen
                                ? "-translate-x-[33vw]"
                                : "translate-x-0"
                        }`}
                    >
                        <span className="block">
                            {" "}
                            {isSidebarOpen ? "Tutup" : "Lihat"}{" "}
                        </span>
                        <span className="block"> Soal </span>
                    </button>
                </div>
                <QuestionNumBox
                    answers={answers}
                    questions={questions}
                    currentIndex={questionIndex}
                    setQuestionIndex={setQuestionIndex}
                    onQuestionChange={onQuestionChange}
                    flags={flags}
                    isOpen={isSidebarOpen}
                    openModal={openModal}
                />
            </div>
        </div>
    );
}
