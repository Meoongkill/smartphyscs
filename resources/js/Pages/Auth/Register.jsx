import { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "user",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <>
            <Head title="Register" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
                <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left side - Branding */}
                    <div className="hidden lg:flex flex-col justify-center space-y-6 px-8">
                        <div className="space-y-4">
                            <img
                                src="/img/logo.png"
                                alt="SmartPsy Assessment"
                                className="h-16 w-auto"
                            />
                            <h1 className="text-4xl font-bold text-blue-900 leading-tight">
                                SmartPsy Assessment
                            </h1>
                            <p className="text-xl text-blue-700 leading-relaxed">
                                Bergabunglah dengan platform asesmen psikologi terdepan
                            </p>
                        </div>
                        <div 
                            className="w-full h-96 bg-no-repeat bg-contain bg-center"
                            style={{
                                backgroundImage: "url('/img/hero.svg')",
                            }}
                        />
                    </div>

                    {/* Right side - Register Form */}
                    <div className="flex justify-center">
                        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="space-y-1 text-center">
                                <div className="lg:hidden mb-4">
                                    <img
                                        src="/img/logo.png"
                                        alt="SmartPsy Assessment"
                                        className="h-12 w-auto mx-auto"
                                    />
                                </div>
                                <CardTitle className="text-2xl font-bold text-blue-900">
                                    Buat Akun Baru
                                </CardTitle>
                                <CardDescription className="text-blue-600">
                                    Daftar untuk mengakses platform asesmen psikologi
                                </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                                <form onSubmit={submit} className="space-y-4">
                                    {/* Role Selection */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-gray-700">
                                            Daftar Sebagai
                                        </Label>
                                        <RadioGroup
                                            value={data.role}
                                            onValueChange={(value) => setData("role", value)}
                                            className="flex space-x-6"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="user" id="user" />
                                                <Label htmlFor="user" className="text-sm font-medium cursor-pointer">
                                                    User
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="psikolog" id="psikolog" />
                                                <Label htmlFor="psikolog" className="text-sm font-medium cursor-pointer">
                                                    Psikolog
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                            Nama Lengkap
                                        </Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="w-full"
                                            autoComplete="name"
                                            placeholder="Masukkan nama lengkap Anda"
                                            onChange={(e) => setData("name", e.target.value)}
                                            required
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full"
                                            autoComplete="username"
                                            placeholder="Masukkan email Anda"
                                            onChange={(e) => setData("email", e.target.value)}
                                            required
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                            Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={data.password}
                                                className="w-full pr-10"
                                                autoComplete="new-password"
                                                placeholder="Masukkan password Anda"
                                                onChange={(e) => setData("password", e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <EyeIcon className="h-4 w-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Password Confirmation Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                                            Konfirmasi Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                type={showPasswordConfirmation ? "text" : "password"}
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="w-full pr-10"
                                                autoComplete="new-password"
                                                placeholder="Konfirmasi password Anda"
                                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                            >
                                                {showPasswordConfirmation ? (
                                                    <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                                ) : (
                                                    <EyeIcon className="h-4 w-4 text-gray-400" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password_confirmation && (
                                            <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                                        disabled={processing}
                                    >
                                        {processing ? "Memproses..." : "Daftar"}
                                    </Button>

                                    {/* Login Link */}
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">
                                            Sudah punya akun?{" "}
                                            <Link
                                                href={route("login")}
                                                className="text-blue-600 hover:text-blue-500 hover:underline font-medium"
                                            >
                                                Masuk di sini
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
