const koneksi = require("./db")

const selectAnggota = (callback) => {
    const q = "SELECT * FROM anggota"
    koneksi.query(q, callback)
}

const insertAnggota = (nama, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, pangkalan, no_hp, foto, callback) => {
    const q = "INSERT INTO anggota(nama, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, pangkalan, no_hp, foto) VALUES(?,?,?,?,?,?,?,?)"
    koneksi.query(q, [nama, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, pangkalan, no_hp, foto], callback)
}

const deleteAnggota= (id, callback) => {
    const q = "DELETE FROM anggota WHERE idAnggota = ?"
    koneksi.query(q, [id], callback)
}

module.exports = {
    selectAnggota,
    insertAnggota,
    deleteAnggota
}