import express from "express";

const campRouter = express.Router();

campRouter.get("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const camp = await db.get("SELECT * FROM camp WHERE id = ?", [id]);
    if (!camp) return res.status(404).json({ error: "Camp not found" });
    res.json(camp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve camp" });
  }
});

campRouter.get("/name/:name", async (req, res) => {
  const db = req.app.locals.db;
  const { name } = req.params;

  try {
    const camp = await db.get("SELECT * FROM camp WHERE name = ?", [name]);
    if (!camp) return res.status(404).json({ error: "Camp not found" });
    res.json(camp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve camp" });
  }
});

campRouter.get("/all/all", async (req, res) => {
  const db = req.app.locals.db;

  try {
    const camps = await db.all("SELECT * FROM camp");
    res.json(camps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve camps" });
  }
});

campRouter.get("/all/:num", async (req, res) => {
  const db = req.app.locals.db;
  const { num } = req.params;

  try {
    const camps = await db.all("SELECT * FROM camp LIMIT ?", [num]);
    res.json(camps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve camps" });
  }
});

campRouter.post("/", async (req, res) => {
  const db = req.app.locals.db;
  const {
    name,
    place,
    dateStart,
    endDate,
    associatorName,
    type,
    maxcap,
    dawra,
    agecapmax,
    agecapmin,
    team,
    program,
    rules,
  } = req.body;

  try {
    await db.run(
      `INSERT INTO camp
        (name, place, datestart, enddate, associatorName, type, maxcap, dawra, agecapmax, agecapmin, team, program, rules)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        place,
        dateStart,
        endDate,
        associatorName,
        type,
        maxcap,
        dawra,
        agecapmax,
        agecapmin,
        team,
        program,
        rules,
      ]
    );
    res.status(201).json({ message: "Camp created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create camp" });
  }
});

campRouter.put("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;
  const {
    name,
    place,
    dateStart,
    endDate,
    associatorName,
    type,
    maxcap,
    dawra,
    agecapmax,
    agecapmin,
    team,
    program,
    rules,
  } = req.body;

  try {
    const result = await db.run(
      `UPDATE camp SET
        name = ?, place = ?, datestart = ?, enddate = ?, associatorName = ?, type = ?,
        maxcap = ?, dawra = ?, agecapmax = ?, agecapmin = ?, team = ?, program = ?, rules = ?
       WHERE id = ?`,
      [
        name,
        place,
        dateStart,
        endDate,
        associatorName,
        type,
        maxcap,
        dawra,
        agecapmax,
        agecapmin,
        team,
        program,
        rules,
        id,
      ]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Camp not found" });
    }

    res.json({ message: "Camp updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update camp" });
  }
});

campRouter.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const result = await db.run("DELETE FROM camp WHERE id = ?", [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Camp not found" });
    }

    res.json({ message: "Camp deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete camp" });
  }
});

export default campRouter;
