import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const SaldoChart = () => {
    const [dataChart, setDataChart] = useState({});
    const [tahunDipilih, setTahunDipilih] = useState(new Date().getFullYear());
    const [tahunList, setTahunList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchTransaksi = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/transaksi/saldo-per-bulan", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) {
                    throw new Error("Gagal mengambil data transaksi");
                }

                const data = await response.json();
                console.log("Data Transaksi dari Backend:", data);

                const bulanList = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
                const saldoPerTahun = {};
                const tahunSet = new Set();

                data.forEach((transaksi) => {
                    const [tahun, bulan] = transaksi.bulan.split("-");
                    const bulanIndex = parseInt(bulan, 10) - 1;
                    const saldo = parseFloat(transaksi.saldo);

                    tahunSet.add(tahun);

                    if (!saldoPerTahun[tahun]) {
                        saldoPerTahun[tahun] = Array(12).fill(0);
                    }

                    if (!isNaN(saldo)) {
                        saldoPerTahun[tahun][bulanIndex] = saldo;
                    }
                });

                setTahunList([...tahunSet].sort((a, b) => b - a));
                setDataChart(saldoPerTahun);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTransaksi();
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { callback: (value) => `Rp ${value.toLocaleString()}` },
            },
        },
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="card-title" style={{ cursor: "pointer" }} onClick={() => setShowModal(true)}>
                                Saldo Per Bulan
                            </h5>
                            <select
                                className="form-select w-auto ms-auto"
                                value={tahunDipilih}
                                onChange={(e) => setTahunDipilih(e.target.value)}>
                                {tahunList.map((tahun) => (
                                    <option key={tahun} value={tahun}>
                                        {tahun}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="card-body" style={{ width: "100%", minHeight: "350px" }}>
                            {loading ? (
                                <p className="text-center">Memuat data...</p>
                            ) : !dataChart[tahunDipilih] ? (
                                <p className="text-center text-muted">Tidak ada data saldo untuk tahun ini</p>
                            ) : (
                                <div style={{ width: "100%", height: "320px" }}>
                                    <Line
                                        data={{
                                            labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
                                            datasets: [
                                                {
                                                    label: "",
                                                    data: dataChart[tahunDipilih] || Array(12).fill(0),
                                                    borderColor: "#007bff",
                                                    backgroundColor: "rgba(0, 123, 255, 0.2)",
                                                    fill: true,
                                                    tension: 0.2,
                                                    pointRadius: 5,
                                                    pointHoverRadius: 7,
                                                },
                                            ],
                                        }}
                                        options={options}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Bootstrap */}
            {showModal && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Saldo Per Bulan</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {loading ? (
                                    <p className="text-center">Memuat data...</p>
                                ) : !dataChart[tahunDipilih] ? (
                                    <p className="text-center text-muted">Tidak ada data saldo untuk tahun ini</p>
                                ) : (
                                    <div style={{ width: "100%", height: "500px" }}>
                                        <Line
                                            data={{
                                                labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
                                                datasets: [
                                                    {
                                                        label: "Saldo",
                                                        data: dataChart[tahunDipilih] || Array(12).fill(0),
                                                        borderColor: "#007bff",
                                                        backgroundColor: "rgba(0, 123, 255, 0.2)",
                                                        fill: true,
                                                        tension: 0.2,
                                                        pointRadius: 5,
                                                        pointHoverRadius: 7,
                                                    },
                                                ],
                                            }}
                                            options={options}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>}
        </>
    );
};

export default SaldoChart;
