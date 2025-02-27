const koneksi = require("./db")
const bcrypt = require("bcryptjs")

const selectUsers = (callback) => {
    const q = "SELECT * FROM users";
    koneksi.query(q, callback);
}

const insertUser = (nama, email, password, callback) => {
    if(password){
        const hashedPass = bcrypt.hashSync(password, 10)
        const q = "INSERT INTO users(nama, email, password) VALUES(?,?,?)"
        koneksi.query(q, [nama, email, hashedPass], callback)
    }else{
        console.error("password harus di isi")
    }
}

const selectUserById = (id, callback) => {
    const q = " SELECT * FROM users where id=?"
    koneksi.query(q, [id], callback)
}

const updateUser = (id, nama, email, password, callback) => {
    if(password){
        const hashedPass = bcrypt.hashSync(password,10)
        const q = "UPDATE users set nama = ?, email = ?, password = ? WHERE id = ?"
        koneksi.query(q, [nama, email, hashedPass, id], callback)
    }else{
        const q = "UPDATE users set nama = ?, email = ? WHERE id = ?"
        koneksi.query(q, [nama, email, id], callback)
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const loggedInUserId = req.user.id; // Pastikan ini didapat dari token autentikasi

        if (parseInt(userId, 10) === loggedInUserId) {
            return res.status(403).json({ message: "Anda tidak bisa menghapus akun sendiri!" });
        }

        await User.destroy({ where: { id: userId } });
        res.json({ message: "User berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus user", error: error.message });
    }
};

const selectUserByEmail=(email,callback)=>{
    const q= `select * from users where email=?`
    koneksi.query(q,[email],callback)
}

module.exports = {selectUsers, selectUserById, insertUser, updateUser, deleteUser, selectUserByEmail}