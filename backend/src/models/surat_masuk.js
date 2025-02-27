const koneksi = require("./db")

const selectSuratMasuk = (callback) => {
    const q = "SELECT * FROM suratmasuk"
    koneksi.query(q, callback)
}

const insertSuratMasuk = (nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, file, callback) => {
    const q = "INSERT INTO suratmasuk(nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, file) VALUES(?,?,?,?,?,?)"
    koneksi.query(q, [nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, file], callback)
}

const updateSuratMasuk = (id, nomor_surat, tanggal_surat, tanggal_terima,pengirim, perihal, file , callback) => {
    if(id){
        
        const q = "UPDATE suratmasuk set nomor_surat = ?, tanggal_surat = ?, tanggal_terima = ?, pengirim = ?, perihal = ?, file = ?"
        koneksi.query(q, [id, nomor_surat, tanggal_surat, tanggal_terima,pengirim, perihal, file, id], callback)
    }else{
        const q = "UPDATE suratmasuk set nomor_surat = ?, tanggal_surat = ?, tanggal_terima = ?, pengirim = ?, perihal = ?, file = ?"
        koneksi.query(q, [id, nomor_surat, tanggal_surat, tanggal_terima,pengirim, perihal, file, id], callback)
    }
}

const deleteSuratMasuk= (id, callback) => {
    const q = "DELETE FROM suratmasuk WHERE id = ?"
    koneksi.query(q, [id], callback)
}

module.exports = {
    selectSuratMasuk,
    insertSuratMasuk,
    deleteSuratMasuk, 
    updateSuratMasuk
}