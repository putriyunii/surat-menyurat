const suratkeluar = require("../models/surat_keluar");
const multer = require("multer");
const path = require("path");

// Middleware Multer untuk upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "src/files/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 📌 1. Tampilkan Semua Surat Keluar
const index = (req, res) => {
    suratkeluar.selectSuratKeluar((err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (result.length === 0) { // ✅ Fix Typo `length`
            return res.status(404).json({ message: "File tidak ditemukan" });
        }
        res.status(200).json(result);
    });
};

// 📌 2. Tambah Surat Keluar Baru
const storeSuratKeluar = (req, res) => {
    const { nomor_surat, tanggal_surat, tujuan, pengirim, perihal } = req.body;

    if (!req.file) {
        return res.status(400).json({ error: "File tidak boleh kosong" });
    }

    const file = req.file.filename; // Nama file yang di-upload

    suratkeluar.insertSuratKeluar(nomor_surat, tanggal_surat, tujuan, pengirim, perihal, file, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ message: "Surat keluar berhasil disimpan" });
    });
};

// 📌 3. Update Surat Keluar
const updateSuratKeluar = (req, res) => {
    const { id } = req.params;
    const { nomor_surat, tanggal_surat, tujuan, pengirim, perihal } = req.body;
    const file = req.file ? req.file.filename : req.body.file; // Jika ada file baru, gunakan file yang di-upload

    console.log("Data yang diterima backend:", req.body);
    console.log("File yang diterima:", req.file);

    // Query Update
    const query = `
        UPDATE suratkeluar 
        SET nomor_surat = ?, tanggal_surat = ?, tujuan = ?, pengirim = ?, perihal = ?, file = ? 
        WHERE id = ?`;

    suratkeluar.updateSuratKeluar(id, nomor_surat, tanggal_surat, tujuan, pengirim, perihal, file, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Surat keluar berhasil diperbarui" });
    });
};

// 📌 4. Hapus Surat Keluar
const destroySuratKeluar = (req, res) => {
    const { id } = req.params;

    suratkeluar.deleteSuratKeluar(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Data berhasil dihapus" });
    });
};

// 📌 5. Export Modul
module.exports = {
    index,
    storeSuratKeluar,
    upload,
    updateSuratKeluar,
    destroySuratKeluar
};
