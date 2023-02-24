// Variable Declarations


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

    if(endpoint === "random"){
        requestURL = baseURL + "random.php";
    }else{
        requestURL = baseURL + endpoint + ".php?" + parameter + "=" + value;
    }

    return await fetch(requestURL);
}

//example of how to call fetchCocktails
fetchCocktails("filter","i", "Gin")
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
    });

/* 
    Function to fetch the donation information
    Accepting parameters:
    - cause : string

    Example: fetchDonations("climate")
*/
function fetchDonatios(cause) {
    
}

/* 
    Save the data to local storage
*/
function saveLocalData() {}

/*
    Get data from local storage
*/
function displayLocalData() {}
