
const API_URL = "https://www.xenoserieswiki.org/w/api.php";

const searchBox = document.getElementById("search-box");
const searchButton = document.getElementById("search-button");
const characterContainer = document.getElementById("characters");

// Display messages
const showMessage = (message) => {
    characterContainer.innerHTML = "";

    const heading = document.createElement("h2");
    heading.textContent = message;

    characterContainer.appendChild(heading);
};

// Search for a character
const fetchCharacters = async (query) => {

    showMessage("Searching for character...");

    try {
        const params = new URLSearchParams({
            action: "query",
            generator: "categorymembers",
            gcmtitle: "Category:Characters_(XC2)",
            gcmtype: "page",
            gcmlimit: "500",
            prop: "extracts|pageimages",
            exintro: "true",
            explaintext: "true",
            exchars: "500",
            piprop: "thumbnail",
            pithumbsize: "500",
            format: "json",
            origin: "*"
        });

        const response = await fetch(`${API_URL}?${params}`);

        if (!response.ok) {
            throw new Error("Unable to connect to the wiki.");
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.info);
        }

        if (!data.query || !data.query.pages) {
            showMessage("No characters found.");
            return;
        }

        const characters = Object.values(data.query.pages);

        // Find matching character
        const searchResults = characters.filter(character =>
            character.title.toLowerCase() === query.toLowerCase()
        );

        if (searchResults.length === 0) {
            showMessage(`No character found named "${query}".`);
            return;
        }

        // Display matching character
        displayCharacters(searchResults);

    } catch (error) {
        showMessage(`Error: ${error.message}`);
    }
};

// Display character information
const displayCharacters = (characters) => {

    characterContainer.innerHTML = "";

    characters.forEach(character => {

        const characterDiv = document.createElement("div");
        characterDiv.classList.add("character");

        // Character portrait
        const image = document.createElement("img");

        image.classList.add("character-image");
        image.alt = character.title;

        if (character.thumbnail && character.thumbnail.source) {
            image.src = character.thumbnail.source;
            image.style.display = "block";
        } else {
            image.alt = "No portrait available";
            image.src = "placeholder.png";
        }

        // Character name
        const title = document.createElement("h3");
        title.textContent = character.title;

        // Character description
        const description = document.createElement("p");
        description.textContent =
            character.extract || "No description available.";

        characterDiv.append(image, title, description);

        characterContainer.appendChild(characterDiv);
    });
};

// Search button
searchButton.addEventListener("click", (e) => {
    e.preventDefault();

    const query = searchBox.value.trim();

    if (!query) {
        showMessage("Please enter a character name!");
        return;
    }

    fetchCharacters(query);
});

// Allow Enter key to search
searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchButton.click();
    }
});
