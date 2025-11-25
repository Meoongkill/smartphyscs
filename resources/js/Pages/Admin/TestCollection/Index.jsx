import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import EditPaketModal from "./EditPaketModal";
import { Link } from "@inertiajs/react";
import NotFoundAnimation from "@/Assets/NotFoundAnimation.json";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import {
    PencilSquareIcon,
    PlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { Inertia } from "@inertiajs/inertia";
import Lottie from "lottie-react";
import AddPaketModal from "./AddPaketModal";
import { router } from "@inertiajs/react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Index({ auth, testCollection }) {
    const [testCollectionData, setTestCollectionData] =
        useState(testCollection);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);
    const toast = Swal.mixin({
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 3000,
    });
    const handleDelete = (id) => {
        const data = {
            id,
        };
        axios.patch("/test-collection/delete", data).then((res) => {
            toast.fire({
                icon: res.data.error ? "error" : "success",
                title: res.data.message,
            });
            router.visit("/test-collection");
        });
    };

    const [selectedTestId, setSelectedTestId] = useState(null);
    const handleEdit = (testId) => {
        setSelectedTestId(testId);
        setIsModalEditOpen(true);
    };

    const reload = () => {
        setTimeout(() => {
            Inertia.visit(window.location.href, {
                only: ["testCollection"],
                preserveScroll: true,
                preserveState: true,
                replace: false,
            });
        }, 1000);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between item-center gap-4">
                    <h2 className="font-semibold text-4xl text-gray-800 leading-tight">
                        Daftar Paket Soal
                    </h2>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Tambah Paket
                    </Button>
                </div>
            }
            pages={"dashboard"}
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="bg-white overflow-hidden sm:rounded-lg">
                    <main className="flex-1">
                        {testCollectionData.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {testCollectionData.map((test, index) => (
                                        <Card key={index} className="flex flex-col">
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="secondary">
                                                        {test.kode}
                                                    </Badge>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(test.id)}
                                                        >
                                                            <TrashIcon className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(test.id)}
                                                        >
                                                            <PencilSquareIcon className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <CardTitle className="line-clamp-1">
                                                    {test.nama}
                                                </CardTitle>
                                                <CardDescription className="line-clamp-2 flex-grow">
                                                    {test.deskripsi}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="mt-auto">
                                                <Button asChild className="w-full">
                                                    <Link href={`/test-collection/${test.kode}`}>
                                                        Detail
                                                    </Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 flex flex-col justify-center items-center w-full flex-grow">
                                    <Lottie
                                        animationData={NotFoundAnimation}
                                        loop={true}
                                        className="h-96 w-auto"
                                    />
                                    <p className="font-poppins  text-lg">
                                        Belum ada paket
                                    </p>
                                </div>
                            )}
                        </main>

                        {isModalOpen && (
                            <AddPaketModal
                                reload={reload}
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                            />
                        )}
                        {isModalEditOpen && (
                            <EditPaketModal
                                isOpen={isModalEditOpen}
                                onClose={() => setIsModalEditOpen(false)}
                                data={testCollection}
                                selectedTestId={selectedTestId}
                            />
                        )}
                    </div>
                </div>
        </AuthenticatedLayout>
    );
}
