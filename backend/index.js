import express from "express";
import dotenv from "dotenv";
import llmRoute from "./routes/llm.js";
import authRoutes from "./routes/auth.js";
import userRouter from "./routes/user.js";
import { initDB } from "./DB/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let db = await initDB();
app.locals.db = db;

app.use("/question", llmRoute);
app.use("/auth", authRoutes);
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`Mouadh in the back saying hi on port 3000`);
});
