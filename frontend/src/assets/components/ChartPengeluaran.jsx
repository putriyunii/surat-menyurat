import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const ChartPengeluaran = ({ dataTransaksi }) => {
    const [dataChart, setDataChart] = useState([]);
    const [tahunDipilih, setTahunDipilih] = useState(new Date().getFullYear());
    const [tahunList, setTahunList] = useState([]);
    const [showModal, setShowModal] = useState(false);

    // Urutan bulan yang benar untuk sorting
    const bulanListOrdered = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

    useEffect(() => {
        if (!dataTransaksi || dataTransaksi.length === 0) {
            console.warn("Tidak ada data transaksi untuk chart.");
            return;
        }

        console.log("Data Transaksi yang Masuk ke Chart:", dataTransaksi);

        const pengeluaranData = dataTransaksi.filter(trx => trx.status.toLowerCase() === "pengeluaran");

        // Ambil daftar tahun unik dari transaksi
        const tahunSet = new Set(pengeluaranData.map(trx => new Date(trx.tanggal).getFullYear()));
        setTahunList([...tahunSet].sort((a, b) => b - a));

        // Filter data berdasarkan tahun yang dipilih
        const filteredData = pengeluaranData.filter(trx => new Date(trx.tanggal).getFullYear() === tahunDipilih);

        // Kelompokkan data berdasarkan bulan
        const groupedData = filteredData.reduce((acc, trx) => {
            const bulan = new Date(trx.tanggal).toLocaleString("id-ID", { month: "long" });

            if (!acc[bulan]) {
                acc[bulan] = { bulan, pengeluaran: 0 };
            }

            acc[bulan].pengeluaran += Number(trx.nominal);

            return acc;
        }, {});

        // Konversi objek ke array & urutkan berdasarkan bulan
        const chartData = Object.values(groupedData).sort(
            (a, b) => bulanListOrdered.indexOf(a.bulan) - bulanListOrdered.indexOf(b.bulan)
        );

        console.log("Data Chart yang Ditampilkan (setelah sorting):", chartData);
        setDataChart(chartData);
    }, [dataTransaksi, tahunDipilih]);

    return (
        <div className="card card-danger">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title" style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}>
                    Bar Chart Pengeluaran
                </h3>
                <select
                    className="form-select w-auto ms-auto"
                    value={tahunDipilih}
                    onChange={(e) => setTahunDipilih(parseInt(e.target.value))}
                >
                    {tahunList.map((tahun) => (
                        <option key={tahun} value={tahun}>
                            {tahun}
                        </option>
                    ))}
                </select>
            </div>
            <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dataChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="bulan" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="pengeluaran" fill="#E52020" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Modal Bootstrap */}
            {showModal && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Bar Chart Pengeluaran</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <ResponsiveContainer width="100%" height={500}>
                                    <BarChart data={dataChart}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="bulan" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="pengeluaran" fill="#E52020" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>}
        </div>
    );
};

export default ChartPengeluaran;
