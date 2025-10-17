"use strict";
/*------ DOM elements --------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const weatherText = document.getElementById("weather-text");
const weatherIconBox = document.getElementById("weather-icon-box");
/*------ Global variables --------*/
const weatherUrl = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`;
const geoUrl = `https://wpt-a-tst.smhi.se/backend-startpage/geo/autocomplete/places/stockholm?sweonly=true`;
let lon = 18.062639; // Stockholm
let lat = 59.329468; // Stockholm
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
const locations = [
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
[];
[];
;
;
// interface GeoWeatherDataFormat extends WeatherDataFormat {
//   country: string;
//   place: string;
//   county: string;
//   municipality?: string;
// };
let weatherData;
const weatherArray = [];
let geoData;
const geoArray = [];
// TO DO: create a function that loops through the length of the variable locations and returning an index - called upon click on arrow button
const getLocationAndCoordinates = (index) => __awaiter(void 0, void 0, void 0, function* () {
    if (!locations || locations.length === 0) {
        weatherText.innerHTML = `<p class="error-message">Unfortunately there is no data for this location<p>`;
        return;
    }
    const location = locations[index];
    lon = location.lon;
    lat = location.lat;
    //Fallback for municipality and county
    const municipality = location.municipality || "Missing value";
    const county = location.county || "Missing value";
    const place = location.place || "Missing value";
    // fetch new data with updated coordinates
    yield fetchWeatherData(); // wait for data until calling insertWeatherData
    insertWeatherData(municipality, county, place);
});
const insertWeatherData = (place, municipality, county) => {
    var _a, _b, _c;
    // reset element before filling it
    weatherText.innerHTML = "";
    // if missing location or weather data
    if ((!locations || locations.length === 0) || (!weatherArray || weatherArray.length === 0)) {
        weatherText.innerHTML = `<p class="error-message">Unfortunately there is no data for this location<p>`;
        return;
    }
    // TO DO: change path "day" to a variable which valur depends on current time - if it's daytime or night time
    weatherIconBox.innerHTML += `
  <img id="weather-icon" src="weather_icons/centered/stroke/day/${(_a = weatherArray[0]) === null || _a === void 0 ? void 0 : _a.symbolCode}.svg" alt="weather icon">  
  `;
    weatherText.innerHTML += `
    <h1>${(_b = weatherArray[0]) === null || _b === void 0 ? void 0 : _b.temperature}</h1>
    <h2>${place}</h2>
    <h3>${municipality}, ${county}</h3>
    <p>Time: ${new Date().toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })}
    </p>
    <p>${(_c = weatherArray[0]) === null || _c === void 0 ? void 0 : _c.symbolMeaning}</p>
  `;
};
const mapSymbolCode = (symbolCode) => {
    // find the object in weatherSymbols that matches the symbol code
    const rightWeatherObj = weatherSymbols.find(weatherSymbol => weatherSymbol.id ===
        symbolCode);
    // return the description of that object
    return (rightWeatherObj ? rightWeatherObj.description : "");
};
// TO DO: create search input field and event listener for it. Use search input as dynamic value for the geoUrl and call fetchGeoData function. Fetch geo data and use properties from the first object (should be the best match?) in the array [0] ??
const fetchGeoData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(geoUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const fetchedGeoReports = yield response.json();
        fetchedGeoReports.map((report) => {
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
    catch (error) {
        console.error('Fetch error:', error);
    }
});
const fetchWeatherData = () => __awaiter(void 0, void 0, void 0, function* () {
    // create dynamic fetch url inside fetch function to get updated values for lon & lat
    const filteredWeatherUrl = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${lon}/lat/${lat}/data.json?timeseries=48&parameters=air_temperature,symbol_code`;
    try {
        const response = yield fetch(filteredWeatherUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = yield response.json();
        const lon = Number((data.geometry.coordinates[0]).toFixed(6));
        const lat = Number((data.geometry.coordinates[1]).toFixed(6));
        const fetchedWeatherReports = data.timeSeries;
        fetchedWeatherReports.map((report) => {
            const symbolCode = report.data.symbol_code;
            const symbolMeaning = mapSymbolCode(symbolCode);
            const localTime = new Date(report.time).toLocaleString("sv-SE", {
                timeZone: "Europe/Stockholm",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            });
            const dayNumber = (new Date(localTime)).getDay();
            let dayOfWeek = "";
            const getDayOfWeekName = (dayNumber) => {
                if (dayNumber === 0) {
                    dayOfWeek = "Sun";
                }
                else if (dayNumber === 1) {
                    dayOfWeek = "Mon";
                }
                else if (dayNumber === 2) {
                    dayOfWeek = "Tue";
                }
                else if (dayNumber === 3) {
                    dayOfWeek = "Wed";
                }
                else if (dayNumber === 4) {
                    dayOfWeek = "Thu";
                }
                else if (dayNumber === 5) {
                    dayOfWeek = "Fri";
                }
                else if (dayNumber === 6) {
                    dayOfWeek = "Sat";
                }
                return dayOfWeek;
            };
            getDayOfWeekName(dayNumber);
            weatherData = {
                time: localTime,
                dayOfWeek: dayOfWeek,
                temperature: `${report.data.air_temperature}°C`,
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
});
document.addEventListener("DOMContentLoaded", () => {
    //fetchGeoData();
    getLocationAndCoordinates(0);
});
//# sourceMappingURL=script.js.map