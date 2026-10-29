# PopChoice — AI Movie Recommender

A playful movie-recommendation web app. The user answers three questions (favourite movie, era preference, tone), and the app returns a single tailored pick using Gemini + vector search over a small movie database stored in Supabase.

## How it works

1. **Ingest** — `content.js` holds a small hand-curated movie dataset. Each movie's `content` field is embedded with Gemini's `gemini-embedding-001` model and inserted into Supabase (`movies` table with a `pgvector` column).
2. **Query** — On submit, the user prompt is embedded the same way, then `supabase.rpc("match_documents", …)` returns the top-1 match above a cosine-similarity threshold.
3. **Format** — Gemini `gemini-3-flash-preview` is called *only* to format the retrieved movie into a `{title, description}` JSON response — it is explicitly prompted **not** to invent movies.
4. **Render** — The UI swaps the form for a result card with title + description and a "Go Again" button.

## Tech stack

- **Frontend:** Vite, vanilla JS, CSS
- **Backend:** Node.js + Express 5
- **AI / DB:** `@google/genai` (Gemini) + `@supabase/supabase-js` with `pgvector`

## Getting started

### 1. Install

```bash
npm install
```

### 2. Configure environment

Create a `.env` in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://<your-project>.supabase.co
SUPABASE_API_KEY=your_supabase_service_role_or_anon_key
PORT=3001
```

### 3. Supabase setup

In your Supabase project:

1. Enable the **`vector`** extension.
2. Create a `movies` table with at least `content text`, `embedding vector(768)` (or whatever dim your embedding model returns).
3. Create a `match_documents` RPC that accepts `query_embedding`, `match_count`, `match_threshold` and returns the closest rows by cosine similarity.
4. Run an ingestion step (once) that embeds each entry from `content.js` and inserts it into the table.

### 4. Run

```bash
# terminal 1
npm run server    # (if defined) or: node server.js
# terminal 2
npm start
```

## Project structure

```
popchoice movie/
├── index.html        # UI: form + loader + result card
├── index.css
├── index.js          # form handling, loader, result rendering
├── server.js         # /search endpoint: embed → match → format
├── config.js         # Gemini + Supabase client initialisation
├── content.js        # Source movie data
├── search.js         # Client-side search helper
├── movies.txt        # Raw movie blurbs
├── vite.config.js
└── package.json
```
