import React from "react";
import { Button } from "@/Components/ui/button";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    CheckIcon,
    ArrowLeftIcon,
    ArrowRightIcon
} from "@heroicons/react/24/outline";

const BottomNav = ({
    questionIndex,
    length,
    onNext,
    onPrev,
    onQuestionChange,
    openModal
}) => {
    const isSmallScreen = window.innerWidth <= 600;

    return (
        <div className="w-full bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-4xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Previous Button */}
                    <div className="flex-1">
                        {questionIndex !== 0 && (
                            <Button
                                onClick={onPrev}
                                variant="outline"
                                size={isSmallScreen ? "sm" : "default"}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                            >
                                {isSmallScreen ? (
                                    <ChevronLeftIcon className="w-4 h-4" />
                                ) : (
                                    <>
                                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                                        Sebelumnya
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex-1 flex justify-center">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span className="font-medium text-blue-600">
                                {questionIndex + 1}
                            </span>
                            <span>dari</span>
                            <span className="font-medium">
                                {length}
                            </span>
                            <span>soal</span>
                        </div>
                    </div>

                    {/* Next/Submit Button */}
                    <div className="flex-1 flex justify-end">
                        {questionIndex !== (length - 1) ? (
                            <Button
                                onClick={onNext}
                                size={isSmallScreen ? "sm" : "default"}
                                className="bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                {isSmallScreen ? (
                                    <ChevronRightIcon className="w-4 h-4" />
                                ) : (
                                    <>
                                        Selanjutnya
                                        <ArrowRightIcon className="w-4 h-4 ml-2" />
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => {
                                    // onQuestionChange();
                                    openModal();
                                }}
                                size={isSmallScreen ? "sm" : "default"}
                                className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                            >
                                <CheckIcon className="w-4 h-4 mr-2" />
                                {isSmallScreen ? "Submit" : "Selesai & Submit"}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                            style={{
                                width: `${((questionIndex + 1) / length) * 100}%`
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Mulai</span>
                        <span>{Math.round(((questionIndex + 1) / length) * 100)}% selesai</span>
                        <span>Selesai</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BottomNav;
