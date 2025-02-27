    import React, { useState, useEffect } from 'react';

    const Pendaftaran = () => {
        const [pendaftaran, setPendaftaran] = useState([]); // Perbaikan state
        const token = localStorage.getItem('token');

        const tampilData = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/pendaftaran', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = await response.json();
                setPendaftaran(data); // Menggunakan setter yang benar
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        useEffect(() => {
            tampilData();
        }, []);

        return (
            <div className="container">
                <img src="./gambar/banner_skolah.png" alt="School Logo" width="100%" />
                <h1>Pendaftaran Siswa Baru💫</h1>
                <p style={{ textAlign: 'center' }}>Silakan lengkapi formulir di bawah ini untuk mendaftar sebagai siswa baru😁👍</p>
                <div className="registration-form">
                    <form action="#" method="post" encType="multipart/form-data">
                        <table>
                            <tbody>
                                <tr>
                                    <td>Nama</td>
                                    <td><input type="text" name="nama" placeholder="Masukkan nama Anda" required /></td>
                                </tr>
                                <tr>
                                    <td>Tempat Lahir</td>
                                    <td><input type="text" name="tempat_lahir" placeholder="Masukkan tempat lahir" required /></td>
                                </tr>
                                <tr>
                                    <td>Tanggal Lahir</td>
                                    <td><input type="date" name="tanggal_lahir" required /></td>
                                </tr>
                                <tr>
                                    <td>Jenis Kelamin</td>
                                    <td>
                                        <input type="radio" name="gender" value="laki-laki" required /> Laki-laki
                                        <input type="radio" name="gender" value="perempuan" required /> Perempuan
                                    </td>
                                </tr>
                                <tr>
                                    <td>Alamat</td>
                                    <td><textarea name="alamat" placeholder="Masukkan alamat lengkap" cols={30} rows={3} required></textarea></td>
                                </tr>
                                <tr>
                                    <td>Pangkalan</td>
                                    <td><input type="text" name="pangkalan" placeholder="Masukkan nama pangkalan" required /></td>
                                </tr>
                                <tr>
                                    <td>No HP</td>
                                    <td><input type="tel" name="no_hp" placeholder="Masukkan nomor HP" required /></td>
                                </tr>
                                <tr>
                                    <td>Foto</td>
                                    <td><input type="file" name="foto" accept="image/*" required /></td>
                                </tr>
                            </tbody>
                        </table>
                        <input type="submit" value="Daftar Sekarang" />
                    </form>
                </div>
            </div>
        );
    };

    export default Pendaftaran;
