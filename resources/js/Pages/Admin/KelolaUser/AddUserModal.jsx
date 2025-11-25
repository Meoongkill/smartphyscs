import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Link, router } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import { ArrowPathIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { generatePassword } from '@/utils';
import axios from "axios";
import Swal from "sweetalert2";
export default function AddUserModal({ isOpen, onClose }) {
    const [nama, setNama] = useState("");
    const [nik, setNik] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nomorHP, setNomorHP] = useState("");
    const [alamat, setAlamat] = useState("");
    // const [foto, setFoto] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState([]);
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 5000,
    });
    function handleSubmit(e) {
        e.preventDefault();
        let data = {
            name: nama,
            email: email,
            password: password,
            nik: nik,
            nohp: nomorHP,
            alamat: alamat,
            foto: "-"
        };
        console.log(data);
        axios
            .post("/admin/users/add", data)
            .then((response) => {
                toast.fire({
                    icon: response.data.error ? "error" : "success",
                    title: response.data.message,
                });
                router.visit("/admin/users");
            })
            .catch((error) => {
                if (error.response && error.response.status === 422) {
                    // Cek apakah ada error dari nik
                    if (
                        error.response.data.errors &&
                        error.response.data.errors.nik
                    ) {
                        toast.fire({
                            icon: "error",
                            title: "NIK telah terdaftar, silahkan gunakan nik lain",
                        });
                    } else {
                        toast.fire({
                            icon: "error",
                            title: "Email telah terdaftar, silahkan gunakan email lain",
                        });
                    }
                } else {
                    console.log("Unexpected error:", error);
                }
            });
        onClose(false);
    }

    const validatePassword = (password) => {
        const errorMessages = [];
        // Minimal 8 karakter
        if (password.length < 8) {
            errorMessages.push("Password minimal 8 karakter.");
        }
        return errorMessages;
    };

    const handleChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);

        // Validasi password
        const validationErrors = validatePassword(newPassword);
        setErrors(validationErrors);
    };


    const handleGeneratePassword = () => {
        const newPassword = generatePassword();
        setPassword(newPassword);
    };

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     setFoto(file);
    // };

    // show/hide password
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-800 text-center">
                        Tambah Peserta
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Tambahkan peserta baru ke dalam sistem
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
                                onChange={(e) =>
                                    setNik(e.target.value.replace(/\D/g, '').slice(0, 16))
                                }
                                type="text"
                                inputMode="numeric"
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
                                    setNomorHP(e.target.value.replace(/\D/g, '').slice(0, 13))
                                }
                                type="text"
                                inputMode="numeric"
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
                    
                    <div className="space-y-2">
                        <Label htmlFor="password">Password Peserta</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                placeholder="Masukan password peserta"
                                value={password}
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                required
                                className="pr-20"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center">
                                {password.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={togglePasswordVisibility}
                                        className="h-full px-3 py-2 hover:bg-transparent"
                                    >
                                        {showPassword ? (
                                            <EyeIcon className="h-4 w-4" />
                                        ) : (
                                            <EyeSlashIcon className="h-4 w-4" />
                                        )}
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleGeneratePassword}
                                    className="h-full px-3 py-2 hover:bg-transparent"
                                >
                                    <ArrowPathIcon className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        {password.length > 0 && errors.length > 0 && (
                            <div className="text-red-500 text-sm">
                                {errors.map((error, index) => (
                                    <p key={index}>{error}</p>
                                ))}
                            </div>
                        )}
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
                            disabled={errors.length > 0 || password.length === 0}
                            className="flex-1 bg-blue-800 hover:bg-blue-700"
                        >
                            Simpan Peserta
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
