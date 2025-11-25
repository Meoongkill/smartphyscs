import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Progress } from "@/Components/ui/progress";
import {
    ClockIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

const Timer = ({ onSubmit, totalQuestions, answers, duration }) => {
    const [startTime] = useState(() => new Date());
    let expiryTimestamp = new Date(startTime.getTime() + duration * 1000);
    let answeredQuestions = 0;

    if (answers) {
        const answeredIds = Array.from(answers).filter(([key, value]) => value !== "");
        answeredQuestions = answeredIds.length;
    }

    const progress = (answeredQuestions / totalQuestions) * 100;

    const {
        seconds,
        minutes,
        hours,
    } = useTimer({
        expiryTimestamp,
        onExpire: onSubmit
    });

    const [time, setTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(time => time + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Calculate remaining time percentage for color coding
    const totalDuration = duration;
    const remainingTime = hours * 3600 + minutes * 60 + seconds;
    const timeProgress = ((totalDuration - remainingTime) / totalDuration) * 100;

    // Determine timer color based on remaining time
    const getTimerColor = () => {
        if (timeProgress > 80) return "text-red-600";
        if (timeProgress > 60) return "text-yellow-600";
        return "text-green-600";
    };

    const getTimerBgColor = () => {
        if (timeProgress > 80) return "bg-red-50 border-red-200";
        if (timeProgress > 60) return "bg-yellow-50 border-yellow-200";
        return "bg-green-50 border-green-200";
    };

    const formatTime = (value) => value.toString().padStart(2, '0');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Progress Section */}
            <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Progress Jawaban</span>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 font-semibold">
                            {answeredQuestions}/{totalQuestions}
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <Progress
                            value={progress}
                            className="h-3 bg-blue-100"
                        />
                        <div className="flex justify-between text-xs text-gray-600">
                            <span>0%</span>
                            <span className="font-medium text-blue-600">
                                {Math.round(progress)}% selesai
                            </span>
                            <span>100%</span>
                        </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                        {totalQuestions - answeredQuestions > 0 && (
                            <span className="flex items-center">
                                <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                                {totalQuestions - answeredQuestions} soal belum dijawab
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Timer Section */}
            <Card className={`border-0 shadow-md ${getTimerBgColor()}`}>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <ClockIcon className={`w-5 h-5 ${getTimerColor()}`} />
                            <span className="text-sm font-medium text-gray-700">Sisa Waktu</span>
                        </div>
                        {timeProgress > 80 && (
                            <Badge variant="destructive" className="animate-pulse">
                                Hampir Habis!
                            </Badge>
                        )}
                    </div>

                    <div className={`text-2xl font-bold font-mono ${getTimerColor()} text-center`}>
                        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
                    </div>

                    <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-1000 ${
                                    timeProgress > 80 ? 'bg-red-500' :
                                    timeProgress > 60 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${100 - (remainingTime / totalDuration) * 100}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Mulai</span>
                            <span className={`font-medium ${getTimerColor()}`}>
                                {Math.round((remainingTime / totalDuration) * 100)}% tersisa
                            </span>
                            <span>Selesai</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Timer;
