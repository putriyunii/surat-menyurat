import React, { useState } from "react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const AddTransaksi = () => {
    const [loading, setLoading] = useState(false)
    const token = localStorage.getItem('token')

    const handleSubmit = async (event) => {
        event.preventDefault()
        const fData = {}
        const frmel = event.target

        for (let el of frmel.elements) {
            if (el.name) {
                fData[el.name] = el.value;
            }
        }

        if (!fData.status || (fData.status !== "pemasukan" && fData.status !== "pengeluaran")) {
            Swal.fire({
                icon: "error",
                text: "Status harus dipilih!",
            });
            return;
        }

        // Validate other fields
        if (!fData.nama || !fData.nominal || !fData.deskripsi) {
            Swal.fire({
                icon: "error",
                text: "Semua kolom harus diisi!",
            });
            return;
        }

        fData.nominal = parseFloat(fData.nominal);
        if (isNaN(fData.nominal) || fData.nominal <= 0) {
            Swal.fire({
                icon: "error",
                text: "Nominal harus berupa angka!",
            });
            return;
        }
        setLoading(true)

        try {
            const response = await fetch('http://localhost:3000/api/transaksi', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(fData),
            })
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error dari backend:", errorData);
                Swal.fire({
                    icon: "error",
                    text: "Terjadi kesalahan saat menyimpan data",
                });
            } else {
                event.target.reset();
                Swal.fire({
                    icon: "success",
                    text: "Simpan Berhasil",
                    timer: 1000
                }).then(() => {
                    window.location.href = '/admin/transaksi';
                });
            }
        } catch (error) {
            console.error("Error saat mengirim request:", error);
            Swal.fire({
                icon: "error",
                text: "Kesalahan jaringan, coba lagi nanti.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className='content-header'>
                <div className='container-fluid'>
                    <div className='row mb-2'>
                        <div className='col'>
                            <h1 className='m-0'>Input Transaksi</h1>
                        </div>
                    </div>
                </div>
            </div>
            <section className='content'>
                <div className='container p-4'>
                    <div className='row'>
                        <div className="col">
                            <div className='card p-4'>
                                <div className='card-header'>
                                    <Link to="/admin/transaksi" className='btn btn-primary float-start' style={{ marginLeft: "-20px", marginTop: "-5px" }}>Lihat Data</Link>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className='card-body'>
                                        <div className='form-group'>
                                            <label htmlFor='tanggal'>Tanggal Transaksi</label>
                                            <input type='date' name='tanggal' className='form-control' />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='nama'>Nama Transaksi</label>
                                            <input type='text' name='nama' className='form-control' />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='status'>Status</label>
                                            <select name='status' className='form-control'>
                                                <option value="">-- Pilih Status --</option>
                                                <option value="pemasukan">Pemasukan</option>
                                                <option value="pengeluaran">Pengeluaran</option>
                                            </select>
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='nominal'>Nominal</label>
                                            <input type='number' name='nominal' className='form-control' />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='deskripsi'>Deskripsi</label>
                                            <input type='text' name='deskripsi' className='form-control' />
                                        </div>
                                    </div>
                                    <div className='card-footer'>
                                        <button type='submit' className='btn btn-primary' disabled={loading}>
                                            {loading ? "Menyimpan..." : "Simpan"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AddTransaksi;
