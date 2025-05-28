import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/" replace />;
    }

    // If allowedRoles is empty, allow all authenticated users
    if (allowedRoles.length === 0) {
        return children;
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(user?.Role)) {
        return <Navigate to="/access-denied" replace />;
    }

    return children;
};

export default ProtectedRoute; 