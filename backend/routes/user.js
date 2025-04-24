import express from "express";
import bcrypt from "bcrypt";

const userRouter = express.Router();

userRouter.get("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const user = await db.get("SELECT * FROM user WHERE id = ?", [id]);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

userRouter.get("/name/:name", async (req, res) => {
  const db = req.app.locals.db;
  const { name } = req.params;

  try {
    const user = await db.get("SELECT * FROM user WHERE name = ?", [name]);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

userRouter.get("/all", async (req, res) => {
  const db = req.app.locals.db;

  try {
    const users = await db.all("SELECT * FROM user");
    if (!users) return res.status(404).json({ error: "No users" });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

userRouter.get("/all/:num", async (req, res) => {
  const db = req.app.locals.db;
  const { num } = req.params;

  try {
    const users = await db.all("SELECT * FROM user LIMIT ?", [num]);
    if (!users) return res.status(404).json({ error: "No users" });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

userRouter.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const { name, mail, password, type } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      "INSERT INTO user (name, mail, password, type) VALUES (?, ?, ?, ?)",
      [name, mail, hashedPassword, type || "user"]
    );
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

userRouter.put("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const { name, mail, password, type } = req.body;

  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await db.run(
      `UPDATE user SET name = ?, mail = ?, password = ?, type = ? WHERE id = ?`,
      [name || null, mail || null, hashedPassword || null, type || "user", id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

userRouter.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const result = await db.run("DELETE FROM user WHERE id = ?", [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default userRouter;
