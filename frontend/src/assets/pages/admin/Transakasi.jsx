import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';

const Transaksi = () => {
    const [dataTransaksi, setTransaksi] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Jumlah transaksi per halaman

    const token = localStorage.getItem('token');

    const tampilData = async () => {
        const response = await fetch('http://localhost:3000/api/transaksi', {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const data = await response.json();
        setTransaksi(data);
    };

    useEffect(() => {
        tampilData();
    }, []);

    const handleDelete = (idTransaksi) => {
        Swal.fire({
            icon: "warning",
            title: "Yakin akan dihapus?",
            showCancelButton: true,
            confirmButtonText: "Yakin",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:3000/api/transaksi/${idTransaksi}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Gagal menghapus data");
                    }
                    return response.json();
                })
                .then(() => {
                    Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
                    tampilData(); // Refresh data tanpa reload
                })
                .catch(error => {
                    Swal.fire("Error", error.message || "Gagal menghapus data!", "error");
                });
            }
        });
    };

    // **Pagination Logic**
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = dataTransaksi.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(dataTransaksi.length / itemsPerPage);

    // **Handler untuk Pagination**
    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col">
                            <h1 className="m-0">Data Transaksi </h1>
                        </div>
                        <div className="col">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">Home</a></li>
                                <li className="breadcrumb-item active">Input Data</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Link to="/admin/AddTransaksi" className="btn btn-primary">Tambah Transaksi</Link>
                            <table className="table table-bordered table-striped mt-2">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Tanggal Transaksi</th>
                                        <th>Nama Transaksi</th>
                                        <th>Status</th>
                                        <th>Nominal</th>
                                        <th>Deskripsi</th>
                                        <th>Saldo</th>
                                        <th>Hapus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{item.tanggal}</td>
                                                <td>{item.nama}</td>
                                                <td>{item.status}</td>
                                                <td>{item.nominal}</td>
                                                <td>{item.deskripsi}</td>
                                                <td>{item.saldo}</td>                                                
                                                <td>
                                                    <button onClick={() => handleDelete(item.idTransaksi)} className="btn btn-danger">Hapus</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8">Data Kosong</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* **Pagination Controls** */}
                            <div className="d-flex justify-content-between">
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={prevPage} 
                                    disabled={currentPage === 1}
                                >
                                    &laquo; Prev
                                </button>
                                <span>Halaman {currentPage} dari {totalPages}</span>
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={nextPage} 
                                    disabled={currentPage === totalPages}
                                >
                                    Next &raquo;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Transaksi;
