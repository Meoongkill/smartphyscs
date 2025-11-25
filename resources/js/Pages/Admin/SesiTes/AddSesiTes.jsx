import { Fragment, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { router } from "@inertiajs/react";

const validationSchema = Yup.object().shape({
    nama: Yup.string().required("Nama Sesi harus diisi"),
    deskripsi: Yup.string().required("Deskripsi Sesi harus diisi"),
    startDate: Yup.date().required("Start Date harus diisi"),
    endDate: Yup.date().required("End Date harus diisi"),
    durasiStudiKasus: Yup.number()
        .typeError("Durasi Studi Kasus harus berupa angka")
        .required("Durasi Studi Kasus harus diisi")
        .min(
            0,
            "Durasi Studi Kasus harus lebih besar dari atau sama dengan nol"
        ),
    durasiIntrayAnalisis: Yup.number()
        .typeError("Durasi Intray Analisis harus berupa angka")
        .required("Durasi Intray Analisis harus diisi")
        .min(
            0,
            "Durasi Intray Analisis harus lebih besar dari atau sama dengan nol"
        ),
    durasiKuisionerPerilaku: Yup.number()
        .typeError("Durasi Kuisioner Perilaku harus berupa angka")
        .required("Durasi Kuisioner Perilaku harus diisi")
        .min(
            1,
            "Durasi Kuisioner Perilaku minimal satu menit"
        ),
});
const toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
});
const AddSesiTes = ({ isOpen, onClose, data, paket }) => {
    const initialValues = {
        nama: data ? data.name || "" : "",
        deskripsi: data ? data.description || "" : "",
        durasiStudiKasus: data ? data.duration_1 || "" : "",
        durasiIntrayAnalisis: data ? data.duration_2 || "" : "",
        durasiKuisionerPerilaku: data ? data.duration_3 || "" : "",
        startDate: data ? data.start_date || "" : "",
        endDate: data ? data.end_date || "" : "",
    };
    const preSelectedIds = data.test_collections ? data.test_collections.map(item => item.test_collection) : [];
    const [selectedPaket, setSelectedPaket] = useState(preSelectedIds);
    const getUniqueQuestionTypes = (paket) => {
        let questionTypes = [];

        // Check if paket is an array and has content
        if (Array.isArray(paket) && paket.length > 0) {
            paket.forEach((testCollection) => {
                // Ensure pivot_questions exists and is an array
                if (Array.isArray(testCollection.pivot_questions)) {
                    testCollection.pivot_questions.forEach((pivot) => {
                        if (pivot.question && pivot.question.type) {
                            questionTypes.push(pivot.question.type);
                        }
                    });
                }
            });
        }

        return [...new Set(questionTypes)];
    };

    const neededTypes = ['studi_kasus', 'intray_analisis', 'kuisioner_perilaku']
    let uniqueTypes = [];
    // mendapatkan kategori soal dari paket yang dipilih
    useEffect(() => {
        uniqueTypes = getUniqueQuestionTypes(selectedPaket);
    }, [selectedPaket]);

    const handleSubmit = (values) => {
        if (!selectedPaket || selectedPaket.length === 0) {
            toast.fire({
                icon: "error",
                title: "pilih minimal 1 paket",
                padding: "10px 20px",
            });
            return;
        } else if (uniqueTypes.length < 3) {
            // cek apakah semua kategori soal sudah tersedia
            const missingTypes = neededTypes.filter(type => !uniqueTypes.includes(type)).map(type => type.replace(/_/g, ' ')).join(', ');
            toast.fire({
                icon: "error",
                title: `Paket yang dipilih belum memiliki kategori soal ${missingTypes}`,
                padding: "10px 20px",
            });
            return;
        }
        else {
            const payload = {
                kode: data ? data.code : "",
                name: values.nama,
                description: values.deskripsi,
                start_date: values.startDate,
                end_date: values.endDate,
                duration_1: values.durasiStudiKasus,
                duration_2: values.durasiIntrayAnalisis,
                duration_3: values.durasiKuisionerPerilaku,
                test_collections: selectedPaket.map((p) => ({
                    test_collection_id: p.id,
                })),
            };

            if (data) {
                payload.id = data.id;
                axios.patch("/session/update", payload).then((res) => {
                    toast.fire({
                        icon: res.data.error ? "error" : "success",
                        title: res.data.message,
                    });
                    router.visit(`/session/${res.data.kode}`);
                });
            } else {
                axios.post("/add-session", payload).then((res) => {
                    toast.fire({
                        icon: res.data.error ? "error" : "success",
                        title: res.data.message,
                    });
                    router.visit("/session");
                });
            }
        }

        onClose(true);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {data ? "Edit Sesi Tes" : "Tambah Sesi Tes"}
                    </DialogTitle>
                    <DialogDescription>
                        {data ? "Edit informasi sesi tes" : "Tambahkan sesi tes baru"}
                    </DialogDescription>
                </DialogHeader>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form className="space-y-4">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="nama" className="text-lg font-bold">
                                        Nama Sesi
                                    </Label>
                                    <Field
                                        name="nama"
                                        as={Input}
                                        placeholder="Masukan nama sesi"
                                        className="mt-1"
                                        required
                                    />
                                    <ErrorMessage
                                        name="nama"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="deskripsi" className="text-lg font-bold">
                                        Deskripsi Sesi
                                    </Label>
                                    <Field
                                        name="deskripsi"
                                        as={Textarea}
                                        placeholder="Masukan deskripsi tes"
                                        className="mt-1 min-h-20"
                                        rows="4"
                                        required
                                    />
                                    <ErrorMessage
                                        name="deskripsi"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="startDate" className="text-lg font-bold">
                                            Start Date
                                        </Label>
                                        <Field
                                            name="startDate"
                                            as={Input}
                                            type="datetime-local"
                                            className="mt-1"
                                            required
                                        />
                                        <ErrorMessage
                                            name="startDate"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="endDate" className="text-lg font-bold">
                                            End Date
                                        </Label>
                                        <Field
                                            name="endDate"
                                            as={Input}
                                            type="datetime-local"
                                            className="mt-1"
                                            required
                                        />
                                        <ErrorMessage
                                            name="endDate"
                                            component="div"
                                            className="text-red-500 text-sm mt-1"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-lg font-bold">
                                        Pilih Paket
                                    </Label>
                                    <div className="mt-1 space-y-2">
                                        {paket.map((item) => (
                                            <div key={item.id} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id={`paket-${item.id}`}
                                                    checked={selectedPaket.some(p => p.id === item.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedPaket([...selectedPaket, item]);
                                                        } else {
                                                            setSelectedPaket(selectedPaket.filter(p => p.id !== item.id));
                                                        }
                                                    }}
                                                    className="rounded border-gray-300"
                                                />
                                                <label htmlFor={`paket-${item.id}`} className="text-sm">
                                                    {item.nama}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="durasiStudiKasus" className="text-lg font-bold">
                                        Durasi Studi Kasus
                                    </Label>
                                    <Field
                                        name="durasiStudiKasus"
                                        as={Input}
                                        type="number"
                                        min="1"
                                        placeholder="Masukan durasi dalam Menit"
                                        className="mt-1"
                                        required
                                    />
                                    <ErrorMessage
                                        name="durasiStudiKasus"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="durasiIntrayAnalisis" className="text-lg font-bold">
                                        Durasi Intray Analisis
                                    </Label>
                                    <Field
                                        name="durasiIntrayAnalisis"
                                        as={Input}
                                        type="number"
                                        min="1"
                                        placeholder="Masukan durasi dalam Menit"
                                        className="mt-1"
                                        required
                                    />
                                    <ErrorMessage
                                        name="durasiIntrayAnalisis"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="durasiKuisionerPerilaku" className="text-lg font-bold">
                                        Durasi Kuisioner Perilaku
                                    </Label>
                                    <Field
                                        name="durasiKuisionerPerilaku"
                                        as={Input}
                                        type="number"
                                        min="1"
                                        placeholder="Masukan durasi dalam Menit"
                                        className="mt-1"
                                        required
                                    />
                                    <ErrorMessage
                                        name="durasiKuisionerPerilaku"
                                        component="div"
                                        className="text-red-500 text-sm mt-1"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={isSubmitting}
                                >
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
};

export default AddSesiTes;
