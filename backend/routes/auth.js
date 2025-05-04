import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/register", async (req, res) => {
  const db = req.app.locals.db;
  const { name, mail, password, type = "user" } = req.body;

  if (!name || !mail || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
      `INSERT INTO user (name, mail, password, type) VALUES (?, ?, ?, ?)`,
      [name, mail, hashedPassword, type]
    );

    const id = result.lastID; 
    const user = { id, name, mail, type };

    const token = jwt.sign(
      { id: user.id, name: user.name, type: user.type },
      SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ user, token, message: "User registered successfully." });
  } catch (err) {
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(409).json({ error: "Email already in use." });
    }
    res.status(500).json({ error: "Signup failed." });
  }
});

router.post("/login", async (req, res) => {
  const db = req.app.locals.db;
  const { mail, password } = req.body;

  try {
    const user = await db.get(`SELECT * FROM user WHERE mail = ?`, [mail]);

    if (!user) return res.status(404).json({ error: "User not found." });

      const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password." });

    const token = jwt.sign(
      { id: user.id, name: user.name, type: user.type },
      SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed." });
  }
});

export default router;
