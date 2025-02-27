const express = require("express")
const router = express.Router();
const userController = require('../controllers/userController')
const suratmasukController = require('../controllers/suratmasukController')
const suratkeluarController = require('../controllers/suratkeluarContoller')
const transaksiController = require('../controllers/transaksiController')
const authJwt = require('../middleware/authMiddleware')
const anggotaController = require('../controllers/anggotaController')

router.get("/users",authJwt, userController.index)
router.post("/users",authJwt, userController.storeUser)
router.get("/users/:id",authJwt, userController.showUser)
router.put("/users/:id",authJwt, userController.updateUser)
router.delete("/users/:id",authJwt, userController.destroyUser)
router.post("/login", userController.login)
router.post("/logout", authJwt, userController.logout)

router.get("/anggota", anggotaController.index)
router.post("/anggota", anggotaController.upload.single('foto'), anggotaController.storeAnggota)
router.delete("/anggota/:idAnggota", anggotaController.destroyAnggota)

router.get("/suratmasuk", suratmasukController.index)
router.post("/suratmasuk", suratmasukController.upload.single('file'), suratmasukController.storeSuratMasuk)
router.put("/suratmasuk/:id", suratmasukController.updateSuratMasuk)
router.delete("/suratmasuk/:id", suratmasukController.destroySuratMasuk)

router.get("/suratkeluar", suratkeluarController.index)
router.post("/suratkeluar", suratkeluarController.upload.single('file'), suratkeluarController.storeSuratKeluar)
router.put("/suratkeluar/:id", suratkeluarController.updateSuratKeluar)
router.delete("/suratkeluar/:id", suratkeluarController.destroySuratKeluar)

router.get("/transaksi", transaksiController.index)
router.post("/transaksi", transaksiController.storeTransaksi)
router.delete("/transaksi/:idTransaksi", transaksiController.destroyTransaksi)
router.get("/transaksi/saldo-per-bulan", transaksiController.getSaldoPerBulan);

module.exports = router