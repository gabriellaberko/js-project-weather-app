

const url: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`;


// TO DO: change longitude & latitude (lon & lat) values to variables that we fetch from geoURL

const filteredUrl: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=48&parameters=air_temperature,symbol_code`;

const geoUrl: string = `https://wpt-a-tst.smhi.se/backend-startpage/geo/autocomplete/places/stockholm?pmponly=true`;



// interface fetchedDataStructure {
//   time: string;
//   intervalParametersStartTime: string;
//   data: { air_temperature: number; symbol_code: number };
// }[];

interface WeatherDataFormat {
  time: string;
  temperature: string;
  symbol: number;
};

let weatherData: WeatherDataFormat;

const weatherArray: WeatherDataFormat[] = [];



// const addToWeatherArray = (weatherData: WeatherDataFormat) => {
//   weatherArray.push(weatherData);
// }

// const mapFetchedData = (fetchedWeatherReports) => {
//   fetchedWeatherReports.map((report) => {

//     weatherData = {
//       time: report.time,
//       temperature: `${report.data.air_temperature}°C`,
//       symbol: report.data.symbol_code
//     };
    
//     addToWeatherArray(weatherData);  
//   }); 
// };


const fetchWeatherData = async () => {
  try {
    const response = await fetch(filteredUrl);

    if(!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const fetchedWeatherReports = (await response.json()).timeSeries;

    fetchedWeatherReports.map((report) => {

      weatherData = {
        time: report.time,
        temperature: `${report.data.air_temperature}°C`,
        symbol: report.data.symbol_code
      };
    
    weatherArray.push(weatherData);
    });

  }
  catch(error) {
    console.error('Fetch error:', error);
  }
};


document.addEventListener("DOMContentLoaded", () => {
  fetchWeatherData();
});
