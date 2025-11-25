import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';

const SimpleTimer = ({ expiryTimestamp, onSubmit }) => {
    const {
        seconds,
        minutes,
        hours,
    } = useTimer({
        expiryTimestamp,
        onExpire: onSubmit
    });

    const formatTime = (value) => value.toString().padStart(2, '0');

    // Calculate remaining time percentage for color coding
    const now = new Date();
    const totalDuration = (expiryTimestamp - now) / 1000;
    const remainingTime = hours * 3600 + minutes * 60 + seconds;
    const timeProgress = totalDuration > 0 ? ((totalDuration - remainingTime) / totalDuration) * 100 : 100;

    // Determine timer color based on remaining time
    const getTimerColor = () => {
        if (timeProgress > 80) return "text-red-500";
        if (timeProgress > 60) return "text-yellow-500";
        return "text-green-500";
    };

    return (
        <div className={`text-sm font-mono font-medium ${getTimerColor()}`}>
            {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
        </div>
    );
};

export default SimpleTimer;