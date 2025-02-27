import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Link, useParams, useNavigate } from "react-router-dom";

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        password: ""
    });
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData({ nama: data.nama, email: data.email, password: "" });
                } else {
                    Swal.fire({
                        icon: "error",
                        text: "Gagal mengambil data"
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    text: "Terjadi kesalahan"
                });
            }
        };
        fetchData();
    }, [id, token]);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:3000/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (!response.ok) {
                Swal.fire({
                    icon: "error",
                    text: result.message || "Terjadi kesalahan saat memperbarui data"
                });
            } else {
                Swal.fire({
                    icon: "success",
                    text: "Update berhasil",
                    timer: 1000
                }).then(() => {
                    navigate("/admin/users");
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                text: "Coba lagi nanti"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex">
            <div className="container p-4" style={{ flex: 1 }}>
                <h2>Edit User</h2>
                <div className="card p-2">
                    <div className="card-header">
                        <Link to="/admin/users" className="btn btn-primary float-start" style={{ marginLeft: "-20px", marginTop: "-5px" }}>Lihat Data</Link>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nama</label>
                            <input type="text" name="nama" className="form-control" value={formData.nama} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="text" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Password (Opsional)</label>
                            <input type="password" name="password" className="form-control" placeholder="Kosongkan jika tidak ingin mengubah" onChange={handleChange} />
                        </div>
                        <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                            {loading ? "Menyimpan..." : "Update"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
