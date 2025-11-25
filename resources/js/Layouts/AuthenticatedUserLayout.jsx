import { useState } from "react";
import {
    Bars3Icon,
    BellIcon,
    XMarkIcon,
    ArrowLeftOnRectangleIcon,
    UserCircleIcon,
    UserIcon,
    AtSymbolIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/Components/ui/sheet";


function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function AuthenticatedUser({ user, header, children, pages }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    const navigation = [
        { name: "Sesi Soal", href: "/admin-dashboard", current: false },
        { name: "Bank Soal", href: "/bank-soal", current: false },
        { name: "Paket Soal", href: "/test-collection", current: false },
        { name: "Manajemen User", href: "/admin/users", current: false },
        { name: "Manajemen Psikolog", href: "/admin/psikolog", current: false },
    ];
    let roles;
    if (user && user.roles && user.roles.length > 0) {
        roles = user.roles[0].name;
    } else {
        roles = "not admin";
    }

    return (
        <>
            <div className="min-h-full">
                <nav className="border-b border-gray-200 bg-white shadow top-0 sticky z-50">
                    <div className="mx-auto w-11/12 px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 justify-between">
                                    <div className="flex">
                                        <div className="flex flex-shrink-0 items-center">
                                            <Link href="/dashboard">
                                                <img
                                                    className="block h-10 w-auto lg:hidden"
                                                    src="/img/logo.png"
                                                    alt="Your Company"
                                                />
                                            </Link>
                                            <Link href="/dashboard">
                                                <img
                                                    className="hidden h-10 w-auto lg:block"
                                                    src="/img/logo.png"
                                                    alt="Your Company"
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="hidden sm:ml-6 sm:flex sm:items-center gap-5">
                                        {roles == "admin" ? (
                                            <>
                                                <Link href="/bank-soal">
                                                    <Button variant="outline" className="text-sm font-semibold text-gray-900">
                                                        Bank Soal
                                                    </Button>
                                                </Link>

                                                <Link href="/test-collection">
                                                    <Button variant="outline" className="text-sm font-semibold text-gray-900">
                                                        Paket Soal
                                                    </Button>
                                                </Link>

                                                <Link href="/admin-dashboard">
                                                    <Button variant="outline" className="text-sm font-semibold text-gray-900">
                                                        Sesi Soal
                                                    </Button>
                                                </Link>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="text-sm font-semibold text-gray-900">
                                                            Manajemen Pengguna
                                                            <ChevronDownIcon
                                                                className="-mr-1 h-5 w-5 text-gray-400 ml-1"
                                                                aria-hidden="true"
                                                            />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-56" align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href="/admin/users">
                                                                Manajemen User
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href="/admin/psikolog">
                                                                Manajemen Psikolog
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="text-sm font-semibold text-gray-900">
                                                            Admin
                                                            <ChevronDownIcon
                                                                className="-mr-1 h-5 w-5 text-gray-400 ml-1"
                                                                aria-hidden="true"
                                                            />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-56" align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={route("logout")}
                                                                method="post"
                                                            >
                                                                Logout
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </>
                                        ) : roles === "psikolog" ? (
                                            <>
                                                <Link href="/dashboard">
                                                    <Button variant="outline" className="text-sm font-semibold text-gray-900">
                                                        Dashboard
                                                    </Button>
                                                </Link>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="text-sm font-semibold text-gray-900">
                                                            {user.name}
                                                            <ChevronDownIcon
                                                                className="-mr-1 h-5 w-5 text-gray-400 ml-1"
                                                                aria-hidden="true"
                                                            />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-56" align="end">
                                                        {roles !== "admin" && (
                                                            <DropdownMenuItem asChild>
                                                                <Link href="/profile" className="flex items-center">
                                                                    <UserCircleIcon className="h-4 w-4 mr-2" />
                                                                    Profil
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={route("logout")}
                                                                method="post"
                                                                className="flex items-center"
                                                            >
                                                                <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                                                                Logout
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </>
                                        ) : (
                                            <>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="outline" className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                                            {user.name}
                                                            <ChevronDownIcon
                                                                className="-mr-1 h-5 w-5 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent className="w-56">
                                                        {roles !== "admin" && (
                                                            <DropdownMenuItem asChild>
                                                                <Link
                                                                    href="/profile"
                                                                    className="flex flex-row border-transparent text-gray-900 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                                                >
                                                                    <span className="pe-2">
                                                                        <UserCircleIcon className="h-6" />
                                                                    </span>
                                                                    Profil
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={route("logout")}
                                                                method="post"
                                                                className="flex flex-row border-transparent text-gray-900 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                                            >
                                                                <span className="pe-2">
                                                                    <ArrowLeftOnRectangleIcon className="h-6" />
                                                                </span>
                                                                Logout
                                                            </Link>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </>
                                        )}
                                    </div>

                                    {/* Mobile menu button */}
                                    <div className="-mr-2 flex items-center sm:hidden">
                                        <Sheet>
                                            <SheetTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <Bars3Icon className="h-6 w-6" />
                                                    <span className="sr-only">Open main menu</span>
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent side="right">
                                                <div className="space-y-1 pt-2 pb-3">
                                                    {roles === "admin" &&
                                                        navigation.map((item) => (
                                                            <Link
                                                                key={item.name}
                                                                href={item.href}
                                                                className={classNames(
                                                                    item.current
                                                                        ? "bg-blue-50 border-blue-500 text-blue-700"
                                                                        : "border-transparent text-gray-900 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900",
                                                                    "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                                                )}
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        ))}
                                                    <p
                                                        disabled
                                                        className={classNames(
                                                            "flex flex-row border-transparent text-gray-900 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900",
                                                            "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                                        )}
                                                    >
                                                        <span className="pe-2">
                                                            <AtSymbolIcon className="h-6" />
                                                        </span>{" "}
                                                        {user.name}
                                                    </p>
                                                    {roles !== "admin" && (
                                                        <Link
                                                            href="/profile"
                                                            className={classNames(
                                                                "flex flex-row border-transparent text-gray-900 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900",
                                                                "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                                            )}
                                                        >
                                                            <span className="pe-2">
                                                                <UserCircleIcon className="h-6" />
                                                            </span>{" "}
                                                            Profil
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href={route("logout")}
                                                        method="post"
                                                        className={classNames(
                                                            "flex flex-row border-transparent text-gray-900 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900",
                                                            "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                                        )}
                                                    >
                                                        <span className="pe-2">
                                                            <ArrowLeftOnRectangleIcon className="h-6" />
                                                        </span>{" "}
                                                        Logout
                                                    </Link>
                                                </div>
                                            </SheetContent>
                                        </Sheet>
                                    </div>
                                </div>
                            </div>
                </nav>
                <div>
                    {header && (
                        <header className="bg-white">
                            <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-6">
                                {header}
                            </div>
                        </header>
                    )}
                    <main>
                        <div className="">
                            <div>{children}</div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
