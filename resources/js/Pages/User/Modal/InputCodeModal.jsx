import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { KeyIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function InputCodeModal({ isOpen, onClose, onSubmit, code, setCode }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <KeyIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold text-blue-800">
                        Mulai Asesmen
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                        Masukkan kode asesmen yang telah diberikan untuk memulai sesi tes Anda.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="assessment-code" className="text-lg font-semibold text-gray-700">
                            Kode Asesmen
                        </Label>
                        <Input
                            id="assessment-code"
                            placeholder="Masukan kode asesmen"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="text-base font-normal border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            type="text"
                            required
                        />
                    </div>
                    
                    <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onClose(false)}
                            className="w-full sm:w-auto border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400"
                        >
                            <XMarkIcon className="h-4 w-4 mr-2" />
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <KeyIcon className="h-4 w-4 mr-2" />
                            Lanjutkan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
