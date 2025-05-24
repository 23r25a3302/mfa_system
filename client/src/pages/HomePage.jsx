import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/sessionContext';
import { logoutUser } from '../service/authApi';

const HomePage = () => {
    const navigate = useNavigate();
    const { user, logout } = useSession();

    const handleLogout = async (data) => {
        try {
            const { data } = await logoutUser();
            logout(data);
            navigate("/login");
        } catch (error) {
            console.log("Err is : ", error.message);
        }
    }

    return (
        <div className='p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10'>
            <h2 className='text-xl font-semibold mb-4'>Welcome, {user.username}! </h2>
            <p>You have Successfully logged in and verified your MFA</p>
            <button type='button' className='mt-4 bg-red-500 text-black px-4 py-2 rounded'
                onClick={handleLogout}
            >
                Logout
            </button>
        </div>
    );
};

export default HomePage;