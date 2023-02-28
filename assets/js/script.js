//=================================================================== Variable Declarations ======================================================================================================
var previousCocktails = JSON.parse(localStorage.getItem("cocktails")) || [];
var savedDrinks = document.getElementById("savedDrinks");
var producedDrink = /reference pointing to drink suggestion/;
var ingredients = document.getElementById("ingredients");
var drinkImg = document.getElementById("drinkImg");
var mainEl = document.getElementById("body-area");
var addedDrink;
var searchBar = document.getElementById("selections");
var searchButton = document.getElementById("searchBtn");
var optionOne = document.getElementById("option-one");
var optionTwo = document.getElementById("option-two");

//Nonprofit modal elements
var modalInput = document.getElementById("text-cause");
var modalSearch = document.getElementById("search-cause");
var nonprofitList = document.getElementById("nonprofit-list");

//========================================================================== FUNCTIONS ===========================================================================================================
/*
    Function to fetch and return the cocktail data
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

/* 
    Function to fetch the donation information and display it in the modal
    Accepting parameters:
    - cause : string

    Example: fetchDonations("climate")
*/
function fetchDonatios(cause) {
  var APIkey = "pk_live_8a72071c11204646a37b2520e4194dad";
  var requestURL =
    "https://partners.every.org/v0.2/search/" + cause + "?apiKey=" + APIkey;
  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      var orderedList = document.createElement("ol");
      orderedList.setAttribute(
        "class",
        "list-group list-group-numbered w-100 p-3"
      );
      nonprofitList.append(orderedList);
      for (let index = 0; index < data.nonprofits.length; index++) {
        var li = document.createElement("li");
        li.setAttribute(
          "class",
          "list-group-item d-flex justify-content-between align-items-start hover-action"
        );
        li.style = "background-color: var(--medium-light)";
        orderedList.append(li);

        //Name and description container
        var contentDiv = document.createElement("div");
        contentDiv.setAttribute("class", "ms-2 me-auto");

        //Cooktail Name
        var subheading = document.createElement("a");
        subheading.textContent = data.nonprofits[index].name;
        subheading.setAttribute("class", "fs-6 fw-bolder");
        subheading.setAttribute("href", data.nonprofits[index].profileUrl);
        subheading.setAttribute("target", "_blank");
        contentDiv.appendChild(subheading);

        //image
        var image = document.createElement("img");
        image.setAttribute("src", data.nonprofits[index].logoUrl);
        image.setAttribute(
          "class",
          "img-thumbnail rounded-4 border border-secondary"
        );
        image.style = "width: 50px; height: 50px;";

        //Description
        var desciption = document.createElement("p");
        desciption.style = "font-size: 13px";
        desciption.textContent = data.nonprofits[index].description;
        contentDiv.appendChild(desciption);

        //last append
        li.append(contentDiv, image);
      }
    });
}

// Event listener for the search button inside the Nonprofit search modal
modalSearch.addEventListener("click", function () {
  if (modalInput.value != null) {
    removeElements(nonprofitList);
    fetchDonatios(modalInput.value);
  } else {
    window.alert("Please eneter a cause you would like to support");
  }
});

// <--------DRINK STORAGE FUNCTION--------------->
function drinkStorage(cocktailName) {
  var searchResult = cocktailName.toLowerCase();
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

    console.log(previousCocktails.length);
    drinkHistory();
  }
}

// <--------DISPLAY DRINK HISTORY FUNCTION--------------->
function drinkHistory() {
  for (i = 0; i < previousCocktails.length; i++) {
    var addedDrink = document.createElement("button");
    addedDrink.setAttribute(
      "onclick",
      'displayDrinkByName("' + previousCocktails[i] + '");'
    );
    addedDrink.textContent = previousCocktails[i];
    addedDrink.className = "savedDrinks";
    savedDrinks.appendChild(addedDrink);
    console.log(addedDrink);
  }
}

//Display a list of cocktails
async function listCocktails(data, endpoint) {
  var orderedList = document.createElement("ol");
  orderedList.setAttribute("class", "list-group list-group-numbered w-100 p-3");
  mainEl.append(orderedList);

  for (let index = 0; index < data.drinks.length; index++) {
    var li = document.createElement("li");
    li.setAttribute(
      "class",
      "list-group-item d-flex justify-content-between align-items-start hover-action"
    );
    li.setAttribute(
      "onclick",
      "displayDrinkById(" + data.drinks[index].idDrink + ");"
    );
    orderedList.append(li);

    //Name and description container
    var contentDiv = document.createElement("div");
    contentDiv.setAttribute("class", "ms-2 me-auto");

    //Cooktail Name
    var subheading = document.createElement("div");
    subheading.textContent = data.drinks[index].strDrink;
    subheading.setAttribute("class", "fs-4 fw-bold");
    contentDiv.appendChild(subheading);

    //image
    var image = document.createElement("img");
    image.setAttribute("src", data.drinks[index].strDrinkThumb);
    image.setAttribute("alt", data.drinks[index].strDrink);
    image.setAttribute(
      "class",
      "img-thumbnail rounded-5 border border-secondary"
    );
    image.style = "width: 100px; height: 100px;";

    //Description & Ingredients
    var ingredientSummary = document.createElement("span");
    ingredientSummary.setAttribute("class", "fst-italic fw-semibold");
    var description = document.createElement("p");

    // fetch data by cooktail id if previously not available
    if (endpoint === "filter") {
      await fetchCocktails("lookup", "i", data.drinks[index].idDrink)
        .then(function (response) {
          return response.json();
        })
        .then(function (newdata) {
          ingredientSummary.textContent = sumIngredients(newdata);
          description.textContent = customTrim(
            newdata.drinks[0].strInstructions
          );
          contentDiv.append(ingredientSummary, description);
          li.append(contentDiv, image);
        });
    } else {
      ingredientSummary.textContent = sumIngredients(data);
      description.textContent = customTrim(data.drinks[index].strInstructions);
      contentDiv.append(ingredientSummary, description);
      li.append(contentDiv, image);
    }
  }
}

//remove existing child elements - just pass in the parent element.
function removeElements(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

//Sum the ingredients in one string to display in the list.
function sumIngredients(data) {
  var ingredientSummary = "";
  var i = 1;
  while (data.drinks[0]["strIngredient" + i] != null) {
    ingredientSummary += data.drinks[0]["strIngredient" + i] + ", ";
    i++;
  }
  ingredientSummary = ingredientSummary.substring(
    0,
    ingredientSummary.lastIndexOf(",")
  );
  return ingredientSummary + ".";
}

//Custom trim to fit text in the list
function customTrim(description) {
  if (description.length > 120) {
    description = description.substring(0, 120) + "...";
  }
  return description;
}

// <--------LARGE DISPLAY FUNCTION--------------->
function largeDisplay(data) {
  //  Large Display Card
  var div1 = document.createElement("div");
  div1.setAttribute("class", "card mb-3");
  div1.setAttribute("style", "max-width: 100% largeDisplay");
  div1.setAttribute("style", "opacity: 1");
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

  //   Drink Title Element
  var drinkNameEl = document.createElement("h3");
  drinkNameEl.setAttribute("class", "card-title largeDisplay");
  drinkNameEl.setAttribute("style", "text-decoration: underline");
  div4.appendChild(drinkNameEl);

  //   Drink Ingredients Element
  var ingredientsEl = document.createElement("ul");
  ingredientsEl.setAttribute("class", "card-text");
  div4.appendChild(ingredientsEl);

  // Drink Instructions Element
  var drinkDescriptionEl = document.createElement("p");
  div4.appendChild(drinkDescriptionEl);

  divImg = document.createElement("div");
  divImg.setAttribute("class", "col-md-6");
  div2.appendChild(divImg);

  //   Drink Image Element
  var drinkImgEl = document.createElement("img");
  drinkImgEl.setAttribute("class", "img-fluid rounded");
  divImg.appendChild(drinkImgEl);

  // Drink Name
  console.log(data.drinks[0].strDrink);
  drinkNameEl.textContent = data.drinks[0].strDrink;

  //   Ingredients
  var ingredientsList = document.createElement("ul");
  ingredientsEl.appendChild(ingredientsList);

  //Runs though ingredients and stops when "null" also added measurements
  var i = 1;
  while (data.drinks[0]["strIngredient" + i] != null) {
    var listItems = document.createElement("li");
    if (data.drinks[0]["strMeasure" + i] == null) {
      listItems.textContent = data.drinks[0]["strIngredient" + i];
      ingredientsList.appendChild(listItems);
    } else {
      listItems.textContent =
        data.drinks[0]["strMeasure" + i] + data.drinks[0]["strIngredient" + i];
      ingredientsList.appendChild(listItems);
    }
    i++;
  }

  // Drink Image
  drinkImgEl.setAttribute("src", data.drinks[0].strDrinkThumb);
  console.log(data.drinks[0].strDrinkThumb);

  //Drink Instructions
  drinkDescriptionEl.textContent =
    "Instructions: " + data.drinks[0].strInstructions;

  drinkStorage(data.drinks[0].strDrink, data.drinks[0].idDrink);
}

searchButton.addEventListener("click", function () {
  if (searchBar.value != "") {
    search(searchBar.dataset.search, searchBar.value);
  } else {
    selections.setAttribute("style", "border: solid red 3px");
    setTimeout(function () {
      selections.setAttribute("style", "");
    }, 1000);
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
  $("#selections").attr("placeholder", "Search by cocktail name...");
  searchBar.dataset.search = "cocktail";
});

optionTwo.addEventListener("click", function () {
  $("#selections").attr("placeholder", "Search by ingredient name...");
  searchBar.dataset.search = "ingredient";
});

searchBar.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("searchBtn").click();
  }
});

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
      removeElements(mainEl);
      listCocktails(data, endPoint);
    });
}

//DO when page ready
$(function () {
  //displaying modal
  $("#ageModal").modal("show");

  //Loading a random cocktail
  fetchCocktails("random")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      removeElements(mainEl);
      largeDisplay(data);
    });
});

//Trigered by list items
function displayDrinkById(id) {
  fetchCocktails("lookup", "i", id)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      removeElements(mainEl);
      largeDisplay(data);
    });
}

//Display drink by name
function displayDrinkByName(name) {
  fetchCocktails("search", "s", name)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      removeElements(mainEl);
      largeDisplay(data);
    });
}
