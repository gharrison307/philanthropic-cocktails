//Variable Declarations
var previousCocktails = JSON.parse(localStorage.getItem("cocktails")) || [];
var savedDrinks = document.getElementById("savedDrinks");
var producedDrink = /reference pointing to drink suggestion/;
var drinkName = document.getElementById("drinkName");
console.log(drinkName);
var ingredients = document.getElementById("ingredients");
var drinkImg = document.getElementById("drinkImg");
var mainEl = document.getElementById("body-area");

//functions

/*
    Fuction to fetch and return the cocktail data
    Accepting parameters:
    - endpoint : String - should accept one of the options: [ search, filter, random or list ]
    - parameter : String - should accept the options [s, i, f, iid, g, a, c]
    - value : String - the filer of search value to pass with parameter
*/
async function fetchCocktails(endpoint, parameter, value) {
  var baseURL = "https://www.thecocktaildb.com/api/json/v1/1/";
  var requestURL;

  if (endpoint === "random") {
    requestURL = baseURL + "random.php";
  } else {
    requestURL = baseURL + endpoint + ".php?" + parameter + "=" + value;
  }

  return await fetch(requestURL);
}

//example of how to call fetchCocktails
fetchCocktails("lookup", "i", "15300")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });

/* 
    Function to fetch the donation information
    Accepting parameters:
    - cause : string

    Example: fetchDonations("climate")
*/
function fetchDonatios(cause) {}

/* 
    Save the data to local storage
*/
function saveLocalData() {}

/*
    Get data from local storage
*/
function displayLocalData() {}

function drinkStorage() {
  var searchResult = producedDrink.toLowerCase();
  console.log(previousCocktails.indexOf(searchResult));
  console.log(searchResult);

  if (searchResult === "") {
    return;
  } else if (previousCocktails.indexOf(searchResult) >= 0) {
    drinkHistory();
    return;
  } else {
    previousCocktails.push(searchResult);
    localStorage.setItem("cocktails", JSON.stringify(previousCocktails));
    previousCocktails = JSON.parse(localStorage.getItem("cocktails"));
    savedDrinks.textContent = "";

    console.log(previousCocktails.length);
    drinkHistory();
  }
}

function drinkHistory() {
  for (i = 0; i < previousCocktails.length; i++) {
    var addedDrink = document.createElement("button");
    addedDrink.textContent = previousCocktails[i];
    addedDrink.className = "savedDrinks";
    savedDrinks.appendChild(addedDrink);
    console.log(addedDrink);
  }
}

function largeDisplay() {
  //   Large Display Card
  var div1 = document.createElement("div");
  div1.setAttribute("class", "card mb-3");
  div1.setAttribute("style", "max-width: 100% text-blue largeDisplay");
  mainEl.appendChild(div1);

  var div2 = document.createElement("div");
  div2.setAttribute("class", "row g-0 largeDisplay");
  div1.appendChild(div2);

  var div3Text = document.createElement("div");
  div3Text.setAttribute("class", "col-md-6 largeDisplay");
  div2.appendChild(div3Text);

  var div4 = document.createElement("div");
  div4.setAttribute("class", "card-body largeDisplay");
  div3Text.appendChild(div4);

  //   drink title
  var drinkNameEl = document.createElement("h3");
  drinkNameEl.setAttribute("class", "card-title largeDisplay");
  div4.appendChild(drinkNameEl);

  //   drink ingredients
  var ingredientsEl = document.createElement("ul");
  ingredientsEl.setAttribute("class", "card-text");
  div4.appendChild(ingredientsEl);

  // drink description
  var drinkDescriptionEl = document.createElement("p");
  div4.appendChild(drinkDescriptionEl);

  divImg = document.createElement("div");
  divImg.setAttribute("class", "col-md-6");
  div2.appendChild(divImg);

  var drinkImgEl = document.createElement("img");
  drinkImgEl.setAttribute("class", "img-fluid rounded");
  divImg.appendChild(drinkImgEl);

  // gets referenced drink
  //   /reference to listed drinks /.addEventListener("click", function (event) {
  //     producedDrink = event.target.innerText;
  //     console.log(producedDrink);

  //   Test variable
  producedDrink = "margarita";

  // fetching ID data on chosen drink
  fetchCocktails("search", "s", producedDrink)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      // redefinining variable as id number
      producedDrink = data.drinks[0].idDrink;
      console.log([producedDrink]);

      // fetching full drink detials based on ID
      fetchCocktails("lookup", "i", producedDrink)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);

          // Drink Name ---- unhides div and sets text content as drink name
          console.log(data.drinks[0].strDrink);
          //   document.drinkName.setAttribute("class", "shown");
          drinkNameEl.textContent = data.drinks[0].strDrink;

          //   Ingredients ---
          var ingredientsList = document.createElement("ul");
          ingredientsEl.appendChild(ingredientsList);
          // running through ingredients list and appending a child if not null. Set to run through 10 ingredients

          var i = 1;
          while (data.drinks[0]["strIngredient" + i] != null) {
            var listItems = document.createElement("li");
            listItems.textContent = data.drinks[0]["strIngredient" + i];
            console.log(ingredientsList);
            ingredientsList.appendChild(listItems);
            i++;
          }

          // Drink Image ------ adding the drink image
          drinkImgEl.setAttribute("src", data.drinks[0].strDrinkThumb);
          console.log(data.drinks[0].strDrinkThumb);

          // document.drinkName. = data.strDrinkThumb;

          //   Description
          drinkDescriptionEl.textContent = [
            "Instructions: " + data.drinks[0].strInstructions,
          ];
        });
    });
  drinkStorage();
}

largeDisplay();
