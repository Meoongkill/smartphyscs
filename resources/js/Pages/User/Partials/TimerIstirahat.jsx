import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';

const TimerIstirahat = ({ handleSubmit, duration, activeButton }) => {
    const [startTime] = useState(() => new Date());
    // const currentTime = new Date();
    const expiryTimestamp = new Date(startTime.getTime() + duration * 1000);
    const {
        seconds,
        minutes,
    } = useTimer({
        expiryTimestamp,
        onExpire: handleSubmit
    });

    const [time, setTime] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(time => time + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // useEffect(() => {
    //     sessionStorage.setItem('elapsedTime', time);
    // }, [time]);


    return (
        <div className='font-semibold text-black text-xl'>
            {activeButton !== "studi_kasus" &&
                <div className='flex flex-row'>
                    <p>
                        Sisa Waktu Istirahat&nbsp;
                    </p>
                    <p>
                        {minutes} : {seconds}
                    </p>
                </div>
            }
        </div>
    )
}
export default TimerIstirahat;
