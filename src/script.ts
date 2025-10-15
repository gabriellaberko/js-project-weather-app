const url: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`;

// TO DO: change longitude & latitude (lon & lat) values to variables that we fetch from geoURL

const filteredUrl: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=48&parameters=air_temperature,symbol_code`;

const geoUrl: string = `https://wpt-a-tst.smhi.se/backend-startpage/geo/autocomplete/places/stockholm?pmponly=true`;



interface fetchedDataStructure {
  time: string;
  intervalParametersStartTime: string;
  data: { air_temperature: number; symbol_code: number };
}[];

type WeatherData = {
  time: string;
  temperature: string;
  symbol: number;
};


const weatherArray: WeatherData[] = [];



const addToWeatherArray = (weatherData: WeatherData) => {
  weatherArray.push(weatherData);
}

const mapFetchedData = (fetchedWeatherReports: fetchedDataStructure[]) => {
  fetchedWeatherReports.map((report: fetchedDataStructure) => {

    const time = report.time;
    const temperature = report.data.air_temperature;
    const symbol = report.data.symbol_code;
    
    addToWeatherArray({
      time: time, 
      temperature: `${temperature} °C`, 
      symbol: symbol
    });  
  }); 
};


const fetchWeatherData = async () => {
  try {
    const response = await fetch(filteredUrl);

    if(!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const fetchedWeatherReports: fetchedDataStructure[] = (await response.json()).timeSeries;

    mapFetchedData(fetchedWeatherReports);
  }
  catch(error) {
    console.error('Fetch error:', error);
  }
};


document.addEventListener("DOMContentLoaded", () => {
  fetchWeatherData();
});
