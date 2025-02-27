const mysql = require("mysql2")
const koneksi = require("./db")
const koneksiMysql = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_swk", 
    multipleStatements: true
})

const createUserTable = (koneksi) => {
    const q = `create TABLE IF NOT EXISTS users(id INT AUTO_INCREMENT PRIMARY KEY, nama varchar(100), email varchar(100) UNIQUE, password varchar(100), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, deleted_at TIMESTAMP NULL DEFAULT NULL)`;
koneksi.query(q, (err, result) => {
        if (err) {
            console.error("error buat table user", err.stack)
            return
        }
        console.log("tabel user berhasil di buat")
})
}

const createAnggota = (koneksi) => {
    const q = `CREATE TABLE IF NOT EXISTS anggota (
        idAnggota INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100),
        tempat_lahir VARCHAR(100),
        tanggal_lahir DATE,
        jenis_kelamin ENUM('laki-laki', 'perempuan'),
        alamat VARCHAR(252),
        pangkalan VARCHAR(252),
        no_hp VARCHAR(15),
        foto TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

    koneksi.query(q, (err, result) => {
        if (err) {
            console.error("Error buat table anggota", err.stack);
            return;
        }
        console.log("Tabel anggota berhasil dibuat");
    });
};


const createSuratMasukTable = (koneksi) => {
    const q = `create TABLE IF NOT EXISTS suratmasuk(id INT AUTO_INCREMENT PRIMARY KEY, 
    nomor_surat VARCHAR(50),
    tanggal_surat DATE NOT NULL, 
    tanggal_terima DATE NOT NULL, 
    pengirim Varchar(100), 
    perihal VARCHAR(225), 
    file TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`
    koneksi.query(q, (err, result) => {
        if (err) {
            console.error("error buat table surat masuk", err.stack)
            return
        }
        console.log("tabel surat masuk berhasil di buat")
})
}

const createSuratKeluar = (koneksi) => {
    const q = `create TABLE IF NOT EXISTS suratkeluar(id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    nomor_surat VARCHAR(50),
    tanggal_surat DATE NOT NULL, 
    pengirim VARCHAR(100),
    tujuan VARCHAR(100),
    perihal TEXT,
    file TEXT)`
    koneksi.query(q, (err, result) => {
        if (err) {
            console.error("error buat table surat keluar", err.stack)
            return
        }
        console.log("tabel surat keluar berhasil di buat")
})
}

const createTransaksiTable = (koneksi) => {
    const q = `create TABLE IF NOT EXISTS transaksi(idTransaksi INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    nama VARCHAR(100),
    status ENUM('pemasukan','pengeluaran'),
    nominal DECIMAL(10,2),
    deskripsi Text,
    saldo DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    deleted_at TIMESTAMP NULL DEFAULT NULL)`
    koneksi.query(q, (err, result) => {
        if (err) {
            console.error("error buat table transaksi", err.stack)
            return
        }
        console.log("tabel transaksi berhasil di buat")
}) 
}


const migration = () => {
    koneksiMysql.connect((err) => {
        if (err) {
            console.error("Error koneksi ke database", err.stack)
            return
        }
        console.log("berhasil konek mysql")
        koneksiMysql.query(
            "CREATE DATABASE IF NOT EXISTS swk", 
            (err, result) => {
                if (err) {
                    console.error("Error membuat database", err.stack)
                    return
                }
                console.log("Database berhasil dibuat atau sudah ada. ")

                const koneksi = require("./db")
                createUserTable(koneksi)
                createSuratMasukTable(koneksi)
                createTransaksiTable(koneksi)
                
                createSuratKeluar(koneksi)
                createAnggota(koneksi)

                koneksiMysql.end()
            }
        )
    })
}

module.exports = migration;