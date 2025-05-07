import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const kidRouter = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "storage/kids";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage });

kidRouter.post("/add", upload.fields([
  { name: "zayad", maxCount: 1 },
  { name: "tasrihAbawi", maxCount: 1 },
  { name: "chadaTibiya", maxCount: 1 },
  { name: "photo", maxCount: 1 },
]), async (req, res) => {
  const db = req.app.locals.db;
  const {
    kidName,
    kidFather,
    kidMother,
    fatherNumber,
    fatherMail,
    kidAge,
    adresse,
    idCamp 
  } = req.body;

  const zayad = req.files["zayad"]?.[0]?.path;
  const tasrihAbawi = req.files["tasrihAbawi"]?.[0]?.path;
  const chadaTibiya = req.files["chadaTibiya"]?.[0]?.path;
  const photo = req.files["photo"]?.[0]?.path;
  try {
    await db.run(`
      INSERT INTO kid (
        kidName, kidFather, kidMother, fatherNumber, fatherMail,
        kidAge, adresse, zayad, tasrihAbawi, chadaTibiya,photo, idCamp
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,  
      [
        kidName,
        kidFather,
        kidMother,
        fatherNumber,
        fatherMail,
        kidAge,
        adresse,
        zayad,
        tasrihAbawi,
        chadaTibiya,
        photo,
        idCamp 
      ]
    );
    res.status(201).json({ message: "Kid registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to register kid" });
  }
});

// Get all kids
kidRouter.get("/all/all", async (req, res) => {
  const db = req.app.locals.db;

  try {
    const kids = await db.all("SELECT * FROM kid");
    res.json(kids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve kids" });
  }
});

// Get a specific kid
kidRouter.get("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const kid = await db.get("SELECT * FROM kid WHERE id = ?", [id]);
    if (!kid) return res.status(404).json({ error: "Kid not found" });
    res.json(kid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve kid" });
  }
});

// Delete a kid
kidRouter.delete("/:id", async (req, res) => {
  const db = req.app.locals.db;
  const { id } = req.params;

  try {
    const kid = await db.get("SELECT * FROM kid WHERE id = ?", [id]);
    if (!kid) return res.status(404).json({ error: "Kid not found" });

    // Remove image files if they exist
    [kid.zayad, kid.tasrihAbawi, kid.chadaTibiya, kid.photo].forEach(file => {
      if (file && fs.existsSync(file)) fs.unlinkSync(file);
    });

    await db.run("DELETE FROM kid WHERE id = ?", [id]);
    res.json({ message: "Kid deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete kid" });
  }
});

// Serve kid documents
kidRouter.get("/documents/:filename", (req, res) => {
  try {
    // Sanitize the filename to prevent directory traversal
    const filename = path.basename(req.params.filename);
    const filePath = path.join(process.cwd(), 'storage', 'kids', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    // Determine content type
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') contentType = 'application/pdf';
    else if (['.jpg', '.jpeg'].includes(ext)) contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.gif') contentType = 'image/gif';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).send('Error serving file');
  }
});


kidRouter.get("/by-camp/:campId", async (req, res) => {
  const db = req.app.locals.db;
  const { campId } = req.params;

  try {
    // Verify camp exists first
    const camp = await db.get("SELECT id FROM camp WHERE id = ?", [campId]);
    if (!camp) {
      return res.status(404).json({ error: "Camp not found" });
    }

    // Get all kids for this camp
    const kids = await db.all(`
      SELECT kid.*, camp.name as campName 
      FROM kid
      LEFT JOIN camp ON kid.idCamp = camp.id
      WHERE kid.idCamp = ?
    `, [campId]);

    res.json(kids);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve kids for this camp" });
  }
});


export default kidRouter;
