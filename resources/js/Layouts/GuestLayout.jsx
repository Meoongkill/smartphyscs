import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center py-12 bg-gray-100">
            <div>
                <div className="flex flex-shrink-0 items-center">
                    <img
                        className="hidden h-24 w-auto lg:block"
                        src="/img/logo.png"
                        alt="Your Company"
                    />
                </div>
            </div>
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
