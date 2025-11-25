import { useEffect, useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
        role: "user",
    });

    const [showPassword, setShowPassword] = useState(false);

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
            <Head title="Log in" />
            
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
                                Asisten Penilaian Asesmen Psikologi Berbasis Artificial Intelligence
                            </p>
                        </div>
                        <div 
                            className="w-full h-96 bg-no-repeat bg-contain bg-center"
                            style={{
                                backgroundImage: "url('/img/hero.svg')",
                            }}
                        />
                    </div>

                    {/* Right side - Login Form */}
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
                                    Masuk ke Akun Anda
                                </CardTitle>
                                <CardDescription className="text-blue-600">
                                    Silakan masukkan kredensial Anda untuk melanjutkan
                                </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                                {status && (
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                        <p className="text-sm text-green-700">{status}</p>
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-4">
                                    {/* Role Selection */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-gray-700">
                                            Masuk Sebagai
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
                                                autoComplete="current-password"
                                                placeholder="Masukkan password Anda"
                                                onChange={(e) => setData("password", e.target.value)}
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

                                    {/* Remember Me */}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            id="remember"
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData("remember", e.target.checked)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer">
                                            Ingat saya
                                        </Label>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                                        disabled={processing}
                                    >
                                        {processing ? "Memproses..." : "Masuk"}
                                    </Button>

                                    {/* Forgot Password Link */}
                                    {canResetPassword && (
                                        <div className="text-center">
                                            <Link
                                                href={route("password.request")}
                                                className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
                                            >
                                                Lupa password?
                                            </Link>
                                        </div>
                                    )}
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
