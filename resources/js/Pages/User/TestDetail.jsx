import BottomNav from "@/Components/BottomNav";
import QuestionNumBox from "@/Components/QuestionNumBox";
import { Inertia } from "@inertiajs/inertia";
import { Link } from "@inertiajs/inertia-react";
import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function TestDetail({ testCollection, auth }) {
    const [name, setName] = useState(auth.user.name);
    const [email, setEmail] = useState(auth.user.email);

    return (
        <AuthenticatedLayout user={auth.user}>
            <main>
                <div className="w-full sm:px-0 lg:px-24">
                    <h1 className="text-2xl text-center font-bold py-2 mb-4">
                        Detail Asesmen
                    </h1>
                    <div className="sm:mb-0 border md:p-6 sm:p-0 shadow-lg rounded-lg overflow-x-auto flex flex-col">
                        <div className="container mb-3 flex-grow">
                            <div className="text-l">
                                <table className="table-auto w-full">
                                    <tbody>
                                        <tr>
                                            <td className="w-2/12 font-bold px-4 py-2">
                                                Nama
                                            </td>
                                            <td className="w-10/12 px-4 py-2 break-all">
                                                : {testCollection.nama}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-2/12 font-bold px-4 py-2">
                                                Tanggal
                                            </td>
                                            <td className="w-10/12 px-4 py-2 break-all">
                                                : {testCollection.tanggal}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-2/12 font-bold px-4 py-2">
                                                Durasi
                                            </td>
                                            <td className="w-10/12 px-4 py-2 break-all">
                                                : {testCollection.jam == 0 ? "" : testCollection.jam + " Jam"} {testCollection.menit == 0 ? "" : testCollection.menit + " Menit"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-2/12 font-bold px-4 py-2">
                                                Deskripsi
                                            </td>
                                            <td className="w-10/12 px-4 py-2 break-all">
                                                : {testCollection.deskripsi}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-2/12 font-bold px-4 py-2">
                                                Kode
                                            </td>
                                            <td className="w-10/12 px-4 py-2 break-all">
                                                : {testCollection.kode}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <b className="px-4">
                            Detail Pengguna
                        </b>
                        <div className="card rounded-lg p-4">
                            <input
                                type="text"
                                disabled
                                className="rounded-lg p-3 bg-gray-100 w-full border-none break-all"
                                value={name}
                                placeholder="Nama Lengkap"
                            />
                        </div>
                        <div className="card rounded-lg px-4">
                            <input
                                disabled
                                type="text"
                                className="rounded-lg p-3 bg-gray-100 w-full border-none break-all"
                                value={email}
                                placeholder="Email"
                            />
                        </div>
                        <a className="p-4" href={`/test/${testCollection.kode}`}>
                            <h1 className="text-lg font-bold bg-blue-800 border border-transparent rounded-md text-center py-2 text-white hover:bg-blue-900 focus:bg-cyan-700 active:bg-gray-900 focus:text-white focus:outline-none transition ease-in-out duration-150">
                                Mulai Asesmen
                            </h1>
                        </a>
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
