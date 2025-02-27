const mysql = require("mysql2")
const koneksi = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_swk",
})
koneksi.connect((err) => {
    if (err){
        console.error("Error koneksi ke database", err.stack)
        return
    }
    console.log("Berhasil koneksi ke database swk")
})
module.exports = koneksi;