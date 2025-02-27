const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const index = (req, res) => {
    User.selectUsers((err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "User kosong" });
        }
        res.status(200).json(result);
    });
};

const showUser = (req, res) => {
    const { id } = req.params;
    User.selectUserById(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        res.status(200).json(result[0]);
    });
};

const storeUser = (req, res) => {
    const { nama, email, password } = req.body;
    
    // Hash password sebelum disimpan
    const hashedPassword = bcrypt.hashSync(password, 10);

    User.insertUser(nama, email, hashedPassword, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Simpan berhasil", userId: result.insertId });
    });
};

const updateUser = (req, res) => {
    const { id } = req.params;
    const { nama, email, password } = req.body;

    // Hash password jika diubah
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : null;

    User.updateUser(id, nama, email, hashedPassword, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Data berhasil diubah" });
    });
};

const destroyUser = (req, res) => {
    const { id } = req.params;

    // Cek apakah user mencoba menghapus dirinya sendiri
    if (parseInt(id) === req.user.id) {
        return res.status(403).json({ message: "Anda tidak dapat menghapus akun sendiri" });
    }

    User.deleteUser(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json("data berhasil dihapus");
    });
};

const login = (req, res) => {
    const { email, password } = req.body;
    User.selectUserByEmail(email, (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: "Email tidak ditemukan" });
        }

        const user = result[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: "Password salah" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "Rahasia", { expiresIn: 86400 });
        res.status(200).json({ auth: true, token, userId: user.id });
    });
};

const logout = (req, res) => {
    res.status(200).json({ auth: false, token: null });
};

module.exports = {
    index,
    showUser,
    storeUser,
    updateUser,
    destroyUser,
    login,
    logout,
};
