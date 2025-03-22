import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/upload", (async (req, res): Promise<void> => {
  const problem = req.body;

  if (!problem || !problem.title || !problem.solution) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  const { data, error } = await supabase.from("leetdoc").insert([problem]);

  if (error) {
    console.error("❌ Supabase insert error:", error);
    res.status(500).json({ error: "Failed to upload problem." });
    return;
  }

  console.log(`✅ Uploaded: ${problem.title}`);
  res.json({ success: true, data });
}) as express.RequestHandler);

// ✅ START THE SERVER
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
