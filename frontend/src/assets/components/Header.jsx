import React from 'react';

const Header = () => {
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
            {/* Left navbar links */}
            <ul className="navbar-nav">
                <li className="nav-item">
                    <a className="nav-link" data-widget="pushmenu" href="#" role="button">
                        <i className="fas fa-bars" />
                    </a>
                </li>

                <div style={{ textAlign: "center", width: "100%", marginTop: "5px" }}>
    <h3 style={{ display: "inline-block" }}><strong>SAKA WIRA KARTIKA 0802/PONOROGO</strong></h3>
</div>

            </ul>

            {/* Right navbar links */}
            <ul className="navbar-nav ms-auto">
                <li className="nav-item me-3"> {/* Tambahkan margin kanan */}
                    <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Header;
