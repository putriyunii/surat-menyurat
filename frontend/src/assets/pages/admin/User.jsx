    import React, { useEffect, useState } from "react";
    import Swal from "sweetalert2";
    import { Link } from "react-router-dom";

    const User = () => {
        const [dataUsers, setUsers] = useState([]);
        const [searchTerm, setSearchTerm] = useState("");
        const token = localStorage.getItem("token");
        const loggedInUserId = parseInt(localStorage.getItem("userId"), 10); // Pastikan angka

        // Fetch data dari API
        const tampilData = async () => {
            const response = await fetch("http://localhost:3000/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setUsers(data);
        };

        useEffect(() => {
            tampilData();
        }, []);

        // Handle delete user
        const handleDelete = (id) => {
            if (parseInt(id, 10) === loggedInUserId) {
                Swal.fire("Error", "Anda tidak bisa menghapus akun sendiri!", "error");
                return;
            }

            Swal.fire({
                icon: "warning",
                title: "Yakin akan dihapus?",
                showCancelButton: true,
                confirmButtonText: "Yakin",
                cancelButtonText: "Batal",
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`http://localhost:3000/api/users/${id}`, {
                        method: "DELETE",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Gagal menghapus data");
                            }
                            return response.json();
                        })
                        .then(() => {
                            Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
                            tampilData();
                        })
                        .catch((error) => {
                            Swal.fire("Error", error.message || "Gagal menghapus data!", "error");
                        });
                }
            });
        };

        // Filter data berdasarkan input pencarian
        const filteredUsers = dataUsers.filter((user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <>
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col">
                                <h1 className="m-0">Data User</h1>
                            </div>
                            <div className="col">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item">
                                        <a href="/admin/dashboard">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active">Input Data</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row mb-3">
                        <div className="col-md-12 d-flex justify-content-between align-items-center">
                            <Link to="/admin/addusers" className="btn btn-primary">
                                Tambah Data
                            </Link>
                            <input
                                type="text"
                                className="form-control w-25"
                                placeholder="Cari berdasarkan email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <section className="content">
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Nama</th>
                                            <th>Email</th>
                                            <th>Edit</th>
                                            <th>Hapus</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.nama}</td>
                                                    <td>{item.email}</td>
                                                    <td>
                                                        <Link
                                                            to={`/admin/editusers/${item.id}`}
                                                            className="btn btn-primary"
                                                        >
                                                            Edit
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="btn btn-danger"
                                                            disabled={parseInt(item.id, 10) === loggedInUserId}
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">
                                                    Data tidak ditemukan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        );
    };

    export default User;
