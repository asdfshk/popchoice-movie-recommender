const form = document.getElementById("movieForm");
const resultCard = document.getElementById("resultCard");
const resultTitle = document.getElementById("resultTitle");
const resultDescription = document.getElementById("resultDescription");
const goAgainBtn = document.getElementById("goAgainBtn");
const loader = document.getElementById("loader");
const hero = document.querySelector(".hero"); 

function start() {
  form.addEventListener("submit", handleUserQuery);
  goAgainBtn.addEventListener("click", () => {
  form.reset();
  resultCard.classList.add("hidden");
  loader.classList.add("hidden");   
  hero.classList.remove("hidden");  
  form.classList.remove("hidden");
});
}

async function handleUserQuery(e) {
  e.preventDefault();

  const favoriteMovie = document.getElementById("favoriteMovie").value;
  const movieEra = document.getElementById("movieEra").value;
  const movieTone = document.getElementById("movieTone").value;

  const userPrompt = `A ${movieTone} movie similar to ${favoriteMovie} from the ${movieEra} era.`;

  
  form.classList.add("hidden");
  hero.classList.add("hidden");
  loader.classList.remove("hidden");

  try {
    const response = await fetch("http://localhost:3001/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userPrompt }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    const userResponse = data.finalResponse;  

    resultTitle.textContent = userResponse.title;
    resultDescription.textContent = userResponse.description;

  
    loader.classList.add("hidden");
    resultCard.classList.remove("hidden");

    form.classList.add("hidden");

    resultCard.classList.remove("hidden");

  } catch (error) {
    console.error(error);
    loader.classList.add("hidden");
    resultCard.classList.remove("hidden");
    resultTitle.textContent = "Error";
    resultDescription.textContent = "Sorry, I can't access what I need right now. Please try again in a bit.";
  }
}

start();
