const anggota = require("../models/anggota")
const multer = require("multer")
const path = require("path")

const index = (req, res) => {
    anggota.selectAnggota((err, result) => {
        if(err){
            return res.status(500).json({message: err.message})
        }
        if(result.lenght === 0){
            return res.status(404).json("File tidak ditemukan")
        }
        res.status(200).json(result)
    })
}

const storage = multer.diskStorage({
    destination:function (req, file, cb) {
        cb(null, 'src/files/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const storeAnggota = (req, res) => {
    const { nama, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, pangkalan, no_hp} = req.body;
    
    if (!req.file) {
        return res.status(400).json({ error: "Foto tidak boleh kosong" });
    }

    const file = req.file.filename; 

    anggota.insertAnggota(nama, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, pangkalan, no_hp, file, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ message: "Anggota berhasil disimpan" });
    });
};
const upload = multer({storage: storage})

const destroyAnggota = (req, res) => {
    const { idAnggota } = req.params
    anggota.deleteAnggota(idAnggota, (err, result) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        res.status(200).json("data berhasil dihapus")
    })
}

module.exports = {
    index, 
    storeAnggota, 
    upload,
    destroyAnggota
}