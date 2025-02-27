import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const ChartSurat = () => {
    const [dataChart, setDataChart] = useState([]);
    const [tahunDipilih, setTahunDipilih] = useState(new Date().getFullYear());
    const [tahunList, setTahunList] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            try {
                const [suratMasukRes, suratKeluarRes] = await Promise.all([
                    fetch("http://localhost:3000/api/suratmasuk", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch("http://localhost:3000/api/suratkeluar", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const suratMasuk = await suratMasukRes.json();
                const suratKeluar = await suratKeluarRes.json();

                const bulanList = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
                const groupedData = {};
                const tahunSet = new Set();

                const formatBulanTahun = (tanggal) => {
                    if (!tanggal) return { bulan: null, tahun: null };
                    let parsedDate = new Date(tanggal);
                    return { bulan: parsedDate.getMonth(), tahun: parsedDate.getFullYear() };
                };

                suratMasuk.forEach((surat) => {
                    const { bulan, tahun } = formatBulanTahun(surat.tanggal_surat);
                    if (bulan === null || tahun === null) return;
                    tahunSet.add(tahun);

                    if (!groupedData[tahun]) groupedData[tahun] = {};

                    if (!groupedData[tahun][bulan]) {
                        groupedData[tahun][bulan] = {
                            bulan: bulanList[bulan],
                            masuk: 0,
                            keluar: 0,
                        };
                    }
                    groupedData[tahun][bulan].masuk += 1;
                });

                suratKeluar.forEach((surat) => {
                    const { bulan, tahun } = formatBulanTahun(surat.tanggal_surat);
                    if (bulan === null || tahun === null) return;
                    tahunSet.add(tahun);

                    if (!groupedData[tahun]) groupedData[tahun] = {};

                    if (!groupedData[tahun][bulan]) {
                        groupedData[tahun][bulan] = {
                            bulan: bulanList[bulan],
                            masuk: 0,
                            keluar: 0,
                        };
                    }
                    groupedData[tahun][bulan].keluar += 1;
                });

                // Urutkan data berdasarkan bulan & hanya ambil bulan yang memiliki data
                const sortedData = {};
                Object.keys(groupedData).forEach((tahun) => {
                    sortedData[tahun] = Object.keys(groupedData[tahun])
                        .map((bulanIndex) => groupedData[tahun][bulanIndex])
                        .sort((a, b) => bulanList.indexOf(a.bulan) - bulanList.indexOf(b.bulan));
                });

                setTahunList([...tahunSet].sort((a, b) => b - a));
                setDataChart(sortedData);
            } catch (error) {
                console.error("Gagal mengambil data surat:", error);
            }
        };

        fetchData();
    }, []);


    return (
        <>
            <div className="col-md-6 w-100" style={{ minWidth: "100%" }}>
                <div className="card">
                    <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h3
                            className="card-title"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowModal(true)}>
                            Perbandingan Surat Masuk & Keluar
                        </h3>
                        <select
                            className="form-select w-auto ms-auto"
                            value={tahunDipilih}
                            onChange={(e) => setTahunDipilih(parseInt(e.target.value))}>
                            {tahunList.map((tahun) => (
                                <option key={tahun} value={tahun}>
                                    {tahun}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="card-body" style={{ width: "100%", minHeight: "350px" }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dataChart[tahunDipilih] || []}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="bulan" interval={0} angle={-45} textAnchor="end" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(value) => Math.floor(value)} allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="masuk" fill="#00879E" name="Surat Masuk" />
                                <Bar dataKey="keluar" fill="#c6c6c6" name="Surat Keluar" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Modal Bootstrap */}
            {showModal && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Perbandingan Surat Masuk & Keluar</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <ResponsiveContainer width="100%" height={500}>
                                    <BarChart data={dataChart[tahunDipilih] || []}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="bulan" interval={0} angle={-45} textAnchor="end" tick={{ fontSize: 14 }} />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="masuk" fill="#00879E" name="Surat Masuk" />
                                        <Bar dataKey="keluar" fill="#c6c6c6" name="Surat Keluar" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showModal && <div className="modal-backdrop fade show" onClick={() => setShowModal(false)}></div>}
        </>
    );
};

export default ChartSurat;
