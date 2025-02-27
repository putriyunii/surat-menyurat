import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Sidebar.css";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation(); // Ambil path saat ini

    return (
        <aside className="main-sidebar bg-dark text-white vh-100 p-3">
            {/* User Panel */}
            <div className="user-panel d-flex flex-column align-items-center text-center mb-4">
                <img
                    src="/dist/image/swk.png"
                    alt="User Profile"
                    className="rounded-circle mb-0 shadow"
                    style={{ width: "150px", height: "150px" }}
                />
                <div className="info mt-n2">
                    <a href="#" className="text-white fw-bold fs-5">SWK</a>
                </div>
            </div>

            {/* Sidebar Menu */}
            <ul className="nav flex-column">
                <li className="nav-item">
                    <NavLink
                        to="/admin/dashboard"
                        className={`nav-link ${location.pathname.includes('/admin/dashboard') ? 'active bg-primary text-white' : 'text-white'}`}
                    >
                        <i className="fas fa-tachometer-alt me-2"></i> Dashboard
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/admin/users"
                        className={`nav-link ${location.pathname.includes('/admin/users') ? 'active bg-primary text-white' : 'text-white'}`}
                    >
                        <i className="fas fa-user-alt me-2"></i> User
                    </NavLink>
                </li>

                <li className="nav-item">
                    <a href="#" className="nav-link text-white d-flex justify-content-between align-items-center" onClick={() => setIsOpen(!isOpen)}>
                        <span><i className="fas fa-envelope me-2"></i> Surat</span>
                        <i className={`fas fa-chevron-${isOpen ? "down" : "right"}`}></i>
                    </a>
                    <ul className={`nav flex-column ms-3 submenu ${isOpen ? "open" : ""}`}>
                        <li className="nav-item">
                            <NavLink
                                to="/admin/suratmasuk"
                                className={`nav-link ${location.pathname.includes('/admin/suratmasuk') ? 'active bg-primary text-white' : 'text-white'}`}
                            >
                                <i className="fas fa-inbox me-2"></i> Surat Masuk
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/admin/suratkeluar"
                                className={`nav-link ${location.pathname.includes('/admin/suratkeluar') ? 'active bg-primary text-white' : 'text-white'}`}
                            >
                                <i className="fas fa-paper-plane me-2"></i> Surat Keluar
                            </NavLink>
                        </li>
                    </ul>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/admin/transaksi"
                        className={`nav-link ${location.pathname.includes('/admin/transaksi') ? 'active bg-primary text-white' : 'text-white'}`}
                    >
                        <i className="far fa-money-bill-alt me-2"></i> Transaksi
                    </NavLink>
                </li>
            </ul>
        </aside>
    );
}

export default Sidebar;
