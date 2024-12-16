import express from "express";
import axios from "axios";
import 'dotenv/config'


const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}



app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));



var conversion_rates;
var lastUpdateRates;

function Country (countryCode, currencyCode, currencyName, currencySymbol, borders=[]) {
  this.countryCode = countryCode;
  this.currencyCode = currencyCode;
  this.currencyName = currencyName;
  this.currencySymbol = currencySymbol;
  this.borders = borders;
  this.conversionRate = conversion_rates[currencyCode];
}

const globalPlayers = [];

(async () => {

  let attempts = 0;
  let maxRetries = 3;
  let delay = 2000;

  while (attempts < maxRetries) {
    try {
      const response = await axios.get('https://v6.exchangerate-api.com/v6/'+process.env.API_KEY+'/latest/USD');
      //console.log('Exchange rates fetched successfully:', response.data);
      conversion_rates = response.data.conversion_rates;
      lastUpdateRates = response.data.time_last_update_utc;
      lastUpdateRates = lastUpdateRates.substring(0, lastUpdateRates.lastIndexOf(" "));
      globalPlayers.push(new Country("us", "USD", "United States dollar", "$"));
      globalPlayers.push(new Country("eu", "EUR", "Euro", "€"));
      globalPlayers.push(new Country("jp", "JPY", "Japanese yen", "¥"));
      globalPlayers.push(new Country("gb", "GBP", "British pound", "£"));
      globalPlayers.push(new Country("cn", "CNY", "Chinese yuan", "¥"));
      return; // Return the fetched data
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error.message);

      if (attempts < maxRetries) {
        console.log(`Retrying in ${delay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        console.error('All attempts failed. Could not fetch exchange rates.');
        return null; // Return null or fallback data
      }
    }
  }

})();






var neighbors = [];
var homeCountry;


async function makeCountryFrom(id, idType) {

  try {
    if (idType==="country code") {
      const response = await axios.get("https://restcountries.com/v3.1/alpha/"+id);
      const country = response.data;
      const countryCode = country[0].cca2.toLowerCase();
      const currencyCode = Object.keys(country[0].currencies)[0];
      const borders = country[0].borders;
      const currencyName = country[0].currencies[currencyCode].name;
      const currencySymbol = country[0].currencies[currencyCode].symbol;
      return new Country(countryCode, currencyCode, currencyName, currencySymbol, borders );
    }
    else if (idType==="country name") {
      const response = await axios.get("https://restcountries.com/v3.1/name/"+id);
      const country = response.data;
      const currencyCode = Object.keys(country[0].currencies)[0];
      const countryCode = country[0].cca2.toLowerCase();
      const borders = country[0].borders;
      const currencyName = country[0].currencies[currencyCode].name;
      const currencySymbol = country[0].currencies[currencyCode].symbol;
      return new Country(countryCode, currencyCode, currencyName, currencySymbol, borders );
    } else if (idType==="currency") {
      const response = await axios.get("https://restcountries.com/v3.1/currency/"+id);
      const country = response.data;
      const currencyCode = Object.keys(country[0].currencies)[0];
      let countryCode = country[0].cca2.toLowerCase();
      countryCode = getRepresentativeCountry(countryCode, currencyCode);

      
      const borders = country[0].borders;
      const currencyName = country[0].currencies[currencyCode].name;
      const currencySymbol = country[0].currencies[currencyCode].symbol;
      return new Country(countryCode, currencyCode, currencyName, currencySymbol, borders );
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    // choosing random global player instead
    
    var index = Math.random();
    index *= globalPlayers.length;
    index = Math.floor(index);


    return globalPlayers[index];
  }


 
}

function filterByCurrency(countries) {
  const seenCurrencies = new Set(); // Using a Set for faster lookups

  return countries.filter((country) => {
    if (seenCurrencies.has(country.currencyCode)) {
      return false; // Skip this item (filter it out)
    } else {
      seenCurrencies.add(country.currencyCode);
      return true; // Keep this item
    }
  });
}



async function deduceNeighbors (currency, neighbors, sharedCurrency) {
  // 1. make countries out of country codes
  // 2. remove those whose currency is the same as that of the home country
  // 3. end here if there are 5 or more neighbors left
  // 4. make a copy of the globalPlayers array and remove those whose currency is the same as that of the home country
  // 5. merge the neighbors and the (copied) globalPlayers arrays
  // 6. if there are more than 5 items in the array, remove from the end until you reach 5

  neighbors = neighbors.filter((neighbor) => !sharedCurrency.includes(neighbor) );
  if (neighbors.length>4) {
    neighbors.splice(4, neighbors.length-4);
  }
  for (let i= 0; i < neighbors.length; i++) {
    neighbors[i] = await makeCountryFrom(neighbors[i], "country code");
    
  }
  if (neighbors.length===4) {
    return filterByCurrency(neighbors);
  }

  let globalPlayers2 = globalPlayers.filter((player) => currency!==player.currencyCode);

  neighbors = neighbors.concat(globalPlayers2);
  if (neighbors.length>4) {
    neighbors.splice(4, neighbors.length-4);
  }

  return filterByCurrency(neighbors);

}

function getRepresentativeCountry(countryCode, currency) {
  switch (currency) {
    case "EUR":
    return "eu";  
    break;

    case "USD":
    return "us";  
    break;

    case "AUD":
    return "au";  
    break;

    case "CHF":
    return "ch";  
    break;
  
    case "DKK":
    return "dk";  
    break;

    case "GBP":
    return "gb";  
    break;

    case "INR":
    return "in";  
    break;

    case "MAD":
    return "ma";  
    break;

    case "NOK":
    return "no";  
    break;

    case "NZD":
    return "nz";  
    break;


  
    default:
      return countryCode;
      break;
  }
}


app.get("/", (req, res, next) => {
 
  req.clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  next();
}, async (req, res) => {
  
  try {
    // figuring out where the user is from
    // let mockIP = "8.8.8.8"; // USA
    // let mockIP = "24.114.32.0"; // Canada
    //  let mockIP = "101.6.6.6"; // China
    // let mockIP = "84.0.0.0"; // Hungary
    // let mockIP = "51.140.0.0"; // UK
   //  let mockIP = "203.135.0.1" //Pakistan
    // let mockIP = "1.1.1.1" //Australia
    // let mocKIP = "41.233.53.5" //Egypt
    // let mockIP = "82.81.166.1" // Israel
   //  let mockIP = "85.96.200.1" // Turkey
   //  let mockIP = "213.7.169.1" // Cyprus
     let mockIP = "81.45.8.1" //Spain
    // let mockIP = "94.242.246.24" // Luxembourg
    // let mockIP = "200.160.2.3" // Brazil

    if (req.clientIP==="::1") {
        req.clientIP = mockIP;
    }
    let response = await axios.get("https://api.country.is/"+req.clientIP);
   // let response = await axios.get("https://api.country.is/");
    let countryCode = response.data.country.toLowerCase(); // actual user's country, e.g. Croatia

     homeCountry = await makeCountryFrom(countryCode, "country code");
    //console.log(homeCountry.countryCode);

    //getting countries that share the same currency
    response = await axios.get("https://restcountries.com/v3.1/currency/"+homeCountry.currencyCode);
    const countriesWithSharedCurrency = response.data;
    for (let i = 0; i < countriesWithSharedCurrency.length; i++) {
      countriesWithSharedCurrency[i] = countriesWithSharedCurrency[i].cca3;
      
    }
    //console.log(countriesWithSharedCurrency);
   
    neighbors = await deduceNeighbors(homeCountry.currencyCode, homeCountry.borders, countriesWithSharedCurrency); //neighbors of user's actual country are sent
    
    //console.log(neighbors);

    const data = {
      homeCountry: homeCountry,
      neighbors: neighbors,

    }
    

    res.render("index.ejs", data);
    
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }

   

});


app.post("/update", async (req, res) => {
  
  try {
    let deletedNeighbors = JSON.parse(req.body.neighbors);


    neighbors = neighbors.filter((neighbor, index) => !deletedNeighbors.includes(index.toString()));

    homeCountry = await makeCountryFrom(req.body.id, req.body.idType);
    const data = {
      homeCountry: homeCountry,
      neighbors: neighbors,

    }
    res.render("index.ejs", data);
    
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }


});


app.post("/add", async (req, res) => {
  
  try {

    let deletedNeighbors = JSON.parse(req.body.neighbors);
    neighbors = neighbors.filter((neighbor, index) => !deletedNeighbors.includes(index.toString()));

    neighbors.push( await makeCountryFrom(req.body.id, req.body.idType));
    const data = {
      homeCountry: homeCountry,
      neighbors: neighbors,

      
    }
    res.render("index.ejs", data);
    
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", {
      error: error.message,
    });
  }


});



app.get("/about", async (req, res) => {
  const data = {
    lastUpdate: lastUpdateRates,
  }
res.render("about.ejs", data);
    
 });


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



