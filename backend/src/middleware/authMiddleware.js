const jwt = require("jsonwebtoken");
const secretKey = "Rahasia";

const authJwt = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Akses ditolak, token tidak tersedia" });
    }

    const auth = token.split(" ")[1];

    jwt.verify(auth, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token tidak valid" });
        }

        req.user = user; // Menyimpan informasi user yang login
        next();
    });
};

module.exports = authJwt;
