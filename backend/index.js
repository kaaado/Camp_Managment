import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import llmRoute from "./routes/llm.js";
import authRoutes from "./routes/auth.js";
import userRouter from "./routes/user.js";
import { initDB } from "./DB/database.js";
import campRouter from "./routes/camp.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let db = await initDB();
app.locals.db = db;

app.use("/question", llmRoute);
app.use("/auth", authRoutes);
app.use("/user", userRouter);
app.use("/camp", campRouter);

app.listen(PORT, () => {
  console.log(`Mouadh in the back saying hi on port `+PORT);
});
