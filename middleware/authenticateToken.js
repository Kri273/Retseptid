const jwt = require("jsonwebtoken");

const SECRET_KEY = "27fab2ac4dfdee74fa836b7f25bbe464314f5d7a63b163bcaa3398233efb0bcf3a9e39890fe36f768aaf23ba29a7e76a87ff502ab03efb080cc78b2372dfae8b";


function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Juurdepääs keelatud! Puudub token." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid Token" });
        req.user = user; 
        next();
    });
}

module.exports = authenticateToken;
