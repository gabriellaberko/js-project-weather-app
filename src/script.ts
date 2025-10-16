/*------ Global variables --------*/
const weatherUrl: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`;

const geoUrl: string = `https://wpt-a-tst.smhi.se/backend-startpage/geo/autocomplete/places/stockholm?pmponly=true`;

let lon: number = 18.062639; // Stockholm
let lat: number = 59.329468; // Stockholm

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

// use this variable for set locations?
const places: GeoDataFormat[] = [
  {
    country: "Sverige",
    county: "Stockholms län",
    municipality: "Stockholm",
    lon: 18.062639,
    lat: 59.329468
  },
  {
    country: "Sverige",
    county: "Västra Götalands län",
    municipality: "Göteborg",
    lon: 11.966666,
    lat: 57.716666
  },
  {
    country: "Sverige",
    county: "Västerbottens län",
    municipality: "Umeå",
    lon: 20.25,
    lat: 63.833333
  }
];


/*------ Assign data types --------*/

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
  municipality?: string;
  place: string;
  population: number;
  timezone: string;
  type: string[]}[];

interface WeatherDataFormat {
  time: string;
  temperature: string;
  symbolNumber: number;
  symbolMeaning: string;
  lat: number;
  lon: number;
};

interface GeoDataFormat {
  country: string;
  county: string;
  municipality?: string;
  lat: number;
  lon: number;
};

interface GeoWeatherDataFormat extends WeatherDataFormat {
  country: string;
  county: string;
  municipality?: string;
};

let weatherData: WeatherDataFormat;

let geoData: GeoDataFormat;

const weatherArray: WeatherDataFormat[] = [];

const geoArray: GeoDataFormat[] = [];

// let geoDataArray: GeoWeatherDataFormat[] = [];



// TO DO: create a function that loops through the variable places and takes lon & lat values to be used as dynamic values in filteredWeatherUrl. Called upon DOM load & click on arrow button??

const getLocationAndCoordinates = (index: number) => {
  if(places && places.length > 0) {
    lon = places[index].lon;
    lat = places[index].lat;

    let municipality: string = "";
    let county: string = "";

    if(places[index].municipality) {
       municipality = places[index]?.municipality;
    }

    if(places[index].county) {
    county = places[index]?.county
    }

    console.log(municipality);
    console.log(county);
    // fetch new data with update coordinates
    fetchWeatherData();

  } else {
    return;
  }
  };


// TO DO: map each values. Should probably use a more effective method of looping through values
const mapSymbolCode = (symbolCode: number): string => {

  // find matching id in weatherSymbols

};


// TO DO: create search input field and event listener for it. Use search input as dynamic value for the geoUrl and call fetchGeoData function. Fetch geo data and use properties from the first object (should be the best match?) in the array [0] ??
const fetchGeoData = async () => {
  try {
    const response = await fetch(geoUrl);

    if(!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const fetchedGeoReports:fetchedGeoDataFormat[] = await response.json();

    fetchedGeoReports.map((report:fetchedGeoDataFormat) => {

      geoData = {
        country: report.country,
        county: report.county,
        municipality: report.municipality,
        lat: Number((report.lat).toFixed(6)),
        lon: Number((report.lon).toFixed(6))
      };
    
      geoArray.push(geoData);
    });

  }
  catch(error) {
    console.error('Fetch error:', error);
  }
};


const fetchWeatherData = async () => {

  // create dynamic fetch url inside fetch function to get updated values for lon & lat
  const filteredWeatherUrl: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${lon}/lat/${lat}/data.json?timeseries=48&parameters=air_temperature,symbol_code`;

  try {
    const response = await fetch(filteredWeatherUrl);

    if(!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json()


    const lon: number = Number((data.geometry.coordinates[0]).toFixed(6));
    const lat: number = Number((data.geometry.coordinates[1]).toFixed(6));

    const fetchedWeatherReports:fetchedWeatherDataFormat[] = data.timeSeries;

    fetchedWeatherReports.map((report:fetchedWeatherDataFormat) => {
 
      const symbolCode = report.data.symbol_code;
      const symbolMeaning = mapSymbolCode(symbolCode);

      weatherData = {
        time: report.time,
        temperature: `${report.data.air_temperature}°C`,
        symbolNumber: report.data.symbol_code,
        symbolMeaning: symbolMeaning,
        lon: lon,
        lat: lat
      };
    
    weatherArray.push(weatherData);
    });

  }
  catch(error) {
    console.error('Fetch error:', error);
  }
};



document.addEventListener("DOMContentLoaded", () => {
  //fetchGeoData();
  getLocationAndCoordinates(0);
});