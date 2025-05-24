import React, { useEffect, useState } from 'react';
import { setup2FA } from '../service/authApi';

const TwoFASetup = ({ onSetupComplete }) => {
    const [response, setResponse] = useState({});
    const [message, setMessage] = useState("");

    const fetchQRCode = async () => {
        try {
            const { data } = await setup2FA();
            setResponse(data);
            console.log(data);
        } catch (error) {
            console.log("2FA setup failed", error);
            setMessage("Failed to load 2FA setup. Try again.");
        }
    }

    useEffect(() => {
        fetchQRCode();
    }, []);

    const copyClickBoard = async () => {
        await navigator.clipboard.writeText(response.secret);
        setMessage("Secret copied to clipboard");
    }

    return (
        <div className='bg-white rounded-lg shadow-md w-full max-w-sm mx-auto'>
            <div className='pt-6'>
                <h2 className='text-3xl text-center font-extralight'>
                    Turn on 2FA Verification
                </h2>
            </div>
            <hr className='text-gray-200 mt-6 mb-6' />
            <p className='text-center text-gray-600 text-lg font-light'>
                Scan the QR code below with your authenticator app
            </p>
            <div className='p-6'>
                <div className='flex justify-center'>
                    {response.qrCode ? 
                        <img src={response.qrCode} alt="2FA QR Code" className='mb-4 border rounded-md' />
                    : ("")}
                </div>
                <div className='flex items-center mt-3 mb-3'>
                    <div className='border-t border-1 border-gray-200 flex-grow'></div>
                    <div className='text-gray-600 text-sm font-light pr-6 pl-6'>
                        QR enter the code manually
                    </div>
                    <div className='border-t border-1 border-gray-200 flex-grow'></div>
                </div>

                <div className='mb-6'>
                    {message && <p className='text-green-500 text-sm mb-3'>{message}</p> }
                    <input 
                        readOnly 
                        defaultValue={response.secret} 
                        value={response.secret}
                        className='w-full border rounded mt-2 text-xs text-gray-600 p-4' 
                        onClick={copyClickBoard}
                    />
                </div>

                <button onClick={onSetupComplete} className='w-full bg-blue-500 text-black py-2 rounded-md'>
                    Continue to Verification
                </button>
            </div>
        </div>
    );
};

export default TwoFASetup;