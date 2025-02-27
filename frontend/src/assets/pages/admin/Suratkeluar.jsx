import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';

const Suratkeluar = () => {
    const [dataSuratkeluar, setSuratkeluar] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // State pencarian
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const token = localStorage.getItem('token');

    const tampilData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/suratkeluar', {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            if (!response.ok) {
                throw new Error("Gagal mengambil data");
            }
    
            const data = await response.json();
            setSuratkeluar(Array.isArray(data) ? data.filter(item => item !== null) : []); // Pastikan array dan tidak ada null
        } catch (error) {
            console.error("Error fetching data:", error);
            setSuratkeluar([]); // Pastikan tetap array kosong jika gagal
        }
    };
    

    useEffect(() => {
        tampilData();
    }, []);

    const previewFile = (file) => {
            Swal.fire({
                imageUrl: `http://localhost:3000/files/${file}`,
                imageAlt: "Preview File",
                showCloseButton: true,
                showConfirmButton: false,
                width: "80%",
            });
        };

    const handleDelete = (id) => {
        Swal.fire({
            icon: "warning",
            title: "Yakin akan dihapus?",
            showCancelButton: true,
            confirmButtonText: "Yakin",
            cancelButtonText: "Batal"
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:3000/api/suratkeluar/${id}`, {
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
                    tampilData(); // Refresh data setelah menghapus
                })
                .catch(error => {
                    Swal.fire("Error", error.message || "Gagal menghapus data!", "error");
                });
            }
        });
    };

    // Filter data hanya berdasarkan Nomor Surat
    const filteredSurat = dataSuratkeluar
    .filter(item => item && item.nomor_surat) // Pastikan item tidak null dan memiliki nomor_surat
    .filter(item => item.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase()));


    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSurat.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSurat.length / itemsPerPage);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col">
                            <h1 className="m-0">Data Surat Keluar</h1>
                        </div>
                        <div className="col">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/dashboard">Home</a></li>
                                <li className="breadcrumb-item active">Input Data</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
            <section className="content">
                <div className="container">
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <Link to="/admin/addsuratkeluar" className="btn btn-primary">Tambah Data</Link>
                        </div>
                        <div className="col-md-6 d-flex justify-content-end">
                            <div className="col-md-6">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Cari berdasarkan Nomor Surat..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="row">
                        <div className="col">
                            <table className="table table-bordered table-striped mt-2">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nomor Surat</th>
                                        <th>Tanggal Surat</th>
                                        <th>Tujuan</th>
                                        <th>Pengirim</th>
                                        <th>Perihal</th>
                                        <th>File</th>
                                        <th>Hapus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item, index) => (
                                            <tr key={index}>
                                                <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{item.nomor_surat}</td>
                                                <td>{item.tanggal_surat}</td>
                                                <td>{item.tujuan}</td>
                                                <td>{item.pengirim}</td>
                                                <td>{item.perihal}</td>
                                                <td>
                                                    {item.file ? (
                                                        <img
                                                            src={`http://localhost:3000/files/${item.file}`}
                                                            alt="Surat Masuk"
                                                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px", cursor: "pointer" }}
                                                            onClick={() => previewFile(item.file)}
                                                        />
                                                    ) : (
                                                        "Tidak Ada"
                                                    )}
                                                </td>
                                                <td>
                                                    <button onClick={() => handleDelete(item.id)} className="btn btn-danger">Hapus</button>
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
                                    disabled={currentPage === totalPages || totalPages === 0}
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

export default Suratkeluar;
