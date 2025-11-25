/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Inertia } from "@inertiajs/inertia";
import LexicalEditor from "@/Components/LexicalEditor";

export default function AddSoalModal({ isOpen, onClose, testId }) {
    let [pertanyaan, setPertanyaan] = useState();
    let [dimensi, setDimensi] = useState();
    let [attachment, setAttachment] = useState();

    function handleSubmit(e) {
        // e.preventDefault();
        let data = {
            pertanyaan: pertanyaan,
            dimensi: dimensi,
            // test_id: testId,
            // attachment: attachment,
        };
        console.log(data);
        Inertia.post("/create-new-soal", data);
        window.location.reload();
        onClose(false);
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-black text-blue-800">
                        Tambah Soal
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                                            <div className="mt-2">
                                                {/* <h1 className="flex font-bold justify-start text-lg items-start mt-4 mb-2 text-blue-3">
                                                    Attachment
                                                </h1>
                                                <div className="border border-black rounded-lg p-2">
                                                    <FileUpload
                                                        className="jutify-start flex"
                                                        mode="basic"
                                                        name="demo[]"
                                                        url="/api/upload"
                                                        accept="image/*"
                                                        maxFileSize={1000000}
                                                        // onUpload={onUpload}
                                                    />
                                                </div> */}
                                                <h1 className="flex font-bold justify-start text-lg items-start mt-4 mb-2 text-blue-3">
                                                    Soal
                                                </h1>
                                                <LexicalEditor
                                                    value={pertanyaan || ""}
                                                    onChange={(htmlContent) => {
                                                        console.log(htmlContent);
                                                        setPertanyaan(htmlContent);
                                                    }}
                                                    placeholder="Masukkan soal di sini..."
                                                    className="border border-gray-300 rounded-lg"
                                                />
                        <div>
                            <h1 className="flex justify-start font-bold text-lg items-start mb-2 text-blue-800">
                                Dimensi
                            </h1>
                            <Select value={dimensi} onValueChange={setDimensi} required>
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Attachment
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setAttachment(e.target.files[0])}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                accept="image/*"
                            />
                        </div>
                        </div>
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
