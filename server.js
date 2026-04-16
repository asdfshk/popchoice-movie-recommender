import express from "express";
import cors from "cors";
import "dotenv/config";
import { gemini, supabase } from './config.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/search", async (req, res) => {
  const { userPrompt } = req.body;

  try {
    const embeddingResponse = await gemini.models.embedContent({
      model: "gemini-embedding-001",
      contents: userPrompt,
    });

    const queryEmbedding = embeddingResponse.embeddings[0].values;

    const { data, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_count: 1,
      match_threshold: 0.5,
    });

    if (error) {
      console.error("RPC error:", error);
      return res.status(500).json({ message: "Database search failed." });
    }

    const result = data && data.length > 0 ? JSON.stringify(data) : "No matching movies found.";

    const prompt = `
  You are a movie recommender. Your ONLY job is to format the provided movie data into a response.

  STRICT RULES:
  - You MUST only use information from the "Provided movie data" below
  - Do NOT use your own knowledge or suggest movies not in the provided data
  - If the provided data says "No matching movies found", respond with:
    { "title": "No Match Found", "description": "We couldn't find a movie matching your preferences." }
  - Do NOT invent, guess, or fill in any details not present in the data

  Respond ONLY with a valid JSON object in this exact format, no extra text:
  {
    "title": "Movie Title (Year)",
    "description": "A short engaging description of why this movie matches the user's preferences."
  }

  User query: ${userPrompt}
  Provided movie data: ${result}
`;


    const geminiResponse = await gemini.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const raw = geminiResponse.text.trim();
    const parsed = JSON.parse(raw);  

    res.json({ finalResponse: parsed });  

  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong on the server." });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
