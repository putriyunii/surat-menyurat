const suratmasuk = require("../models/surat_masuk")
const multer = require("multer")
const path = require("path")

const index = (req, res) => {
    suratmasuk.selectSuratMasuk((err, result) => {
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



const storeSuratMasuk = (req, res) => {
    const { nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal} = req.body;
    
    if (!req.file) {
        return res.status(400).json({ error: "Foto tidak boleh kosong" });
    }

    const file = req.file.filename; 

    suratmasuk.insertSuratMasuk(nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, file, (err, result) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.status(200).json({ message: "Surat masuk berhasil disimpan" });
    });
};
const upload = multer({storage: storage})

const updateSuratMasuk = (req, res) => {
    const {id  } = req.params
    const {nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, file} = req.body
    suratmasuk.updateSuratMasuk(id, nomor_surat, tanggal_surat, tanggal_terima, pengirim, perihal, file, (err, result) => {
        if (err) {
return res.status(500).json({error: err.message})
        }            
        res.status(200).json("data berhasil dirubah")
    })
}

const destroySuratMasuk = (req, res) => {
    const { id } = req.params
    suratmasuk.deleteSuratMasuk(id, (err, result) => {
        if (err) {
            return res.status(500).json({error: err.message})
        }
        res.status(200).json("data berhasil dihapus")
    })
}

module.exports={index, storeSuratMasuk, upload, destroySuratMasuk, updateSuratMasuk}