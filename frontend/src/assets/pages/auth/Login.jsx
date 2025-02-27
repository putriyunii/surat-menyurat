import React from 'react';
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const fData = {};
        for (let elm of event.target.elements) {
            if (elm.type === 'email' || elm.type === 'password') {
                fData[elm.name] = elm.value;
            }
        }

        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(fData),
            });

            const data = await response.json();

            if (data.token) {
                localStorage.setItem('token', data.token);
                event.target.reset();
                window.location.href = '/admin/dashboard';
            } else {
                event.target.reset();
                Swal.fire({
                    icon: "warning",
                    text: "User tidak ditemukan",
                    timer: 1000
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: "error",
                text: "Terjadi kesalahan saat login. Coba lagi nanti.",
            });
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100"
        style={{ background: 'linear-gradient(180deg,rgb(0, 107, 9),rgb(13, 87, 22))', width: '100vw', height: '100vh' }}>
        
        <div className="card shadow-lg p-4 rounded" style={{ width: "400px", background: "#fff" }}>
            <div className="text-center mb-3">
                <img src="/dist/image/swk.png" alt="SWK Logo" 
                    className="img-fluid" style={{ width: '120px', height: 'auto' }} />
            </div>

            <h4 className="text-center">E-Book SWK</h4>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Username</label>
                    <input type="email" name="email" className="form-control" placeholder="Masukkan username" required />
                </div>

                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" name="password" className="form-control" placeholder="Masukkan password" required />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    <i className="bi bi-box-arrow-in-right"></i> Sign in
                </button>
            </form>
        </div>
    </div>
    );
};

export default Login;
