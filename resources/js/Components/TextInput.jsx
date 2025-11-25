import { forwardRef, useEffect, useRef, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default forwardRef(function TextInput(
    { type = "text", className = "", isFocused = false, ...props },
    ref
) {
    const input = ref ? ref : useRef();
    const [showPassword, setShowPassword] = useState(false); //

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className="w-full relative mt-5">
            <input
                {...props}
                type={showPassword && type === "password" ? "text" : type}
                className={
                    "w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm " +
                    className
                }
                ref={input}
            />
            {type === "password" && (
                <span
                    className="absolute right-4 top-2.5 cursor-pointer"
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? (
                        <EyeSlashIcon className="w-6 h-6 text-gray-500" />
                    ) : (
                        <EyeIcon className="w-6 h-6 text-gray-500" />
                    )}
                </span>
            )}
        </div>
    );
});
