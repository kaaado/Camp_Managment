import express from "express";

const dawraRouter = express.Router();

dawraRouter.get("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const dawra = await db.get("SELECT * from dawra WHERE id = ?", [id]);
    if (!dawra) return res.status();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve dawra" });
  }
});

dawraRouter.get("/all", async (req, res) => {
  const db = req.app.locals.db;

  try {
    const dawra = await db.get("SELECT * from dawra");
    if (!dawra) return res.status();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve dawra" });
  }
});

dawraRouter.post("/", async (req, res) => {});
