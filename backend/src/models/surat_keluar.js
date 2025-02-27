const koneksi = require("./db")

const selectSuratKeluar = (callback) => {
    const q = "SELECT * FROM suratkeluar"
    koneksi.query(q, callback)
}

const insertSuratKeluar = (nomor_surat, tanggal_surat, tujuan, pengirim, perihal, file, callback) => {
    const q = "INSERT INTO suratkeluar(nomor_surat, tanggal_surat, tujuan, pengirim, perihal, file) VALUES(?,?,?,?,?,?)"
    koneksi.query(q, [nomor_surat, tanggal_surat, tujuan, pengirim, perihal, file], callback)
}

const updateSuratKeluar = (id, nomor_surat, tanggal_surat, tujuan,pengirim, perihal, file,  callback) => {
    if(id){
        
        const q = "UPDATE suratkeluar set nomor_surat = ?, tanggal_surat = ?, tujuan = ?, pengirim = ?, perihal = ?, file = ?"
        koneksi.query(q, [nomor_surat, tanggal_surat, tujuan,pengirim, perihal, file, id], callback)
    }else{
        const q = "UPDATE suratkeluar set nomor_surat = ?, tanggal_surat = ?, tujuan = ?, pengirim = ?, perihal = ?, file = ?"
        koneksi.query(q, [nomor_surat, tanggal_surat, tujuan,pengirim, perihal, file, id], callback)
    }
}

const deleteSuratKeluar= (id, callback) => {
    const q = "DELETE FROM suratkeluar WHERE id = ?"
    koneksi.query(q, [id], callback)
}

module.exports = {
    selectSuratKeluar,
    insertSuratKeluar,
    deleteSuratKeluar, 
    updateSuratKeluar
}