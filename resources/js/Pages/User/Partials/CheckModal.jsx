import { Inertia } from '@inertiajs/inertia';
import React from 'react';

export default function CheckModal({ isOpen, closeModal, message }) {

    if (!isOpen) {
        return null;
    }
    console.log(isOpen);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const enrollmentKey = formData.get('enrollment_key');
        Inertia.post('/check-enrollment-key/', {enrollmentKey})
        console.log(enrollmentKey);
    }

    return (
        <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "1000" }}>
            <div style={{  backgroundColor: "#fff", width: "500px", padding: "25px", borderRadius: "8px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", textAlign: "center" }}>
                <div className="flex flex-row">
                    <div className="basis-2/3">
                        <p className='text-[14px] text-right mb-5 pt-2 font-bold'>
                            {message}
                        </p>
                    </div>
                    <div className="basis-1/3">
                        <p className='text-[20px] text-right mb-5 cursor-pointer' onClick={closeModal}>
                            X
                        </p>
                    </div>
                </div>
                <form action="" method="post" onSubmit={handleSubmit}>
                    <input className='w-full text-[16px] text-center mb-3 m-1 py-2 px-4 border-0 rounded-lg bg-gray-200' name='enrollment_key' placeholder='Enrollment Key' />
                    <button type='submit' className='w-full text-[14px] font-bold m-1 py-2 px-4 border-0 rounded-lg bg-blue-700 text-white'>
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};
