// debugger
const searchResults = document.getElementById("search-results");

document.addEventListener("DOMContentLoaded", function () {
  const includeHTML = (el, url) => {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        el.innerHTML = data;
      })
      .catch((err) => console.log(err));
  };

  includeHTML(document.getElementById("header"), "header.html");
  includeHTML(document.getElementById("aside"), "aside.html");
  includeHTML(document.getElementById("footer"), "footer.html");
});


document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("contact-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("uname");
    const email = formData.get("email");
    const message = formData.get("message");
    alert(`Hello ${name}! Thank you for submitting your email: ${email} and Your message: ${message}`);
    form.reset();
  });
});


// Prétraitement des données
function preprocessData(data) {
  return data.countries.flatMap((country) =>
    country.cities.map((city) => ({
      ...city,
      country: country.name,
    }))
  );
}

// transforme les données en un tableau d'objets
 const preprocessTemples = data  => {
  return data.temples.map(temple => ({
    ...temple,
    temple_key: "temple, temples, Temple, Temples, TEMPLES, templs, templez, temple , temples , temple, temples,",
  }));
 }

 const preprocessBeaches = data  => {
  return data.beaches.map(beach => ({
    ...beach,
    beach_key: "beach, beaches, Beach, Beaches, BEACHES, beech, beeches, beech, beeches,",
  }));
 }

  const combineData = data => {
    return [...preprocessData(data),...preprocessTemples(data), ...preprocessBeaches(data)];
  }

// Création de l'index de recherche
function createSearchIndex(data) {
  const options = {
    keys: ["name", "description", "country", "temple_key", "beach_key"],
    threshold: 0.3, // Ajuster selon le niveau de tolérance souhaité
  };
  return new Fuse(combineData(data), options);
}

// Recherche par mots-clés
function searchByKeyword(index, keyword) {
  return index.search(keyword).map((result) => result.item);
}

async function fetchTravelData() {
  try {
    const response = await fetch("travel_recommendation_api.json");
    const data = await response.json();
    console.log("Data preprocess:", combineData(data));
    return data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

function displayTravelResults(results) {
  const searchResults = document.getElementById("search-results");
  searchResults.innerHTML = results
    .map(
      (result) => `
        <div class="search-result">
          <span>Current Local Time (${result.timeZone}) ${new Date().toLocaleTimeString('en-Us',  { timeZone : result.timeZone})}</span>
          <img src="${result.imageUrl}" alt="${result.name}" />
          <h2>${result.name}</h2>
          <p>${result.description}</p>
          <a href="https://www.google.com/search?q=${result.name}" target="_blank">Visit</a>
        </div>
      `
    )
    .join("");
}

function validateInput(input) {
  const forbiddenCharacters = /[<>;{}[\]()!@#$%^&*=+|\\/?~"'`:,.\d]/; // Caractères spéciaux et chiffres interdits
  const maxLength = 10;

  if (forbiddenCharacters.test(input)) {
    return {
      message: "The text contains forbidden characters or numbers.",
      isInputValid: false
    };
  }

  if (input.length > maxLength) {
    return {
      message: `The text exceeds the maximum length of ${maxLength} characters.`,
      isInputValid: false
    };
  }

  if (/\s{2,}/.test(input)) {
    return {
      message: "The text contains multiple consecutive spaces.",
      isInputValid: false
    };
  }

  return {
    message: "The text is valid.",
    isInputValid: true
  };
}

function fetchAndDisplayTravelDestination() {
  const searchInput = document.getElementById("search-input");

  if (!searchInput.value) {
    alert("Please enter a valid search keyword.");
    return;
  }
  const trimmedInput = searchInput.value.trim();
  // console.log("searchInput:", searchInput.value.trim());
  const validationResult = validateInput(trimmedInput);


  if (!validationResult.isInputValid) {
    alert(validationResult.message);
    searchInput.focus();
    return;
  }
  const keyword = trimmedInput;

  fetchTravelData()
    .then((data) => {
      const index = createSearchIndex(data);
      const results = searchByKeyword(index, keyword);
      displayTravelResults(results);
    })
    .catch((err) => {
      console.error("Error:", err);
      alert("An error occurred while fetching data.");
    });
}

function clearResults() {
  searchResults.innerHTML = "";
}











