import { gemini, supabase } from './config.js';
import movies from './content.js';



async function createAndStoreEmbeddings() {
  const data = await Promise.all(
    movies.map(async (movie) => {
      const response = await gemini.models.embedContent({
        model: "gemini-embedding-001",
        contents: movie.content,
      });

      return {
        title: movie.title,
        year: movie.releaseYear,
        content: movie.content,
        embedding: response.embeddings[0].values, 
      };
    })
  );

const { error } = await supabase.from("documents").insert(data);

  if (error) {
    console.error("Insert error:", error);
  } else {
    console.log("Embeddings stored successfully!");
  }
}

createAndStoreEmbeddings();