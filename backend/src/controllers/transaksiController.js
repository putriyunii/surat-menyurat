const transaksi = require ("../models/transaksi")

const index = (req, res) => {
    transaksi.selectTransaksi((err, result) => {
        if(err){
            return res.status(500).json({message: err.message})
        }
        if(result.lenght === 0){
            return res.status(404).json("File tidak ditemukan")
        }
        res.status(200).json(result)
    })
}

const showTransaksi = (req, res) => {
    const { id } = req.params
    transaksi.selectTransaksi(id, (err, result) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        if (result.lenght === 0) {
            return res.status(400).json({message: "Transaksi tidak ada"})
        }
        res.status(200).json(result[0])
    })
}

const storeTransaksi = (req, res) => {
    const { tanggal, nama, status, nominal, deskripsi } = req.body;

    // 1. Ambil saldo terakhir
    transaksi.getLastSaldo((err, lastSaldo) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        let saldoBaru = lastSaldo || 0; // Jika tidak ada transaksi sebelumnya, saldo mulai dari 0

        // 2. Hitung saldo baru
        if (status === "kredit") {
            saldoBaru += nominal;
        } else if (status === "debit") {
            saldoBaru -= nominal;
        }

        // 3. Simpan transaksi baru dengan saldo yang telah diperbarui
        transaksi.insertTransaksi(tanggal, nama, status, nominal, deskripsi, saldoBaru, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: "Simpan berhasil", transaksiId: result.insertId, saldo: saldoBaru });
        });
    });
};
const getSaldoPerBulan = (req, res) => {
    transaksi.getSaldoPerBulan((err, result) => {
        if (err) {
            console.error("Gagal mengambil saldo per bulan:", err);
            return res.status(500).json({ message: "Terjadi kesalahan saat mengambil saldo per bulan" });
        }

        // Jika tidak ada data transaksi, kembalikan array kosong
        if (!result || result.length === 0) {
            return res.status(200).json({ message: "Tidak ada data saldo per bulan", data: [] });
        }

        console.log("Data Saldo Per Bulan:", result);
        res.status(200).json(result);
    });
};

const destroyTransaksi = (req, res) => {
    const { idTransaksi } = req.params
    transaksi.deleteTransaksi(idTransaksi, (err, result) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        res.status(200).json("data berhasil dihapus")
    })
}


module.exports={index, showTransaksi, storeTransaksi, getSaldoPerBulan, destroyTransaksi}