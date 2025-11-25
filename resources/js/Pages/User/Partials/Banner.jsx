import React from 'react';
import Lottie from "lottie-react";
import Error from "@/Assets/Error.json";

const Banner = ({ title, subtitle, btnContent, urlBtn }) => {
    return (
        <div className="m-10">
            <div className='bg-white rounded m-10 p-[5%] m-auto' style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}>
                <div className="flex flex-wrap">
                    <div className="flex basis-full lg:basis-2/5 md:basis-2/5 items-center justify-center">
                        <Lottie
                            animationData={Error}
                            loop={true}
                            className="h-96 w-auto"
                        />
                    </div>
                    <div className="flex-1 m-auto basis-full lg:basis-3/5 md:basis-3/5 text-center md:text-justify">
                    <p className='pt-2 text-2xl font-bold text-[#115CD1]'>Mohon maaf, {title} </p>
                        <p className='text-xl md:text-xl mt-4'>
                            {subtitle}
                        </p>
                        <a href={urlBtn} className='text-center mb-0'>
                            <button className='rounded font-bold text-base mt-5 px-5 py-2 bg-[#115CD1] text-white'>
                                {btnContent}
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
