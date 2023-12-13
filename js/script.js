// Local storage restaraunt parameters
function saveToLocalStorage(){
    let cuisine = document.querySelector(".dropDownCuisine").value;
    localStorage.setItem("cuisine", cuisine)
  
    let price = document.querySelector(".dropDownPrice").value;
    localStorage.setItem("price", price);
  
    let proximity = document.querySelector(".dropDownProximity").value;
    localStorage.setItem("proximity", proximity);

    localStorage.setItem("quantity", 5)
}

// setting API key from input
function setKey(){
    console.log("setAPIKey");
    let APIInput = document.querySelector("#inputAPI").value;
    localStorage.setItem("APIKey", APIInput);
}

// generating random restaurant
function randomRestaurant(){
    setKey();
    const cuisines = ['japanese_restaurant', 'mexican_restaurant', 'chinese_restaurant', 'indian_restaurant', 'thai_restaurant'];
    const randomIndex = Math.floor(Math.random() * cuisines.length);

    let cuisine = cuisines[randomIndex];
    localStorage.setItem("cuisine", cuisine)
  
    let price = "PRICE_LEVEL_EXPENSIVE";
    localStorage.setItem("price", price);
  
    let proximity = 4800;
    localStorage.setItem("proximity", proximity);

    localStorage.setItem("quantity", 1)
}

// retrieving local storage restaurant search parameters
retrieveFromLocalStorage();

function retrieveFromLocalStorage(){
    let apiCuisine = localStorage.getItem("cuisine");
    let apiPrice = localStorage.getItem("price");
    let apiProximity = localStorage.getItem("proximity");
    let APIKey = localStorage.getItem("APIKey");
    let quantity = localStorage.getItem("quantity");
    getData(APIKey, apiCuisine, apiPrice, apiProximity, quantity);
}

let API_KEY = null;

// API call
async function getData(APIKey, apiCuisine, apiPrice, apiProximity, quantity) {
  let API_KEY = APIKey;
  let num_locations = quantity;
  const priceMap = {"PRICE_LEVEL_INEXPENSIVE": '$', "PRICE_LEVEL_MODERATE": '$$', "PRICE_LEVEL_EXPENSIVE": '$$$', "PRICE_LEVEL_VERY_EXPENSIVE": '$$$$', "unknown":"unknown"};
  radius = 5000;
  let response = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
      method: "POST",
      body: JSON.stringify({
          "includedTypes": [apiCuisine],
          "maxResultCount": num_locations,
          "rankPreference": "DISTANCE",
          "locationRestriction": {
              "circle": {
                  "center": {
                      "latitude": 40.4450763,
                      "longitude": -79.9483322
                  },
                  "radius": apiProximity
              }
          }
      }),
      headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask": "*",
      }
  });

  const result = await response.json();
  console.log(result['places']);
  const options = [];

  //   Pushing API call into HTML
  for (let i = 0; i < result.places.length; i++) {
        let place = result.places[i];
        let address = place.addressComponents;
        let addressString = address[0].longText + " " + address[1].longText + " " + address[3].longText + ", " + address[5].longText + " ";
        let reviews = place.reviews;
        let avgRating = 0;
        for (let j = 0; j < reviews.length; j++) {
            avgRating += reviews[j].rating;
        }
        avgRating /= reviews.length;
        let website = place.websiteUri;


        try {
            apiPrice = place.priceLevel;
        } catch {
            apiPrice = "unknown";
        }
        options.push({ name: place.displayName.text, avgRating: avgRating, location: addressString, price: priceMap[apiPrice], numRatings: place.userRatingCount, website: website });
  }

  console.log(options);
  displayRestaurants(options);
}

// Displaying restaurants in HTML
function displayRestaurants(restaurants) {
    const container = document.getElementById('restaurants-container');
    
    try {
      restaurants.forEach(restaurant => {
        const restaurantDiv = document.createElement('div');
        restaurantDiv.classList.add('restaurant-div');
  
        const restaurantLink = document.createElement('a');
        restaurantLink.href = restaurant.website;
        restaurantLink.target = "_blank"; // Open in a new tab
  
        restaurantLink.innerHTML = `
            <h2 class = "restaurantName">${restaurant.name}</h2>
            <p class ="restaurantLocation"><strong>Location:</strong> ${restaurant.location}</p>
            <p class ="restaurantRating"><strong>Average Rating:</strong> ${restaurant.avgRating}</p>
            <p class ="restaurantPrice"><strong>Price:</strong> ${restaurant.price}</p>
            <p class ="restaurantTotalRating"><strong>Total Ratings:</strong> ${restaurant.numRatings}</p>
            <hr>`;
  
        restaurantDiv.appendChild(restaurantLink);
        container.appendChild(restaurantDiv);
      });
    } catch{}
  }

// random cusine generator
function getRandomCuisine() {
    const cuisines = ['japanese_restaurant', 'mexican_restaurant', 'chinese_restaurant', 'indian_restaurant', 'thai_restaurant'];
    const randomIndex = Math.floor(Math.random() * cuisines.length);
    return cuisines[randomIndex];
  }