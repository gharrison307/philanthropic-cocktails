//Variable Declarations
var previousCocktails = JSON.parse(localStorage.getItem("cocktails")) || [];
var savedDrinks = document.getElementById("savedDrinks");
var producedDrink = /reference pointing to drink suggestion/;

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
fetchCocktails("filter", "i", "Gin")
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

//Variable declarations
var searchBar = document.getElementById("selections");
var searchButton = document.getElementById("searchBtn");
var optionOne = document.getElementById("option-one");
var optionTwo = document.getElementById("option-two");

//Function to fetch cocktails based on cocktail name or ingredient
function search(type, inputText) {
  var endPoint = "";
  var parameter = "";
  if (type == "cocktail") {
    endPoint = "search";
    parameter = "s";
  } else {
    endPoint = "filter";
    parameter = "i";
  }

  fetchCocktails(endPoint, parameter, inputText)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
searchButton.addEventListener("click", function () {
  if (searchBar.value != "") {
    search(searchBar.dataset.search, searchBar.value);
  } else {
    window.alert("Please enter a ingredient or cocktail name.");
  }
});

//Change opacity of the div the user selects
var addClass = "opacity";
var change = $(".card").on("click", function () {
  change.addClass(addClass);
  $(this).removeClass(addClass);
});

//Changes placeholder text based on click
optionOne.addEventListener("click", function () {
  $("#selections").attr("placeholder", "Type to search by cocktails...");
  searchBar.dataset.search = "cocktail";
});

optionTwo.addEventListener("click", function () {
  $("#selections").attr("placeholder", "Type to search by ingredients...");
  searchBar.dataset.search = "ingredient";
});
