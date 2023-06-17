// ProtectedRoutes.js
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "./context/Users/User";

const ProtectedRoutes = ({ children }) => {
    const accessToken = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    // const { setUser } = useContext(UserContext);
    // setUser(user);

    const location = useLocation();

    if (!accessToken) {
        return (
            <Navigate
                to={{
                    pathname: "/SignIn",
                    // state: { from: location },
                }}
            />
        );
    }

    return children;
};

export default ProtectedRoutes;
