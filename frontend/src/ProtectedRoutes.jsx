import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from "react";
import { UserContext } from './context/userContext';

function ProtectedRoute() {
    const { user, isLoading } = useContext(UserContext);

    // Wait until user check is done
    if (isLoading) {
        return <div>Loading...</div>; // Or a spinner
    }

    // Redirect if user is NOT logged in
    return user ? <Outlet /> : <Navigate to='/LogIn' />;
}

export default ProtectedRoute;