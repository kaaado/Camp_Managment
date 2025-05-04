import express from "express";
import bcrypt from "bcrypt";

const userRouter = express.Router();

export const initializeDefaultAdmin = async (db) => {
  try {
    const adminExists = await db.get(
      "SELECT id FROM user WHERE mail = ?", 
      ["admin@admin.com"]
    );
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("123456789", 10);
      await db.run(
        "INSERT INTO user (name, mail, password, type) VALUES (?, ?, ?, ?)",
        ["Admin", "admin@admin.com", hashedPassword, "admin"]
      );
      console.log("✅ Default admin account created");
    } else {
      console.log("ℹ️ Default admin account already exists");
    }
  } catch (error) {
    console.error("❌ Error creating default admin:", error);
  }
};


userRouter.get("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const user = await db.get(
      "SELECT id, name, mail, type FROM user WHERE id = ?",
      [id]
    );
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
    const user = await db.get(
      "SELECT id, name, mail, type FROM user WHERE name = ?",
      [name]
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

userRouter.get("/all/all", async (req, res) => {
  const db = req.app.locals.db;

  try {
    const users = await db.all("SELECT id, name, mail, type FROM user");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

userRouter.get("/all/:num", async (req, res) => {
  const db = req.app.locals.db;
  const num = parseInt(req.params.num, 10);

  if (isNaN(num)) {
    return res.status(400).json({ error: "Invalid number" });
  }

  try {
    const users = await db.all(
      "SELECT id, name, mail, type FROM user LIMIT ?",
      [num]
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve users" });
  }
});

userRouter.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const { name, mail, password, type = "user" } = req.body;

  if (!name || !mail || !password) {
    return res
      .status(400)
      .json({ error: "Name, mail, and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      "INSERT INTO user (name, mail, password, type) VALUES (?, ?, ?, ?)",
      [name, mail, hashedPassword, type]
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
    const user = await db.get("SELECT * FROM user WHERE id = ?", [id]);
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedName = name || user.name;
    const updatedMail = mail || user.mail;
    const updatedType = type || user.type;
    const updatedPassword = password
      ? await bcrypt.hash(password, 10)
      : user.password;

    await db.run(
      `UPDATE user SET name = ?, mail = ?, password = ?, type = ? WHERE id = ?`,
      [updatedName, updatedMail, updatedPassword, updatedType, id]
    );

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
