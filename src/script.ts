/*------ Interfaces --------*/

interface fetchedWeatherDataFormat {
  time: string;
  intervalParametersStartTime: string;
  data: { air_temperature: number; symbol_code: number };
}[];

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
  type: string[]
}[];

interface WeatherDataFormat {
  time: string;
  date: string;
  dayOfWeek: string;
  temperature: number;
  symbolCode: number;
  symbolMeaning: string;
  lat: number;
  lon: number;
};

interface GeoDataFormat {
  country: string;
  place: string;
  county: string;
  municipality: string;
  lat: number;
  lon: number;
};


interface GroupedWeatherDataFormat {
  date: string;
  dayOfWeek: string;
  temperature: number[];
  symbolCode: number[];
};




/*------ DOM elements --------*/

const weatherText: HTMLElement = document.getElementById("weather-text");
const weatherIconBox: HTMLElement = document.getElementById("weather-icon-box");
const weeklyDetails: HTMLElement = document.getElementById("weekly-details");
const arrowButton: HTMLButtonElement = document.getElementById("arrow-button");




/*------ Global variables --------*/
const weatherUrl: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`;



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
  { id: 27, description: "Heavy snowfall" }
];


const locations: GeoDataFormat[] = [
  {
    country: "Sverige",
    place: "Stockholm",
    county: "Stockholms län",
    municipality: "Stockholm",
    lon: 18.062639,
    lat: 59.329468
  },
  {
    country: "Sverige",
    place: "Göteborg",
    county: "Västra Götalands län",
    municipality: "Göteborg",
    lon: 11.966666,
    lat: 57.716666
  },
  {
    country: "Sverige",
    place: "Umeå",
    county: "Västerbottens län",
    municipality: "Umeå",
    lon: 20.25,
    lat: 63.833333
  }
];

let lon: number = 18.062639; // Stockholm
let lat: number = 59.329468; // Stockholm


let weatherData: WeatherDataFormat;

let weatherArray: WeatherDataFormat[] = [];

let searchedLocation: GeoDataFormat;

let searchedLocations: GeoDataFormat[] = [];

let weatherArrayGroupedByDate: GroupedWeatherDataFormat[] = [];

let index = 1;


/*------ Logic --------*/



const getIndexOfLocations = () => {

  if (index < locations.length) {
    getLocationAndCoordinates(locations, index);
    // increment the index for every click
    index++;
  } else {
    // when we have gone through the array length, run function with first object from array and reset index
    getLocationAndCoordinates(locations, 0);
    index = 1;
  }
};


const getLocationAndCoordinates = async (array: GeoDataFormat[], index: number) => {
  if (!array || array.length === 0) {
    weatherText.innerHTML = `<p class="error-message">Unfortunately there is no data for this location<p>`;
    return;
  }

  const arrayObject: GeoDataFormat = array[index];

  lon = arrayObject.lon;
  lat = arrayObject.lat;

  //Fallback for municipality and county
  const municipality = arrayObject.municipality || "Missing value";
  const county = arrayObject.county || "Missing value";
  const place = arrayObject.place || "Missing value";

  // fetch new data with updated coordinates
  await fetchWeatherData(); // wait for data until calling insertWeatherData
  getWeeklyDetails();
  insertWeatherData(index, municipality, county, place);
};


const getWeeklyDetails = () => {

  weatherArrayGroupedByDate = weatherArray.reduce((accumulatedGroupedObjects: GroupedWeatherDataFormat[], weatherReport: WeatherDataFormat) => {

    let existingGroupedObject = accumulatedGroupedObjects.find(groupedObject => groupedObject.date === weatherReport.date);

    // create a new grouped object for the date
    if(!existingGroupedObject) {
      accumulatedGroupedObjects.push({
        date: weatherReport.date,
        dayOfWeek: weatherReport.dayOfWeek,
        temperature: [weatherReport.temperature],
        symbolCode: [weatherReport.symbolCode]
      });
    } else {
      existingGroupedObject.temperature.push(weatherReport.temperature);
      existingGroupedObject.symbolCode.push(weatherReport.symbolCode);
    }

    return accumulatedGroupedObjects;
  }, []
  )};

  const getTempMinMax = (index: number) => {
    const tempArray = weatherArrayGroupedByDate[index]?.temperature
    const minTemp = Math.min(...tempArray);
    const maxTemp = Math.max(...tempArray);
    const minMaxTemp = `${maxTemp}°C / ${minTemp}°C`;

    return minMaxTemp;
  }



const insertWeatherData = (index: number, place: string, municipality: string, county: string) => {

  const currentLocalTime = new Date().toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  // reset elements before filling it
  weatherIconBox.innerHTML = "";
  weatherText.innerHTML = "";
  weeklyDetails.innerHTML = "";


  // if missing location or weather data
  if ((!locations || locations.length === 0) || (!weatherArray || weatherArray.length === 0)) {
    weatherText.innerHTML = `<p class="error-message">Unfortunately there is no data for this location<p>`;
    return;
  }

  // insert data. Index 0 is always the current weather report in the weatherArray

  // TO DO: change path "day" to a variable which valur depends on current time - if it's daytime or night time
  weatherIconBox.innerHTML += `
  <img id="weather-icon" src="weather_icons/centered/stroke/day/${weatherArray[index]?.symbolCode}.svg" alt="weather icon">  
  `

  weatherText.innerHTML += `
    <h1>${weatherArray[index]?.temperature}°C</h1>
    <h2>${place}</h2>
    <h3>${municipality}, ${county}</h3>
    <p>Time: ${currentLocalTime}</p>
    <p>${weatherArray[index]?.symbolMeaning}</p>
  `
  // tomorrow has index 1
  weeklyDetails.innerHTML += `
    <div class="day-box">
      <p class="day">${weatherArrayGroupedByDate[1]?.dayOfWeek}</p>
      <div class="details">
        <img id="weather-icon" src="weather_icons/centered/stroke/day/${weatherArrayGroupedByDate[1]?.symbolCode[2]}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(1)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${weatherArrayGroupedByDate[2]?.dayOfWeek}</p>
      <div class="details">
        <img id="weather-icon" src="weather_icons/centered/stroke/day/${weatherArrayGroupedByDate[2]?.symbolCode[2]}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(2)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${weatherArrayGroupedByDate[3]?.dayOfWeek}</p>
      <div class="details">
        <img id="weather-icon" src="weather_icons/centered/stroke/day/${weatherArrayGroupedByDate[3]?.symbolCode[2]}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(3)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${weatherArrayGroupedByDate[4]?.dayOfWeek}</p>
      <div class="details">
        <img id="weather-icon" src="weather_icons/centered/stroke/day/${weatherArrayGroupedByDate[4]?.symbolCode[2]}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(4)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${weatherArrayGroupedByDate[5]?.dayOfWeek}</p>
      <div class="details">
        <img id="weather-icon" src="weather_icons/centered/stroke/day/${weatherArrayGroupedByDate[5]?.symbolCode[2]}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(5)}</p>
      </div>
    </div>
  `
};



const mapSymbolCode = (symbolCode: number) => {
  // find the object in weatherSymbols that matches the symbol code
  const rightWeatherObj = weatherSymbols.find(weatherSymbol => weatherSymbol.id ===
    symbolCode)

  // return the description of that object
  return (rightWeatherObj ? rightWeatherObj.description : "");
};




/*------ Fetch data --------*/


// TO DO: create search input field and event listener for it. Use search input as dynamic value for the geoUrl and call fetchGeoData function. Fetch geo data and use properties from the first object (should be the best match?) in the array [0] ??
const fetchGeoData = async () => {

  // TO DO: switch /places/ to a dynamic variable containing the search input
  const geoUrl: string = `https://wpt-a-tst.smhi.se/backend-startpage/geo/autocomplete/places/stockholm?sweonly=true`;

  searchedLocations = [];

  try {
    const response = await fetch(geoUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const fetchedGeoReports: fetchedGeoDataFormat[] = await response.json();

    fetchedGeoReports.map((report: fetchedGeoDataFormat) => {

      searchedLocation = {
        country: report.country,
        place: report.place,
        county: report.county,
        municipality: report.municipality,
        lat: Number((report.lat).toFixed(6)),
        lon: Number((report.lon).toFixed(6))
      };

      searchedLocations.push(searchedLocation);
    });

  }
  catch (error) {
    console.error('Fetch error:', error);
  }
};



const fetchWeatherData = async () => {

  // create dynamic fetch url inside fetch function to get updated values for lon & lat
  const filteredWeatherUrl: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${lon}/lat/${lat}/data.json?timeseries=72&parameters=air_temperature,symbol_code`;

  // reset weatherArray before filling it with weather reports
  weatherArray = [];

  try {
    const response = await fetch(filteredWeatherUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json()


    const lon: number = Number((data.geometry.coordinates[0]).toFixed(6));
    const lat: number = Number((data.geometry.coordinates[1]).toFixed(6));

    const fetchedWeatherReports: fetchedWeatherDataFormat[] = data.timeSeries;

    fetchedWeatherReports.map((report: fetchedWeatherDataFormat) => {

      const symbolCode = report.data.symbol_code;
      const symbolMeaning = mapSymbolCode(symbolCode);
      const localTime = new Date(report.time).toLocaleString("sv-SE", {
        timeZone: "Europe/Stockholm",
        // year: "numeric",
        // month: "2-digit",
        // day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
      const localDate = new Date(report.time).toLocaleString("sv-SE", {
        timeZone: "Europe/Stockholm",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });

      const dayNumber: number = (new Date(localDate)).getDay();
      let dayOfWeek: string = "";

      const getDayOfWeekName = (dayNumber: number) => {
        if(dayNumber === 0) {
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

      // TO DO: round temperature to whole number
      weatherData = {
        time: localTime,
        date: localDate,
        dayOfWeek: dayOfWeek,
        temperature: Math.round(report.data.air_temperature),
        symbolCode: symbolCode,
        symbolMeaning: symbolMeaning,
        lon: lon,
        lat: lat
      };

      weatherArray.push(weatherData);
    });

  }
  catch (error) {
    console.error('Fetch error:', error);
  }
};



/*------ Event listeners --------*/


document.addEventListener("DOMContentLoaded", () => {
  getLocationAndCoordinates(locations, 0);
});


arrowButton.addEventListener("click", () => {
  getIndexOfLocations();
});