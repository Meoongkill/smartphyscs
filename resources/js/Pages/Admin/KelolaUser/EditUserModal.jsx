import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";

export default function EditUserModal({ isOpen, onClose, data, selectedUserId }) {
    const [nik, setNik] = useState("");
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [nomorHP, setNomorHP] = useState("");
    const [alamat, setAlamat] = useState("");
    // const [foto, setFoto] = useState(null);

    useEffect(() => {
        if (selectedUserId && data) {
            const selectedUser = data.find(user => user.id === selectedUserId);
            setNik(selectedUser.nik);
            setNama(selectedUser.name);
            setEmail(selectedUser.email);
            setNomorHP(selectedUser.nohp);
            setAlamat(selectedUser.alamat);
        }
    }, [selectedUserId, data]);

    function handleSubmit(e) {
        e.preventDefault();
        console.log("edit user");
        let data = {
            id: selectedUserId,
            name: nama,
            nik: nik,
            email: email,
            nohp: nomorHP,
            alamat: alamat
        };
        console.log("data edit user", data);
        Inertia.patch("/admin/users/update", data);
        window.location.reload();
        onClose(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-800 text-center">
                        Edit Peserta
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Edit informasi peserta yang sudah terdaftar
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nik">NIK Peserta</Label>
                            <Input
                                id="nik"
                                placeholder="Masukan NIK peserta"
                                value={nik}
                                onChange={(e) => setNik(e.target.value)}
                                type="text"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Peserta</Label>
                            <Input
                                id="nama"
                                placeholder="Masukan nama peserta"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                type="text"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Peserta</Label>
                            <Input
                                id="email"
                                placeholder="Masukan email peserta"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="nomorHP">Nomor HP Peserta</Label>
                            <Input
                                id="nomorHP"
                                placeholder="Masukan nomor HP peserta"
                                value={nomorHP}
                                onChange={(e) =>
                                    setNomorHP(e.target.value.replace(/\D/g, '').slice(0, 10))
                                }
                                type="tel"
                                pattern="[0-9]*"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="alamat">Alamat Peserta</Label>
                        <Textarea
                            id="alamat"
                            placeholder="Masukan alamat peserta"
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onClose(false)}
                            className="flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-blue-800 hover:bg-blue-700"
                        >
                            Update Peserta
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
