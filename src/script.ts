/*------ DOM ELEMENTS --------*/

const weatherText = document.getElementById("weather-text")! as HTMLElement;
const weeklyDetails = document.getElementById("weekly-details")! as HTMLElement;
const searchBtn = document.getElementById("search-btn")! as HTMLElement;
const closeBtn = document.getElementById("close-btn")! as HTMLElement;
const searchBox = document.querySelector(".search-box")! as HTMLElement;
const searchInput = document.getElementById("search-input")! as HTMLInputElement;
const searchBtnRight = document.getElementById("search-btn-right")! as HTMLButtonElement;
const arrowButton = document.getElementById("arrow-button")! as HTMLButtonElement;
const sunriseSunsetDiv = document.getElementById("sunrise-sunset")! as HTMLElement;
const weatherOverview = document.querySelector(".weather-overview")! as HTMLElement;
const weatherEffectDiv = document.getElementById("weather-effect")! as HTMLElement;


/*------ INTERFACES --------*/

interface fetchedWeatherDataFormat {
  time: string;
  intervalParametersStartTime: string;
  data: { air_temperature: number; symbol_code: number };
}
[];

interface fetchedGeoDataFormat {
  country: string;
  county: string;
  district: string;
  geonameid: number;
  lon: number;
  lat: number;
  municipality: string;
  place: string;
  population: number;
  timezone: string;
  type: string[];
}
[];

interface WeatherDataFormat {
  time: string;
  date: string;
  dayOfWeek: string;
  temperature: number;
  symbolCode: number;
  symbolMeaning: string;
  lat: number;
  lon: number;
}

interface GeoDataFormat {
  country: string;
  place: string;
  county: string;
  municipality: string;
  lat: number;
  lon: number;
  backgroundClass: string;
}

interface GroupedWeatherDataFormat {
  date: string;
  dayOfWeek: string;
  temperature: number[];
  symbolCode: number[];

}

/*------ GLOBAL VARIABLES --------*/

const weatherSymbols = [
  { id: 1, description: "Clear sky" },
  { id: 2, description: "Nearly clear sky" },
  { id: 3, description: "Variable cloudiness" },
  { id: 4, description: "Halfclear sky" },
  { id: 5, description: "Cloudy sky" },
  { id: 6, description: "Overcast" },
  { id: 7, description: "Fog" },
  { id: 8, description: "Light rain showers" },
  { id: 9, description: "Moderate rain showers" },
  { id: 10, description: "Heavy rain showers" },
  { id: 11, description: "Thunderstorm" },
  { id: 12, description: "Light sleet showers" },
  { id: 13, description: "Moderate sleet showers" },
  { id: 14, description: "Heavy sleet showers" },
  { id: 15, description: "Light snow showers" },
  { id: 16, description: "Moderate snow showers" },
  { id: 17, description: "Heavy snow showers" },
  { id: 18, description: "Light rain" },
  { id: 19, description: "Moderate rain" },
  { id: 20, description: "Heavy rain" },
  { id: 21, description: "Thunder" },
  { id: 22, description: "Light sleet" },
  { id: 23, description: "Moderate sleet" },
  { id: 24, description: "Heavy sleet" },
  { id: 25, description: "Light snowfall" },
  { id: 26, description: "Moderate snowfall" },
  { id: 27, description: "Heavy snowfall" },
];

const locations: GeoDataFormat[] = [
  {
    country: "Sverige",
    place: "Stockholm",
    county: "Stockholms län",
    municipality: "Stockholm",
    lon: 18.062639,
    lat: 59.329468,
    backgroundClass: "stockholm"
  },
  {
    country: "Sverige",
    place: "Göteborg",
    county: "Västra Götalands län",
    municipality: "Göteborg",
    lon: 11.966666,
    lat: 57.716666,
    backgroundClass: "goteborg"
  },
  {
    country: "Sverige",
    place: "Umeå",
    county: "Västerbottens län",
    municipality: "Umeå",
    lon: 20.25,
    lat: 63.833333,
    backgroundClass: "umea"
  },
];

let lon: number = 18.062639; // Stockholm
let lat: number = 59.329468; // Stockholm

let localSunriseTime: string = "";
let localSunsetTime: string = "";
let dayOrNight: string = "";

let weatherData: WeatherDataFormat;

let weatherArray: WeatherDataFormat[] = [];

let searchedLocation: GeoDataFormat;

let searchedLocations: GeoDataFormat[] = [];

let weatherArrayGroupedByDate: GroupedWeatherDataFormat[] = [];

let index = 1;



/*------ FETCH DATA --------*/


const fetchWeatherData = async () => {
  // create dynamic fetch url inside fetch function to get updated values for lon & lat
  const weatherUrl: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${lon}/lat/${lat}/data.json?timeseries=72&parameters=air_temperature,symbol_code`;

  // reset weatherArray before filling it with weather reports
  weatherArray = [];

  try {
    const response = await fetch(weatherUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // create variables for long & lat values with limit to 6 decimals
    const lon: number = Number(data.geometry.coordinates[0].toFixed(6));
    const lat: number = Number(data.geometry.coordinates[1].toFixed(6));

    const fetchedWeatherReports: fetchedWeatherDataFormat[] = data.timeSeries;

    fetchedWeatherReports.map((report: fetchedWeatherDataFormat) => {
      const symbolCode = report.data.symbol_code;
      const symbolMeaning = mapSymbolCode(symbolCode);
      const localTime = new Date(report.time).toLocaleString("sv-SE", {
        timeZone: "Europe/Stockholm",
        hour: "2-digit",
        minute: "2-digit",
      });
      const localDate = new Date(report.time).toLocaleString("sv-SE", {
        timeZone: "Europe/Stockholm",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

    // get day number from fetch and map it to a readable value in dayOfWeek
      const dayNumber: number = new Date(localDate).getDay();
      // create variable to store readable value of which day it is
      let dayOfWeek: string = "";

      const getDayOfWeekName = (dayNumber: number) => {
        if (dayNumber === 0) {
          dayOfWeek = "Sun";
        } else if (dayNumber === 1) {
          dayOfWeek = "Mon";
        } else if (dayNumber === 2) {
          dayOfWeek = "Tue";
        } else if (dayNumber === 3) {
          dayOfWeek = "Wed";
        } else if (dayNumber === 4) {
          dayOfWeek = "Thu";
        } else if (dayNumber === 5) {
          dayOfWeek = "Fri";
        } else if (dayNumber === 6) {
          dayOfWeek = "Sat";
        }
        return dayOfWeek;
      };

      getDayOfWeekName(dayNumber);

    // for every weather report object from the fetch, we create an object with the data to be pushed to weatherArray
      weatherData = {
        time: localTime,
        date: localDate,
        dayOfWeek: dayOfWeek,
        temperature: Math.round(report.data.air_temperature),
        symbolCode: symbolCode,
        symbolMeaning: symbolMeaning,
        lon: lon,
        lat: lat,
      };

      weatherArray.push(weatherData);
    });
  } catch (error) {
    console.error("Fetch error:", error);
  }
};



const fetchGeoData = async (userSearchInput: string) => {
  // create dynamic fetch url inside fetch function to get data matching the search input
  const geoUrl: string = `https://wpt-a-tst.smhi.se/backend-startpage/geo/autocomplete/places/${userSearchInput}?sweonly=true`;

  // reset to empty array
  searchedLocations = [];

  try {
    const response = await fetch(geoUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const fetchedGeoReports: fetchedGeoDataFormat[] = await response.json();

    fetchedGeoReports.map((report: fetchedGeoDataFormat) => {
    
      // for every geo result object from the fetch, we create an object with the data to be pushed to searchedLocations
      searchedLocation = {
        country: report.country,
        place: report.place,
        county: report.county,
        municipality: report.municipality,
        lat: Number(report.lat.toFixed(6)),
        lon: Number(report.lon.toFixed(6)),
        backgroundClass: "default-image"
      };

      searchedLocations.push(searchedLocation);
    });

    // call the function with the first object (index 0) from searchedLocations, since it should be the best location match
    getLocationAndCoordinates(searchedLocations, 0);
  } catch (error) {
    console.error("Fetch error:", error);
  }
};



const fetchSunData = async () => {

  // create dynamic fetch url inside fetch function to get updated values for lon & lat
  const sunUrl = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&formatted=0&date=today`;

  try {
    const response = await fetch(sunUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // create variables to store sunrise and sunset time in a format that can be used for calculations later (keep in UTC format)
    const sunriseTimeUTC: Date = new Date(data.results.sunrise);
    const sunsetTimeUTC: Date = new Date(data.results.sunset);

    // create variables for sunrise and sunset time in a presentable and local timezone format
    localSunriseTime = new Date(sunriseTimeUTC).toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    localSunsetTime = new Date(sunsetTimeUTC).toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    checkIfDayOrNight(sunriseTimeUTC, sunsetTimeUTC);

  } catch (error) {
    console.error("Fetch error:", error);
  }
};




/*------ LOGIC --------*/



const getIndexOfLocations = () => {
  // run as long as index is less than the number of objects in the locations array
  if (index < locations.length) {
    getLocationAndCoordinates(locations, index);
    // increment the index (for every click on the arrowButton). Index is declared and initially set to 1 in the global variables
    index++;
  } else {
    // when we have gone through the array length, run function with first object from array and reset index to start from 1 (next object after the first)
    getLocationAndCoordinates(locations, 0);
    index = 1;
  }
};



const getLocationAndCoordinates = async (
  array: GeoDataFormat[],
  index: number
) => {

  if (!array || array.length === 0) {
    weatherText.innerHTML = `<p class="error-message">Unfortunately there is no data for this location<p>`;
    // also reset the sunrise and sunset div so that the whole overview section is empty
    sunriseSunsetDiv.innerHTML = "";
    return;
  }
  
  // the object from the array with the index that are being passed as arguments in this function
  const arrayObject: GeoDataFormat = array[index]!;

  lon = arrayObject.lon;
  lat = arrayObject.lat;

  const municipality = arrayObject.municipality || "Missing value";
  const county = arrayObject.county || "Missing value";
  const place = arrayObject.place || "Missing value";

  const backgroundClass = arrayObject.backgroundClass;

  // fetch new data with updated coordinates
  await fetchWeatherData(); // wait for data until calling the other functions
  await fetchSunData(); // wait for data until calling the other functions

  getWeeklyDetails();
  insertWeatherData(index, municipality, county, place, backgroundClass);
};



const getWeeklyDetails = () => {
  weatherArrayGroupedByDate = weatherArray.reduce(
    (
      accumulatedGroupedObjects: GroupedWeatherDataFormat[],
      weatherArrayObject: WeatherDataFormat
    ) => {
      // create a variable that finds if any grouped object in the accumulated array of grouped objects matches a date of an object in weatherArray
      let existingGroupedObject = accumulatedGroupedObjects.find(
        (groupedObject) => groupedObject.date === weatherArrayObject.date
      );

      // if no match create a new grouped object for the date
      if (!existingGroupedObject) {
        accumulatedGroupedObjects.push({
          date: weatherArrayObject.date,
          dayOfWeek: weatherArrayObject.dayOfWeek,
          temperature: [weatherArrayObject.temperature],
          symbolCode: [weatherArrayObject.symbolCode],
        });
      // if there is a match, push the data to an existing grouped object
      } else {
        existingGroupedObject.temperature.push(weatherArrayObject.temperature);
        existingGroupedObject.symbolCode.push(weatherArrayObject.symbolCode);
      }

      return accumulatedGroupedObjects;
    },
    []
  );
};



const mapSymbolCode = (symbolCode: number) => {
  // find the object in weatherSymbols that matches the symbol code
  const rightWeatherObj = weatherSymbols.find(
    (weatherSymbol) => weatherSymbol.id === symbolCode
  );

  // return the description of that object
  return rightWeatherObj ? rightWeatherObj.description : "";
};



const getMaxSymbolCode = (index: number) => {
  const symbolArray = weatherArrayGroupedByDate[index]?.symbolCode ?? [];
  const maxSymbolCode = Math.max(...symbolArray);

  return maxSymbolCode;
};



const getTempMinMax = (index: number) => {
  const tempArray = weatherArrayGroupedByDate[index]?.temperature ?? [];
  const minTemp = Math.min(...tempArray);
  const maxTemp = Math.max(...tempArray);
  const minMaxTemp = `${maxTemp}°C / ${minTemp}°C`;

  return minMaxTemp;
};



const checkIfDayOrNight = (sunriseTimeUTC: Date, sunsetTimeUTC: Date) => {
  const currentTimeUTC = new Date();
  // if current time is between sunrise and sunset
  if (sunriseTimeUTC < currentTimeUTC && currentTimeUTC < sunsetTimeUTC) {
    dayOrNight = "day";
  } else {
    dayOrNight = "night";
  }
};



const showRain = (currentSymbolCode: number) => {
  // reset class name (to ensure the class rain is removed)
  weatherEffectDiv.className = "weather-effect";

  if (currentSymbolCode) {
    // if the most recent weather report's symbol code matches rainy weather (code 8-24)
    if(currentSymbolCode >= 8 && currentSymbolCode <= 24) {
      // add the animation
      weatherEffectDiv.classList.add("rain");

      const drops = 50;

      for (let i = 0; i < drops; i++) {
        const drop = document.createElement("span");
        drop.style.left = Math.random() * 100 + "%";
        drop.style.animationDuration = 0.5 + Math.random() * 0.5 + "s";
        drop.style.animationDelay = Math.random() * 2 + "s";
        weatherEffectDiv.appendChild(drop);
      }
    }
  }
};



const insertWeatherData = (
  index: number,
  place: string,
  municipality: string,
  county: string,
  backgroundClass: string
) => {

  // reset elements before filling them
  weatherEffectDiv.innerHTML = "";
  weatherText.innerHTML = "";
  sunriseSunsetDiv.innerHTML = "";
  weeklyDetails.innerHTML = "";

  // if missing location or weather data
  if (
    !locations ||
    locations.length === 0 ||
    !weatherArray ||
    weatherArray.length === 0
  ) {
    weatherText.innerHTML = `<p class="error-message">Unfortunately there is no data for this location<p>`;
    return;
  }

  // change class name for weatherOverview to update the background image depending on location

  weatherOverview.className = "weather-overview"; // reset class names
  if (backgroundClass) {
    weatherOverview.classList.add(`${backgroundClass}`);
  } else {
    weatherOverview.classList.add("default-image");
  }

  const currentLocalTime = new Date().toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // create a variable for the symbol code for the latest weather report 
  const currentSymbolCode = weatherArray[index]?.symbolCode ?? 0;

  // to determine if the current symbol code should activate rain animation or not
  showRain(currentSymbolCode);


  /* ----- insert data ------ */

  weatherText.innerHTML += `
    <h1>${weatherArray[index]?.temperature}°C</h1>
    <h2>${place}</h2>
    <h3>${municipality}, ${county}</h3>
    <div class="time-condition-flex-container">
      <p>Time: ${currentLocalTime}</p>
      <div class="weather-condition">
        <p>${weatherArray[index]?.symbolMeaning}</p>
        <img class="weather-icon" src="weather_icons/centered/solid/${dayOrNight}/${currentSymbolCode}.svg" alt="weather icon">  
      </div>
    </div>
  `;

  sunriseSunsetDiv.innerHTML += `
    <p>Sunrise: ${localSunriseTime}</p>
    <p>Sunset: ${localSunsetTime}</p>
  `;

  // create forecast. Starts from index 1, which equals tomorrow's weather report
  weeklyDetails.innerHTML += `
    <div class="day-box">
      <p class="day">${weatherArrayGroupedByDate[1]?.dayOfWeek}</p>
      <div class="details">
        <img class="weather-icon" src="weather_icons/centered/stroke/day/${getMaxSymbolCode(1)}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(1)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${weatherArrayGroupedByDate[2]?.dayOfWeek}</p>
      <div class="details">
        <img class="weather-icon" src="weather_icons/centered/stroke/day/${getMaxSymbolCode(2)}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(2)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${weatherArrayGroupedByDate[3]?.dayOfWeek}</p>
      <div class="details">
        <img class="weather-icon" src="weather_icons/centered/stroke/day/${getMaxSymbolCode(3)}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(3)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${weatherArrayGroupedByDate[4]?.dayOfWeek}</p>
      <div class="details">
        <img class="weather-icon" src="weather_icons/centered/stroke/day/${getMaxSymbolCode(4)}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(4)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${weatherArrayGroupedByDate[5]?.dayOfWeek}</p>
      <div class="details">
        <img class="weather-icon" src="weather_icons/centered/stroke/day/${getMaxSymbolCode(5)}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(5)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${weatherArrayGroupedByDate[6]?.dayOfWeek}</p>
      <div class="details">
        <img class="weather-icon" src="weather_icons/centered/stroke/day/${getMaxSymbolCode(6)}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(6)}</p>
      </div>
    </div>
  `;
};



/*------ EVENT LISTENERS --------*/



document.addEventListener("DOMContentLoaded", () => {
  getLocationAndCoordinates(locations, 0);
});



arrowButton.addEventListener("click", () => {
  getIndexOfLocations();
});



/* ---- search function ---- */


// functionality for open/close search bar

searchBtn.addEventListener("click", () => {
  searchBox.classList.add("active");
  closeBtn.style.display = "inline-block";
  searchBtn.style.display = "none";
  searchInput.focus();
});



closeBtn.addEventListener("click", () => {
  searchInput.value = "";
  searchBox.classList.remove("active");
  closeBtn.style.display = "none";
  searchBtn.style.display = "inline-block";
  searchInput.value = "";
});


// functionality for capturing user search input on keypress enter or by clicking the search submit button

searchBtnRight.addEventListener("click", (event) => {
  event.preventDefault();
  const userSearchInput = searchInput.value.trim();
  if (userSearchInput) {
    fetchGeoData(userSearchInput);
  }
});



searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const userSearchInput = searchInput.value.trim();
    if (userSearchInput) {
      fetchGeoData(userSearchInput);
    }
  }
});
