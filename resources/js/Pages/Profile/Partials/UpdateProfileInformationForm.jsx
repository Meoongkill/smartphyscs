import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const [file, setFile] = useState(null);
    const user = usePage().props.auth.user;
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            nik: user.nik,
            nohp: user.nohp,
            foto: user.foto,
            alamat: user.alamat,
        });
    const handleFileChange = (event) => {
        // Mengambil berkas pertama dari daftar berkas yang dipilih
        const selectedFile = event.target.files[0];
        const filename = selectedFile.name;
        setFile(selectedFile);
        setData("foto", selectedFile);
    };
    const submit = (e) => {
        e.preventDefault();
        post(route("profile.update"));
    };

    console.log(data);
    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Informasi profil
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    Perbarui informasi profil dan alamat email akun Anda.
                </p>
                <div>
                    {data.foto ? (
                        <img
                            src={`/foto/${data.foto}`}
                            alt=""
                            className="rounded-xl max-w-full h-auto max-h-70 w-60"
                        />
                    ) : (
                        <span className="text-gray-500">
                            Tambahkan foto profilmu!
                        </span>
                    )}
                </div>
            </header>

            <form
                onSubmit={submit}
                encType="multipart/form-data"
                className="mt-6 space-y-6"
            >
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <input
                        id="name"
                        className="mt-1 block w-full disabled rounded-md shadow-sm border-gray-300"
                        value={data.name}
                        // onChange={(e) => setData("name", e.target.value)}
                        // required
                        // isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>
                <div>
                    <InputLabel htmlFor="nik" value="NIK" />

                    <input
                        id="nik"
                        className="mt-1 block w-full disabled rounded-md shadow-sm border-gray-300"
                        value={data.nik}
                        // onChange={(e) => setData("nik", e.target.value)}
                        required
                        // isFocused
                        autoComplete="nik"
                    />

                    <InputError className="mt-2" message={errors.nik} />
                </div>
                <div>
                    <InputLabel htmlFor="nohp" value="No. Hp" />

                    <TextInput
                        id="nohp"
                        className="mt-1 block w-full"
                        value={data.nohp}
                        onChange={(e) => setData("nohp", e.target.value)}
                        required
                        isFocused
                        autoComplete="nohp"
                    />

                    <InputError className="mt-2" message={errors.nohp} />
                </div>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>
                <div>
                    <InputLabel htmlFor="foto" value="Foto" />

                    <input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        onChange={handleFileChange}
                    />

                    <InputError className="mt-2" message={errors.foto} />
                </div>

                <div>
                    <InputLabel htmlFor="alamat" value="Alamat Rumah" />

                    <TextInput
                        id="alamat"
                        className="mt-1 block w-full"
                        value={data.alamat}
                        onChange={(e) => setData("alamat", e.target.value)}
                        required
                        isFocused
                        autoComplete="alamat"
                    />

                    <InputError className="mt-2" message={errors.alamat} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800">
                            Your email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                </div>
            </form>
        </section>
    );
}
