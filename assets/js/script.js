//Variable Declarations
var previousCocktails = JSON.parse(localStorage.getItem("cocktails")) || [];
var savedDrinks = document.getElementById("savedDrinks");
var producedDrink = /reference pointing to drink suggestion/;

var mainAreaEL = document.getElementById('body-area');

//Modal elements
var modalInput = document.getElementById("text-cause");
var modalSearch = document.getElementById("search-cause");
var nonprofitList = document.getElementById("nonprofit-list");

//functions

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
    var APIkey="pk_live_8a72071c11204646a37b2520e4194dad";
    var requestURL = "https://partners.every.org/v0.2/search/" + cause + "?apiKey=" +APIkey;
    fetch(requestURL)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        
        var orderedList = document.createElement('ol');
        orderedList.setAttribute("class", "list-group list-group-numbered w-100 p-3");
        nonprofitList.append(orderedList);
        for (let index = 0; index < data.nonprofits.length; index++) {
            var li = document.createElement("li");
            li.setAttribute("class", "list-group-item d-flex justify-content-between align-items-start");
            orderedList.append(li);

            //Name and description container
            var contentDiv = document.createElement("div");
            contentDiv.setAttribute("class", "ms-2 me-auto");

            //Cooktail Name
            var subheading = document.createElement("div");
            subheading.textContent = data.nonprofits[index].name;
            subheading.setAttribute("class", "fs-5 fw-bolder");
            contentDiv.appendChild(subheading);

            //image
            var image = document.createElement("img");
            image.setAttribute("src", data.nonprofits[index].logoUrl);
            image.setAttribute("class", "img-thumbnail rounded-4 border border-secondary");
            image.style = "width: 50px; height: 50px;";

            //Description
            var desciption = document.createElement("p");
            desciption.setAttribute("class", "fst-italic");
            desciption.textContent = data.nonprofits[index].description;
            contentDiv.appendChild(desciption);

            //last append
            li.append(contentDiv, image);
        }

    })
}

modalSearch.addEventListener("click", function(){
    if (modalInput.value != null) {
        removeElements(nonprofitList);
        fetchDonatios(modalInput.value); 
    } else {
        window.alert("Please eneter a cause you would like to support");
    }
})

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

//Display a list of cocktails
async function listCocktails(data, endpoint) {

    var orderedList = document.createElement('ol');
    orderedList.setAttribute("class", "list-group list-group-numbered w-100 p-3");
    mainAreaEL.append(orderedList);

    for (let index = 0; index < data.drinks.length; index++) {
        var li = document.createElement("li");
        li.setAttribute("class", "list-group-item d-flex justify-content-between align-items-start");
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
        image.setAttribute("class", "img-thumbnail rounded-5 border border-secondary");
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
                    description.textContent = customTrim(newdata.drinks[0].strInstructions);
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
    ingredientSummary = ingredientSummary.substring(0, ingredientSummary.lastIndexOf(","));
    return ingredientSummary + ".";
}

//Custom trim to fit text in the list
function customTrim(description) {
    if (description.length > 95) {
        description = description.substring(0, 95) + "...";
    }
    return description;
}

window.addEventListener("load",function(){
    setTimeout(function open(event){
        document.querySelector(".popup").style.display = "block";
    },2000)
});

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
      removeElements(mainAreaEL);
      listCocktails(data,endPoint);
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

//Age popup modal
window.addEventListener("load", function () {
  setTimeout(function open(event) {
    document.querySelector(".popup").style.display = "block";
  }, 2000);
});

document.querySelector("#close").addEventListener("click", function () {
  document.querySelector(".popup").style.display = "none";
});
