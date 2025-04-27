import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/llm", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.LLM_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("OpenRouter error:", err.response?.data || err.message);
    console.error("Status code:", err.response?.status);
    res.status(500).json({ error: err.message });
  }
});

export default router;
