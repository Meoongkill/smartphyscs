import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import Modal from "@/Pages/Admin/SesiTes/AddSesiTes";
import { Link } from "@inertiajs/react";
import NotFoundAnimation from "@/Assets/NotFoundAnimation.json";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { PlusIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import Lottie from "lottie-react";
import Swal from "sweetalert2";
import { router } from "@inertiajs/react";

export default function Index({ auth, session, paket }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        // Inertia.patch("/session/delete", data);
        axios.patch("/session/delete", data).then((res) => {
            toast.fire({
                icon: res.data.error ? "error" : "success",
                title: res.data.message,
            });
            router.visit("/session");
        });
    };

    useEffect(() => {
        console.log('paket:', paket);
    }, [paket]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col md:flex-row justify-between item-center gap-4">
                    <h2 className="font-semibold text-4xl text-gray-800 leading-tight">
                        Daftar Sesi Asesmen yang telah dibuat
                    </h2>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-800 hover:bg-blue-700"
                    >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Tambah Sesi Asesmen
                    </Button>
                </div>
            }
            pages={"dashboard"}
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="bg-white overflow-hidden sm:rounded-lg">
                    <main className="flex-1">
                        {session?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {session?.map((sesi, index) => (
                                        <Card key={index} className="flex flex-col h-full">
                                            <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-600 text-white rounded-t-lg">
                                                <div className="flex justify-between items-start">
                                                    <Badge variant="secondary" className="bg-white text-blue-800 font-bold">
                                                        {sesi.code}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-white hover:bg-blue-700 h-8 w-8 p-0"
                                                        onClick={() => handleDelete(sesi.id)}
                                                    >
                                                        <TrashIcon className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <CardTitle className="text-xl font-bold text-white mt-2">
                                                    {sesi.name}
                                                </CardTitle>
                                                <CardDescription className="text-blue-100 text-sm">
                                                    {sesi.start_date} - {sesi.end_date}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="flex-grow p-4">
                                                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                                    {sesi.description}
                                                </p>
                                                <div className="mt-auto">
                                                    <Link href={`session/${sesi.code}`}>
                                                        <Button className="w-full bg-blue-800 hover:bg-blue-700">
                                                            <EyeIcon className="h-4 w-4 mr-2" />
                                                            Lihat Detail
                                                        </Button>
                                                    </Link>
                                                </div>
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
                                        Belum ada Sesi
                                    </p>
                                </div>
                            )}
                        </main>

                        {isModalOpen && (
                            <Modal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                data={""}
                                paket={paket}
                            />
                        )}
                        {/* {isModalEditOpen && (
                            <EditKoleksiModal
                                isOpen={isModalEditOpen}
                                onClose={() => setIsModalEditOpen(false)}
                                data={session}
                                selectedTestId={selectedTestId}
                            />
                        )} */}
                    </div>
                </div>
        </AuthenticatedLayout>
    );
}
