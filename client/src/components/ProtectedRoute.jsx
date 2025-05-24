import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../context/sessionContext';

const ProtectedRoute = () => {
    const {isLoggedIn, loading} = useSession();
    console.log("The logged-In user is : ", isLoggedIn);
    if(loading) {
        return <div>Loading...</div>
    }
    return isLoggedIn ? <Outlet/> : <Navigate to="/login" />;
};

export default ProtectedRoute;