const koneksi = require("./db");

const selectTransaksi = (callback) => {
    const q = "SELECT * FROM transaksi";
    koneksi.query(q, callback);
};

const getLastSaldo = (callback) => {
    const q = "SELECT saldo FROM transaksi ORDER BY tanggal DESC LIMIT 1";
    koneksi.query(q, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        if (result.length === 0) {
            return callback(null, 0); // Jika belum ada transaksi, saldo dimulai dari 0
        }
        return callback(null, result[0].saldo);
    });
};
const getSaldoPerBulan = (callback) => {
    const q = `
        SELECT 
            DATE_FORMAT(tanggal, '%Y-%m') AS bulan, 
            saldo 
        FROM transaksi 
        WHERE tanggal = (SELECT MAX(tanggal) FROM transaksi t2 WHERE DATE_FORMAT(t2.tanggal, '%Y-%m') = DATE_FORMAT(transaksi.tanggal, '%Y-%m'))
        ORDER BY bulan ASC
    `;
    koneksi.query(q, callback);
};
const insertTransaksi = (tanggal, nama, status, nominal, deskripsi, saldo, callback) => {
    const q = "INSERT INTO transaksi(tanggal, nama, status, nominal, deskripsi, saldo) VALUES(?,?,?,?,?,?)";
    koneksi.query(q, [tanggal, nama, status, nominal, deskripsi, saldo], callback);
};

const deleteTransaksi = (idTransaksi, callback) => {
    const q = "DELETE FROM transaksi WHERE idTransaksi = ?";
    koneksi.query(q, [idTransaksi], callback);
};

module.exports = { selectTransaksi,getLastSaldo,getSaldoPerBulan, insertTransaksi, deleteTransaksi };
