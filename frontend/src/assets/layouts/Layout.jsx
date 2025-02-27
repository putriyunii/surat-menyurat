import React, {useEffect} from "react";
import {Outlet, useLocation} from "react-router-dom"
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import Preload from "../components/Preload";

const Layout= () => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/login") {
          document.body.classList.add("loginPage");
        } else {
          document.body.classList.remove("loginPage");
        }
      }, [location]);

    return (
        <>
        <div className="wrapper">
        <Preload/>
        <Header/>
        <Sidebar/>
        <div className="content-wrapper">
        {<Outlet/>}
        </div>
        <Footer/>
        </div>
        </>
    )
} 

export default Layout; 