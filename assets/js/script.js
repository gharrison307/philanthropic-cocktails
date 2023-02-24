// Variable Declarations

var previousCocktails = JSON.parse(localStorage.getItem("cocktails")) || [];
var savedDrinks = document.getElementById("savedDrinks");
var producedDrink = /reference pointing to drink suggestion/;

function fetchCocktails() {}

function fetchDonatios() {}

function saveLocalData() {}

function displayLocalData() {}

function drinkHistory() {
  var searchResult = producedDrink.value.trim().toLowerCase();
  console.log(previousCocktails.indexOf(searchResult));
  console.log(searchResult);

  if (searchResult === "") {
    return;
  } else if (previousCocktails.indexOf(searchResult) >= 0) {
    return;
  } else {
    previousCocktails.push(searchResult);
    localStorage.setItem("cocktails", JSON.stringify(previousCocktails));
    previousCocktails = JSON.parse(localStorage.getItem("cocktails"));
    savedDrinks.textContent = "";

    for (i = 0; i < previousCocktails.length; i++) {
      var addedDrink = document.createElement("button");
      addedDrink.textContent = previousCocktails[i];
      addedDrink.className = "savedDrinks";
      savedDrinks.appendChild(addedDrink);
    }
  }
}
