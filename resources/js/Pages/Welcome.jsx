import { useEffect, useState } from "react";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import Checkbox from "@/Components/Checkbox";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
export default function Welcome({
    auth,
    laravelVersion,
    phpVersion,
    status,
    canResetPassword,
}) {
    // const Hero = "/img/hero.svg";
    // const bg = "/img/bg.svg";
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [errorMessage, setErrorMessage] = useState("");

    // useEffect(() => {
    //     // Tanggapi perubahan pada state errorMessage
    //     if (errorMessage) {
    //         // Tampilkan pesan kesalahan selama beberapa detik, kemudian hapus
    //         const timeout = setTimeout(() => {
    //             setErrorMessage("");
    //         }, 5000);

    //         // Membersihkan timeout saat komponen dibongkar atau state errorMessage berubah
    //         return () => clearTimeout(timeout);
    //     }
    // }, [errorMessage]);
    const [selectedRole, setSelectedRole] = useState("user");
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        role: selectedRole,
        remember: false,
    });
    const handleRoleChange = (selectedValue) => {
        setSelectedRole(selectedValue);
        setData("role", selectedValue);
    };
    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="grid grid-cols-2 h-[100vh]">
                <div className="bg-[url('/img/bglanding.svg')] bg-cover flex items-center pl-20">
                    <div className=" h-[80%] w-[70%]">
                        <h1 className="text-6xl font-semibold text-white">
                            SmartPsy Assessment
                        </h1>
                        <h1 className="text-2xl font-medium text-white mt-10">
                            Selamat Datang di Asisten Penilaian Asesmen
                            Psikologi Berbasis Artificial Intelligence
                        </h1>
                    </div>
                </div>
                <div className="flex items-center justify-end pr-20">
                    <div className="h-[80%] w-[70%] rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.25)] p-10 bg-[url('/img/bgcardlogin.svg')] bg-no-repeat bg-bottom">
                        <div className=" justify-between flex items-center">
                            <img
                                src="/img/logo.png"
                                width={"100px"}
                                height={"100px"}
                                alt=""
                            />
                            <h1 className="text-5xl font-extrabold text-blue-800">
                                Log in
                            </h1>
                        </div>
                        <form onSubmit={submit} className="mt-5">
                            <div>
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Masukkan email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Masukkan password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>
                            <fieldset className="my-4">
                                <legend className="text-sm text-center font-bold leading-6 text-indigo-600">
                                    Masuk Sebagai?
                                </legend>
                                <div className="flex gap-4 justify-center mt-2">
                                    <div className="flex items-center gap-x-3">
                                        <input
                                            id="push-email"
                                            name="push-notifications"
                                            type="radio"
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            value="user"
                                            checked={selectedRole === "user"}
                                            onChange={() =>
                                                handleRoleChange("user")
                                            }
                                        />
                                        <label
                                            htmlFor="push-email"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            User
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <input
                                            id="push-everything"
                                            name="push-notifications"
                                            type="radio"
                                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                            value="psikolog"
                                            checked={
                                                selectedRole === "psikolog"
                                            }
                                            onChange={() =>
                                                handleRoleChange("psikolog")
                                            }
                                        />
                                        <label
                                            htmlFor="push-everything"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Psikolog
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                            {/* <div className="block my-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span className="ms-2 text-sm text-gray-600">
                                        Remember me
                                    </span>
                                </label>
                            </div> */}

                            <PrimaryButton
                                className="w-full flex items-center justify-center"
                                disabled={processing}
                            >
                                <p className="text-center">Log in</p>
                            </PrimaryButton>
                            {/* <div className="container text-center pt-3">
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Lupa Password?
                                    </Link>
                                )}
                            </div> */}
                            {/* <div className="container text-center">
                                <Link
                                    href={route("register")}
                                    className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Belum punya akun?
                                </Link>
                            </div> */}
                        </form>
                    </div>
                </div>
            </div>

            {/* <div className="flex min-h-screen">
                <div
                    className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-20"
                    style={{ backgroundColor: "#3F51B5" }}
                >
                    <img
                        src={bg}
                        alt="hero"
                        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                    />
                    <div className="mx-auto w-full lg:w-100">
                        <div>
                            <h1 className="text-6xl font-bold tracking-tight text-white">
                                SmartPsych Assessment
                            </h1>
                            <p className="mt-2 text-xl text-white">
                                Aplikasi asesmen psikologi berbasis artificial intellegence
                            </p>
                        </div>
                        <div>
                            <button
                                className="px-8 py-2 mt-4 bg-white font-bold rounded-md hover:bg-gray-300"
                                onClick={() => location.replace("/login")}
                                style={{ color: "#3F51B5" }}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className="flex flex-1 flex-col justify-center hidden lg:flex h-screen w-full bg-cover bg-center"
                    style={{ backgroundColor: "#3F51B5" }}
                >
                    <div className="mx-auto w-full">
                        <div className="flex justify-center scale-90">
                            <img src={Hero} alt="hero" />
                        </div>
                    </div>
                </div>
            </div> */}
            {/*
            {errorMessage && (
                <div className="fixed top-0 right-0 p-4 m-4 bg-red-500 text-white">
                    {errorMessage}
                </div>
            )} */}
            {/*
            {isModalOpen && (
                <ModalJoin
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setErrorMessage("");
                    }}
                />
            )} */}
        </>
    );
}
