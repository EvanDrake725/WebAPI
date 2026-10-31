const API_URL = "https://www.xenoserieswiki.org/w/api.php";
const searchBox = document.getElementById("search-box");
const searchButton = document.getElementById("search-button");
const characterContainer = document.getElementById("characters");
const showMessage = (text) => {
    const heading = document.createElement("h2");
    heading.textContent = text;
    characterContainer.textContent = "";
    characterContainer.appendChild(heading);
};
const fetchCharacters = async (query) => {
    showMessage("Fetching Characters...");
    try {
        const params = new URLSearchParams({
            action: "query",
            list: "categorymembers",
            cmtitle: "Category:Characters_(XC2)",
            cmlimit: "500",
            format: "json",
            origin: "*"
        });
        const response = await fetch(`${API_URL}?${params}`);
        const data = await response.json();
        if (!response.ok) {
            throw new Error("Unable to connect to the wiki.");
        }
        if (!data.query || !data.query.categorymembers) {
            showMessage("Could not retrieve characters.");
            return;
        }
        const character = data.query.categorymembers.find(
            (item) => item.title.toLowerCase() === query.toLowerCase()
        );
        if (!character) {
            showMessage(`No character found named "${query}".`);
            return;
        }
        const pageParams = new URLSearchParams({
            action: "parse",
            page: character.title,
            prop: "wikitext",
            format: "json",
            origin: "*"
        });
        const pageResponse = await fetch(`${API_URL}?${pageParams}`);
        const pageData = await pageResponse.json();
        if (!pageResponse.ok || !pageData.parse) {
            throw new Error("Unable to retrieve character portrait.");
        }
        const wikitext = pageData.parse.wikitext["*"];
        const imageMatch = wikitext.match(/^\s*\|image\s*=\s*([^\n|]+)/im);
        characterContainer.textContent = "";
        const characterDiv = document.createElement("div");
        characterDiv.classList.add("character");
        if (imageMatch) {
            const image = document.createElement("img");
            image.src = "https://www.xenoserieswiki.org/wiki/Special:FilePath/" + encodeURIComponent(imageMatch[1].trim());
            image.alt = character.title;
            image.classList.add("character-image");
            characterDiv.appendChild(image);
        }
        const title = document.createElement("h3");
        title.textContent = character.title;
        characterDiv.append(title);
        characterContainer.appendChild(characterDiv);
    } catch (error) {
        showMessage(`Error: ${error.message}`);
    }
};
searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        showMessage("Please type a character to search for.");
        return;
    }
    fetchCharacters(searchInput);
});