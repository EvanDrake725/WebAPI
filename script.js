 const API_URL = "https://www.xenoserieswiki.org/w/api.php?action=parse&page=Rex&prop=wikitext&format=json";
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
 const response = await fetch(API_URL + encodeURIComponent(query));
 const data = await response.json();

 if (!data.meals) {
 showMessage(`No characters named "${query}".`);
 return;
 }

 characterContainer.textContent = "";
 data.meals.forEach((meal) => {
 const characterDiv = document.createElement("div");
 characterDiv.classList.add("character");

 const image = document.createElement("img");
 image.src = meal.strMealThumb;
 image.alt = meal.strMeal;

 const title = document.createElement("h3");
 title.textContent = meal.strMeal;

 const area = document.createElement("p");
 area.textContent = meal.strArea;

 const category = document.createElement("p");
 category.textContent = meal.strCategory;

 characterDiv.append(image, title, area, category);
 characterContainer.appendChild(characterDiv);
 });
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