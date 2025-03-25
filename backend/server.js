const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "qwerty",
  database: "retseptid_mysql",
});

const SECRET_KEY =
  "27fab2ac4dfdee74fa836b7f25bbe464314f5d7a63b163bcaa3398233efb0bcf3a9e39890fe36f768aaf23ba29a7e76a87ff502ab03efb080cc78b2372dfae8b";

const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied, no token provided" });
  }

  // Verify token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Attach the user data to the request object
    req.user = user;
    console.log(req.user);
    next(); // Continue to the next middleware or route handler
  });
};

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM kasutajad WHERE email = ?";

  db.query(sql, [email], async (err, data) => {
    console.log(data);
    if (err) return res.json("Login failed");
    if (data.length > 0) {
      const user = data[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      // Generates a JWT token for the user
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
        expiresIn: "1h",
      });
      return res.json({
        message: "Login successful",
        token,
        username: user.kasutajanimi, 
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  });
});


app.post("/sign-up", async (req, res) => {
  const { email, password, kasutajanimi } = req.body; 

  if (!email || !password) {
    return res.status(400).json({ message: "Email ja parool on kohustuslikud!" });
  }

  // If kasutajanimi is not provided or empty, generate it from email
  let finalUsername = kasutajanimi && kasutajanimi.trim() !== "" 
    ? kasutajanimi 
    : email.split("@")[0];

  try {
    // Generate a unique username (assuming this function exists)
    finalUsername = await generateUniqueUsername(finalUsername);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Corrected SQL query with matching parameter order
    const sql = "INSERT INTO kasutajad (email, password, kasutajanimi) VALUES (?, ?, ?)";
    db.query(sql, [email, hashedPassword, finalUsername], (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Midagi läks valesti" });
      }
      res.status(201).json({ message: "Kasutaja loodud!", kasutajanimi: finalUsername });
    });
  } catch (err) {
    console.error("Error during sign-up:", err);
    return res.status(500).json({ message: "Midagi läks valesti" });
  }
});

// Update username route
app.post("/update-username", (req, res) => {
  const { userId, newUsername } = req.body;

  if (!userId || !newUsername) {
    return res.status(400).json({ error: "Puuduvad andmed!" });
  }

  generateUniqueUsername(newUsername, (err, uniqueUsername) => {
    if (err) {
      console.error("Error generating username:", err);
      return res.status(500).json({ error: "Midagi läks valesti" });
    }

    db.query(
      "UPDATE kasutajad SET kasutajanimi = ? WHERE id = ?",
      [uniqueUsername, userId],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Midagi läks valesti" });
        }
        res.status(200).json({
          message: "Kasutajanimi uuendatud!",
          username: uniqueUsername,
        });
      }
    );
  });
});

// Example implementation of generateUniqueUsername (adjust as needed)
async function generateUniqueUsername(baseUsername) {
  let username = baseUsername;
  let counter = 1;

  return new Promise((resolve, reject) => {
    const checkUsername = () => {
      db.query(
        "SELECT COUNT(*) as count FROM kasutajad WHERE kasutajanimi = ?",
        [username],
        (err, result) => {
          if (err) return reject(err);
          if (result[0].count === 0) {
            resolve(username); // Username is unique
          } else {
            username = `${baseUsername}${counter++}`; // Append number and retry
            checkUsername();
          }
        }
      );
    };
    checkUsername();
  });
}

// Multer üleslaadimise konfiguratsioon
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Salvesta pildid 'uploads' kausta
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Lisa ajatempli pildinimele
  },
});
const upload = multer({ storage });

app.post(
  "/add-recipe",
  authenticateToken,
  upload.single("image"),
  (req, res) => {
    const { name, koostisosad, retsept } = req.body;
    const imagePath = req.file ? req.file.filename : null;
    const kasutajaId = req.user.id;

    if (!name || !koostisosad || !retsept || !imagePath) {
      return res.status(400).json({ message: "Kõik väljad on kohustuslikud!" });
    }

    const sql =
      "INSERT INTO retseptid (name, image, koostisosad, retsept, id) VALUES (?, ?, ?, ?, ?)";
    db.query(
      sql,
      [name, imagePath, koostisosad, retsept, kasutajaId],
      (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "Midagi läks valesti!" });
        }
        return res.json({
          message: "Retsept edukalt lisatud!",
          recipeId: data.insertId,
        });
      }
    );
  }
);

app.use("/uploads", express.static("uploads"));

app.get("/recipes", (req, res) => {
  const sql =
    "SELECT r.ret_id, r.name, r.image, r.koostisosad, r.retsept, k.email AS kasutajanimi FROM retseptid r JOIN kasutajad k ON r.id = k.id";

  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Midagi läks valesti!" });
    }
    return res.json(data);
  });
});


app.post("/rate-recipe", authenticateToken, (req, res) => {
  const { recipeId, rating } = req.body;
  const userId = req.user.id; 

  if (!recipeId || !rating) {
    return res.status(400).json({ error: "Puuduv retsepti ID või hinnang" });
  }

  const sql =
    "INSERT INTO hinnangud (recipe_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)";

  db.query(sql, [recipeId, userId, rating], (err, data) => {
    if (err) {
      console.error("Viga hinnangu salvestamisel:", err);
      return res.status(500).json({ error: "Serveri viga" });
    }
    res.json({ success: true, message: "Hinnang salvestatud!" });
  });
});


app.get("/favorites", authenticateToken, (req, res) => {
  const sql = "SELECT * FROM lemmikud WHERE user_email = ?";
  const userEmail = req.user.email; // Kasutaja email JWT payloadist

  db.query(sql, [userEmail], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching favorites" });
    }

    return res.json(data);
  });
});

app.listen(8081, () => {
  console.log("lisening...");
});
