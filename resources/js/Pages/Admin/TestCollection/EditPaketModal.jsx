import { useRef, useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import axios from "axios";
import Swal from "sweetalert2";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";

export default function EditPaketModal({
    isOpen,
    onClose,
    data,
    selectedTestId,
}) {
    let [nama, setNama] = useState("");
    let [deskripsi, setDeskripsi] = useState("");
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
    });

    useEffect(() => {
        if (selectedTestId && data) {
            const selectedTest = data.find(
                (test) => test.id === selectedTestId
            );
            setNama(selectedTest.nama);
            setDeskripsi(selectedTest.deskripsi);
        }
    }, [selectedTestId, data]);

    function handleSubmit() {
        console.log("edit paket");
        let data = {
            id: selectedTestId,
            nama: nama,
            deskripsi: deskripsi,
        };
        axios.patch("/test-collection/update", data).then((res) => {
            toast.fire({
                icon: res.data.error ? "error" : "success",
                title: res.data.message,
            });
            setTimeout(() => {
                Inertia.visit(window.location.href, {
                    only: ["testCollection"],
                    preserveScroll: true,
                    preserveState: true,
                    replace: false,
                });
            }, 1000);
        });
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Paket</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama">Nama Tes</Label>
                        <Input
                            id="nama"
                            placeholder="Masukan nama koleksi tes"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deskripsi">Deskripsi Tes</Label>
                        <Textarea
                            id="deskripsi"
                            placeholder="Masukan deskripsi tes"
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            rows={4}
                            required
                        />
                    </div>
                    <div className="flex gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => onClose(false)} className="flex-1">
                            Batal
                        </Button>
                        <Button type="submit" className="flex-1">
                            Simpan
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
