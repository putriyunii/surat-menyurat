// import React from 'react'
import { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";  
import Preload from "../components/Preload";

const AuthLayout = () => {
    useEffect(() => {
        document.body.classList.add("login-page");

        return () => {
            document.body.classList.remove("login-page");
        };
    }, []);
    return (
        <>
            <Suspense fallback={<Preload/>}>{<Outlet/>}</Suspense>
        </>
    );
};

export default AuthLayout; 