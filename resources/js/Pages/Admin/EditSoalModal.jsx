/* This example requires Tailwind CSS v2.0+ */
import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import LexicalEditor from "@/Components/LexicalEditor";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

export default function EditSoalModal({ isOpen, onClose, questionId, question }) {
    let [pertanyaan, setPertanyaan] = useState();
    let [dimensi, setDimensi] = useState();

    useEffect(() => {
        if (question && questionId) {
            const selectedQuestion = question.find(q => q.id === questionId);
            if (selectedQuestion) {
                setPertanyaan(selectedQuestion.pertanyaan);
                setDimensi(selectedQuestion.dimensi);
            }
        }
    }, [question, questionId]);    

    function handleSubmit(e) {
        e.preventDefault();
        let data = {
            id: questionId,
            pertanyaan: pertanyaan,
            dimensi: dimensi,
            // attachment: attachment,
        };
        console.log(data);
        Inertia.post("/update-soal", data);
        window.location.reload();
        onClose(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-black text-blue-800">
                        Edit Soal
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Soal
                        </label>
                        <LexicalEditor
                            value={pertanyaan || ""}
                            onChange={(htmlContent) => {
                                console.log(htmlContent);
                                setPertanyaan(htmlContent);
                            }}
                            placeholder="Masukkan soal di sini..."
                            className="border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dimensi
                        </label>
                        <Select value={dimensi} onValueChange={(value) => setDimensi(value)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Dimensi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Integritas">Integritas</SelectItem>
                                <SelectItem value="Kerjasama">Kerjasama</SelectItem>
                                <SelectItem value="Komunikasi">Komunikasi</SelectItem>
                                <SelectItem value="Orientasi pada hasil">Orientasi pada hasil</SelectItem>
                                <SelectItem value="Pelayanan publik">Pelayanan publik</SelectItem>
                                <SelectItem value="Pengembangan diri dan orang lain">Pengembangan diri dan orang lain</SelectItem>
                                <SelectItem value="Mengelola perubahan">Mengelola perubahan</SelectItem>
                                <SelectItem value="Pengambilan keputusan">Pengambilan keputusan</SelectItem>
                                <SelectItem value="Perekat bangsa">Perekat bangsa</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex gap-4 mt-6">
                        <Button
                            type="submit"
                            className="w-full bg-blue-800 hover:bg-blue-700 text-lg font-bold"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
