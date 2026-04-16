
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

/** OpenAI config */
if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY key is missing or invalid.");
export const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});

/** Supabase config */
const privateKey = process.env.SUPABASE_API_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_API_KEY`);
const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);
export const supabase = createClient(url, privateKey);