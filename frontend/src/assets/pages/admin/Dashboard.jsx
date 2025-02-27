import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ChartPemasukan from '../../components/ChartPemasukan';
import ChartPengeluaran from '../../components/ChartPengeluaran';
import ChartSurat from '../../components/ChartSurat';
import SaldoChart from '../../components/SaldoChart';

const Dashboard = () => {
    const [dataUser, setUser] = useState([]);
    const [dataSuratmasuk, setSuratmasuk] = useState([]);
    const [dataSuratkeluar, setSuratkeluar] = useState([]);
    const [dataSaldo, setSaldo] = useState(0);
    const [dataTransaksi, setTransaksi] = useState([]);

    const token = localStorage.getItem("token");

    const tampilDataUser = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Gagal mengambil data user:", error);
        }
    };

    const tampilDataSuratmasuk = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/suratmasuk", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setSuratmasuk(data);
        } catch (error) {
            console.error("Gagal mengambil data surat masuk:", error);
        }
    };

    const tampilDataSuratkeluar = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/suratkeluar", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            setSuratkeluar(data);
        } catch (error) {
            console.error("Gagal mengambil data surat keluar:", error);
        }
    };

    const tampilDataTransaksi = async () => {
        if (!token) return;

        try {
            const response = await fetch("http://localhost:3000/api/transaksi", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Gagal mengambil data transaksi");

            const data = await response.json();
            setTransaksi(data);
        } catch (error) {
            console.error("Error fetching transaksi:", error);
        }
    };

    useEffect(() => {
        let saldoAkhir = 0;
        const sortedTransactions = [...dataTransaksi].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

        sortedTransactions.forEach((trx) => {
            if (trx.status === "pemasukan") {
                saldoAkhir += Number(trx.nominal);
            } else if (trx.status === "pengeluaran") {
                saldoAkhir -= Number(trx.nominal);
            }
        });

        setSaldo(saldoAkhir);
    }, [dataTransaksi]);

    useEffect(() => {
        tampilDataUser();
        tampilDataSuratmasuk();
        tampilDataSuratkeluar();
        tampilDataTransaksi();
    }, []);

    return (
        <>
            <div className="container-wrapper">
                <div className="content-header">
                    <div className="container-fluid">
                        <div className="row mb-2">
                            <div className="col-sm-6">
                                <h1 className="m-0">Dashboard</h1>
                            </div>
                            <div className="col-sm-6">
                                <ol className="breadcrumb float-sm-right">
                                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                                    <li className="breadcrumb-item active">Dashboard</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                            {/* Box User */}
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-info">
                                    <div className="inner">
                                        <h3>{dataUser.length}</h3>
                                        <p>User</p>
                                    </div>
                                    <div className="icon">
                                        <i className="fas fa-user" />
                                    </div>
                                    <Link to="/admin/users" className="small-box-footer">
                                        More info <i className="fas fa-arrow-circle-right"></i>
                                    </Link>
                                </div>
                            </div>

                            {/* Box Surat Masuk */}
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-success">
                                    <div className="inner">
                                        <h3>{dataSuratmasuk.length}</h3>
                                        <p>Surat Masuk</p>
                                    </div>
                                    <div className="icon">
                                        <i className="fas fa-envelope-open-text" />
                                    </div>
                                    <Link to="/admin/suratmasuk" className="small-box-footer">
                                        More info <i className="fas fa-arrow-circle-right"></i>
                                    </Link>
                                </div>
                            </div>

                            {/* Box Surat Keluar */}
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-warning">
                                    <div className="inner">
                                        <h3>{dataSuratkeluar.length}</h3>
                                        <p>Surat Keluar</p>
                                    </div>
                                    <div className="icon">
                                        <i className="fas fa-paper-plane" />
                                    </div>
                                    <Link to="/admin/suratkeluar" className="small-box-footer">
                                        More info <i className="fas fa-arrow-circle-right"></i>
                                    </Link>
                                </div>
                            </div>

                            {/* Box Saldo */}
                            <div className="col-lg-3 col-6">
                                <div className="small-box bg-danger">
                                    <div className="inner">
                                        <h3>{dataSaldo.toLocaleString()}</h3>
                                        <p>Saldo</p>
                                    </div>
                                    <div className="icon">
                                        <i className='fas fa-coins' />
                                    </div>
                                    <Link to="/admin/transaksi" className="small-box-footer">
                                        More Info <i className="fas fa-arrow-circle-right"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Chart Section */}
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-md-6">
                                    <ChartPemasukan dataTransaksi={dataTransaksi} />
                                </div>
                                <div className="col-md-6">
                                    <ChartPengeluaran dataTransaksi={dataTransaksi} />

                                </div>
                            </div>
                        </div>

                        <div className="container-fluid">
                            <div className="row">
                                {/* Chart Surat */}
                                <div className="col-md-6">
                                    <ChartSurat />
                                </div>

                                {/* Chart Saldo */}
                                <div className="col-md-6">
                                    <SaldoChart />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Dashboard;
