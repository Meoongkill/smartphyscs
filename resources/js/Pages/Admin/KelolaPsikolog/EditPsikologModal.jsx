import { useState, useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Checkbox } from "@/Components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

export default function EditPsikologModal({ isOpen, onClose, data, selectedUserId, sessions }) {
    const { flash } = usePage().props;
    const [nik, setNik] = useState("");
    const [nama, setNama] = useState("");
    const [email, setEmail] = useState("");
    const [nomorHP, setNomorHP] = useState("");
    const [alamat, setAlamat] = useState("");
    const [signature, setSignature] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const [currentSignature, setCurrentSignature] = useState(null);
    const [selectedSessions, setSelectedSessions] = useState([]);
    const [notification, setNotification] = useState(null);
    // const [foto, setFoto] = useState(null);

    useEffect(() => {
        if (selectedUserId && data) {
            const selectedUser = data.find(user => user.id === selectedUserId);
            setNik(selectedUser.nik);
            setNama(selectedUser.name);
            setEmail(selectedUser.email);
            setNomorHP(selectedUser.nohp);
            setAlamat(selectedUser.alamat);
            setCurrentSignature(selectedUser.signature);
            
            // Set assigned sessions
            if (selectedUser.assigned_sessions) {
                const assignedIds = selectedUser.assigned_sessions.map(s => s.id);
                setSelectedSessions(assignedIds);
            }
        }
    }, [selectedUserId, data]);

    function handleSubmit(e) {
        e.preventDefault();
        console.log("edit user");
        const formData = new FormData();
        formData.append('id', selectedUserId);
        formData.append('name', nama);
        formData.append('nik', nik);
        formData.append('email', email);
        formData.append('nohp', nomorHP);
        formData.append('alamat', alamat);
        formData.append('_method', 'PATCH');
        
        if (signature) {
            formData.append('signature', signature);
        }
        
        // Append selected sessions as array
        selectedSessions.forEach((sessionId) => {
            formData.append('sessions[]', sessionId);
        });

        console.log("data edit user", Object.fromEntries(formData));
        
        Inertia.post("/admin/psikolog/update", formData, {
            forceFormData: true,
            onSuccess: () => {
                console.log('Update berhasil');
                setNotification({ type: 'success', message: 'Data psikolog berhasil diperbarui!' });
                setTimeout(() => {
                    onClose(false);
                    window.location.reload();
                }, 1500);
            },
            onError: (errors) => {
                console.error('Update gagal:', errors);
                setNotification({ type: 'error', message: 'Gagal memperbarui data. Silakan coba lagi.' });
            }
        });
    }

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
                        Edit Psikolog
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Edit data psikolog yang sudah ada
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {notification && (
                        <div className={`p-4 rounded-lg ${
                            notification.type === 'success' 
                                ? 'bg-green-50 border border-green-200 text-green-800' 
                                : 'bg-red-50 border border-red-200 text-red-800'
                        }`}>
                            <div className="flex items-center">
                                <span className="text-lg mr-2">
                                    {notification.type === 'success' ? '✓' : '✗'}
                                </span>
                                <span className="font-medium">{notification.message}</span>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="nik">NIK Psikolog</Label>
                            <Input
                                id="nik"
                                placeholder="Masukan NIK psikolog"
                                value={nik}
                                onChange={(e) => setNik(e.target.value)}
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
                                        e.target.value.replace(/\D/g, '').slice(0, 10)
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
                        <Label htmlFor="signature">Tanda Tangan Psikolog</Label>
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
                        {(signaturePreview || currentSignature) && (
                            <div className="mt-2 p-3 border-2 border-green-200 rounded-lg bg-green-50">
                                <p className="text-xs text-green-700 mb-2 font-medium">
                                    {signaturePreview ? "✓ Preview Tanda Tangan Baru:" : "📝 Tanda Tangan Saat Ini:"}
                                </p>
                                <img
                                    src={signaturePreview || `/storage/${currentSignature}`}
                                    alt="Tanda Tangan"
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
                                            id={`session-edit-${session.id}`}
                                            checked={selectedSessions.includes(session.id)}
                                            onCheckedChange={() => handleSessionToggle(session.id)}
                                            className="mt-0.5"
                                        />
                                        <label
                                            htmlFor={`session-edit-${session.id}`}
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
                            className="flex-1 bg-blue-800 hover:bg-blue-900"
                        >
                            Update
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
