// TO DO: change longitude & latitude (lon & lat) values to variables that we fetch from geoURL



/*------ Global variables --------*/

const weatherUrl: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`;

const filteredWeatherUrl: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=48&parameters=air_temperature,symbol_code`;

const geoUrl: string = `https://wpt-a-tst.smhi.se/backend-startpage/geo/autocomplete/places/stockholm?pmponly=true`;


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
  municipality: string;
  place: string;
  population: number;
  timezone: string;
  type: string[]}[];

interface WeatherDataFormat {
  time: string;
  temperature: string;
  symbolNumber: number;
  symbolMeaning: string;
  lat: number | string;
  lon: number | string;
};

interface GeoDataFormat {
  country: string;
  county: string;
  municipality: string;
  lat: number | string;
  lon: number | string;
};

interface GeoWeatherDataFormat extends WeatherDataFormat {
  country: string;
  county: string;
  municipality: string;
};

let weatherData: WeatherDataFormat;

let geoData: GeoDataFormat;

const weatherArray: WeatherDataFormat[] = [];

const geoArray: GeoDataFormat[] = [];

// let geoDataArray: GeoWeatherDataFormat[] = [];



// TO DO: map each values. Should probably use a more effective method of looping through values
const mapSymbolCode = (symbolCode: number): string => {
  let meaning = "";
  if(symbolCode === 1) {
    meaning = "Clear sky"
  } else{
    meaning = "Something else"
  }
  return meaning;
};



// const getGeoWeatherArray = (weatherArray: WeatherDataFormat[], geoArray: GeoDataFormat[]) => {
//   // get longitude & latitude from weatherArray
//   const lon = weatherArray[0].lon;
//   const lat = weatherArray[0].lat;
//   // create variable with the object in geoArray that match the lon and lat from above
//   const matchingGeoObject = geoArray.find(geoObject => geoObject.lon === lon && geoObject.lat === lat);
//   // update geoDataArray with an array that looks like weatherArray but has the properties of matchingGeoObject in each object
//   geoDataArray = weatherArray.map(weatherReport => ({...weatherReport, ...matchingGeoObject}));
// };


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
        lat: (report.lat).toFixed(6),
        lon: (report.lon).toFixed(6)
      };
    
      geoArray.push(geoData);
    });

  }
  catch(error) {
    console.error('Fetch error:', error);
  }
};


const fetchWeatherData = async () => {
  try {
    const response = await fetch(filteredWeatherUrl);

    if(!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json()

    const lon: number = (data.geometry.coordinates[0]).toFixed(6);
    const lat: number = (data.geometry.coordinates[1]).toFixed(6);

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
  fetchGeoData();
  fetchWeatherData();
});