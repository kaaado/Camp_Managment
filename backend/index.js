import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import llmRoute from "./routes/llm.js";
import authRoutes from "./routes/auth.js";
import userRouter, { initializeDefaultAdmin } from "./routes/user.js";
import { initDB } from "./DB/database.js";
import campRouter from "./routes/camp.js";
import kidRouter from "./routes/kid.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize server
const startServer = async () => {
  try {
    // Initialize database
    const db = await initDB();
    app.locals.db = db;

    // Initialize default admin
    await initializeDefaultAdmin(db);
    console.log("✅ Database and admin initialization complete");

    // Setup routes
    app.use("/question", llmRoute);
    app.use("/auth", authRoutes);
    app.use("/user", userRouter);
    app.use("/camp", campRouter);
    app.use("/kid", kidRouter);

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();