import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Link } from 'react-router-dom';

const Suratmasuk = () => {
    const [dataSurat, setSuratmasuk] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // State pencarian
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Jumlah data per halaman

    const token = localStorage.getItem('token');

    const tampilData = async () => {
        const response = await fetch('http://localhost:3000/api/suratmasuk', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setSuratmasuk(data);
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

    const formatTanggal = (tanggal) => {
        const date = new Date(tanggal);
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Filter data berdasarkan nomor surat
    const filteredData = dataSurat.filter(item =>
        item.nomor_surat.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Hitung total halaman
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    
    // Ambil data sesuai halaman
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col">
                            <h1 className="m-0">Data Surat Masuk</h1>
                        </div>
                        <div className="col text-end">
                            <input
                                type="text"
                                className="form-control w-50 d-inline"
                                placeholder="Cari Nomor Surat..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <section className="content">
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <table className="table table-bordered table-striped mt-2">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Nomor Surat</th>
                                        <th>Tanggal Surat</th>
                                        <th>Tanggal Terima</th>
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
                                                <td>{formatTanggal(item.tanggal_surat)}</td>
                                                <td>{formatTanggal(item.tanggal_terima)}</td>
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
                                                    <button className="btn btn-danger">Hapus</button>
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <nav>
                                    <ul className="pagination justify-content-center">
                                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                                        </li>
                                        {[...Array(totalPages).keys()].map((page) => (
                                            <li key={page} className={`page-item ${currentPage === page + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(page + 1)}>{page + 1}</button>
                                            </li>
                                        ))}
                                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                                        </li>
                                    </ul>
                                </nav>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Suratmasuk;
