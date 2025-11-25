import { Fragment, useRef, useState } from "react";
import { Link, router } from "@inertiajs/react";
import {
    ArrowPathIcon,
    EyeIcon,
    EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { generatePassword } from "@/utils";
import axios from "axios";
import Swal from "sweetalert2";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Checkbox } from "@/Components/ui/checkbox";
export default function AddPsikologModal({ isOpen, onClose, sessions }) {
    const [nama, setNama] = useState("");
    const [nik, setNik] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nomorHP, setNomorHP] = useState("");
    const [alamat, setAlamat] = useState("");
    const [signature, setSignature] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const [selectedSessions, setSelectedSessions] = useState([]);
    // const [foto, setFoto] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState([]);
    
    // Debug: log sessions data
    console.log('AddPsikologModal - Sessions data:', sessions);
    
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 5000,
    });
    function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', nama);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('nik', nik);
        formData.append('nohp', nomorHP);
        formData.append('alamat', alamat);
        formData.append('foto', '-');
        
        if (signature) {
            formData.append('signature', signature);
        }
        
        // Append selected sessions as array
        selectedSessions.forEach((sessionId) => {
            formData.append('sessions[]', sessionId);
        });

        axios
            .post("/admin/psikolog/add", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                toast.fire({
                    icon: response.data.error ? "error" : "success",
                    title: response.data.message,
                });
                router.visit("/admin/psikolog");
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

    const handleGeneratePassword = () => {
        const newPassword = generatePassword();
        setPassword(newPassword);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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

    const handleSignatureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSignature(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setSignaturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSessionToggle = (sessionId) => {
        setSelectedSessions((prev) => {
            if (prev.includes(sessionId)) {
                return prev.filter((id) => id !== sessionId);
            } else {
                return [...prev, sessionId];
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-blue-800 text-center">
                        Tambah Psikolog
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Tambahkan data psikolog baru ke dalam sistem
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nik">NIK Psikolog</Label>
                            <Input
                                id="nik"
                                placeholder="Masukan NIK psikolog"
                                value={nik}
                                onChange={(e) =>
                                    setNik(
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 16)
                                    )
                                }
                                type="text"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Psikolog</Label>
                            <Input
                                id="nama"
                                placeholder="Masukan nama psikolog"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                type="text"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Psikolog</Label>
                            <Input
                                id="email"
                                placeholder="Masukan email psikolog"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nomorHP">Nomor HP Psikolog</Label>
                            <Input
                                id="nomorHP"
                                placeholder="Masukan nomor HP psikolog"
                                value={nomorHP}
                                onChange={(e) =>
                                    setNomorHP(
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 13)
                                    )
                                }
                                type="tel"
                                pattern="[0-9]*"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="alamat">Alamat Psikolog</Label>
                        <Textarea
                            id="alamat"
                            placeholder="Masukan alamat psikolog"
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password Psikolog</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                placeholder="Masukan password psikolog"
                                value={password}
                                onChange={handleChange}
                                type={showPassword ? "text" : "password"}
                                required
                            />
                            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleGeneratePassword}
                                    className="h-8 w-8 p-0"
                                >
                                    <ArrowPathIcon className="h-4 w-4" />
                                </Button>
                                {password.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={togglePasswordVisibility}
                                        className="h-8 w-8 p-0"
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-4 w-4" />
                                        ) : (
                                            <EyeIcon className="h-4 w-4" />
                                        )}
                                    </Button>
                                )}
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

                    <div className="space-y-2">
                        <Label htmlFor="signature">Tanda Tangan Psikolog (Opsional)</Label>
                        <p className="text-xs text-gray-500">Format: JPG, PNG, atau JPEG (max 2MB)</p>
                        <div className="relative">
                            <label 
                                htmlFor="signature" 
                                className="flex items-center justify-center w-full h-32 px-4 transition border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50"
                            >
                                <div className="flex flex-col items-center space-y-2">
                                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <div className="flex flex-col items-center">
                                        <span className="font-medium text-blue-600">Klik untuk upload</span>
                                        <span className="text-xs text-gray-500">atau drag & drop file di sini</span>
                                    </div>
                                    {signature && (
                                        <span className="text-sm text-green-600 font-medium">✓ {signature.name}</span>
                                    )}
                                </div>
                                <Input
                                    id="signature"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSignatureChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {signaturePreview && (
                            <div className="mt-2 p-3 border-2 border-green-200 rounded-lg bg-green-50">
                                <p className="text-xs text-green-700 mb-2 font-medium">✓ Preview Tanda Tangan:</p>
                                <img
                                    src={signaturePreview}
                                    alt="Preview Tanda Tangan"
                                    className="h-32 object-contain mx-auto border border-gray-200 rounded p-2 bg-white"
                                />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-semibold">Sesi yang Dapat Diakses</Label>
                        <p className="text-sm text-gray-500">Pilih sesi yang dapat diakses oleh psikolog ini</p>
                        <div className="border-2 border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto space-y-3 bg-gray-50">
                            {sessions && sessions.length > 0 ? (
                                sessions.map((session) => (
                                    <div key={session.id} className="flex items-start space-x-3 p-3 hover:bg-white rounded-md transition-colors border border-transparent hover:border-blue-200">
                                        <Checkbox
                                            id={`session-${session.id}`}
                                            checked={selectedSessions.includes(session.id)}
                                            onCheckedChange={() => handleSessionToggle(session.id)}
                                            className="mt-0.5"
                                        />
                                        <label
                                            htmlFor={`session-${session.id}`}
                                            className="text-sm font-medium leading-relaxed cursor-pointer flex-1 select-none"
                                        >
                                            {session.name}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">Tidak ada sesi tersedia</p>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 italic">
                            {selectedSessions.length > 0 
                                ? `✓ ${selectedSessions.length} sesi dipilih` 
                                : 'Belum ada sesi yang dipilih'}
                        </p>
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
                            className="flex-1 bg-blue-800 hover:bg-blue-900"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
