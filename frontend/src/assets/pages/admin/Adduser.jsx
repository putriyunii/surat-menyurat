import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const AddUser = () => {
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const token = localStorage.getItem('token')

    const handleSubmit = async (event) => {
        event.preventDefault();
        const fData = new FormData(event.target);

        // Ambil data dari FormData dan ubah ke object
        const data = {
            nama: fData.get("nama"),
            email: fData.get("email"),
            password: fData.get("password"),
        };

        // Validasi jika ada field kosong
        if (!data.nama || !data.email || !data.password) {
            Swal.fire({
                icon: "error",
                text: "Semua Harus Diisi!",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Set agar dikirim sebagai JSON
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data), // Konversi objek ke JSON
            });

            const result = await response.json(); // Ambil response dari server
            console.log(result); // Cek hasil response dari backend di console

            if (!response.ok) {
                Swal.fire({
                    icon: "error",
                    text: result.message || "Terjadi kesalahan saat menyimpan data",
                });
            } else {
                event.target.reset();
                Swal.fire({
                    icon: "success",
                    text: "Simpan berhasil",
                    timer: 1000,
                }).then(() => {
                    window.location.href = "/admin/users";
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                text: "Coba lagi nanti",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="d-flex">
                <div className="container p-3" style={{ flex: 1 }}>
                    <h2> Tambah User</h2>
                    <div className="card p-3">
                        <div className="card-header" style={{ backgroundColor: "white" }}>
                            <Link to="/admin/users" className="btn btn-primary float-start" style={{ marginLeft: "-20px", marginTop: "-10px" }}>
                                Lihat Data
                            </Link>
                        </div>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="form-group">
                                <label>Nama</label>
                                <input type="text" name="nama" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="text" name="email" className="form-control" required />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input type="text" name="password" className="form-control" required />
                            </div>
                            <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                                {loading ? "Menyimpan..." : "Submit"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddUser;
