import { useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import Swal from "sweetalert2";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Label } from "@/Components/ui/label";

export default function AddPaketModal({ isOpen, onClose, reload }) {
    let [nama, setNama] = useState("");
    let [deskripsi, setDeskripsi] = useState("");
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
    });

    async function handleSubmit(event) {
        event.preventDefault();
        let data = {
            nama: nama,
            deskripsi: deskripsi,
        };
        try {
            const res = await axios.post("/test-collection", data);
            toast.fire({
                icon: res.data.error ? "error" : "success",
                title: res.data.message,
            });
            window.location.reload();
        } catch (error) {
            toast.fire({
                icon: "error",
                title: "An error occurred while submitting the form",
            });
        }
        onClose(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Tambah Paket</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nama">Nama Paket</Label>
                        <Input
                            id="nama"
                            placeholder="Masukan nama koleksi tes"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="deskripsi">Deskripsi Paket</Label>
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
                            Submit
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
