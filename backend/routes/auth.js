import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

const SECRET = process.env.JWT_SECRET || "supersecret";

router.post("/signup", async (req, res) => {
  const db = req.app.locals.db;
  const { name, mail, password, type = "user" } = req.body;

  if (!name || !mail || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.run(
      `INSERT INTO user (name, mail, password, type) VALUES (?, ?, ?, ?)`,
      [name, mail, hashedPassword, type]
    );

    res.status(201).json({ message: "User registered successfully." });
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

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(401).json({ error: "Invalid password." });

    const token = jwt.sign(
      { id: user.id, name: user.name, type: user.type },
      SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed." });
  }
});

export default router;
