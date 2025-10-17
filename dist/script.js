"use strict";
/*------ Interfaces --------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
[];
[];
;
;
;
/*------ DOM elements --------*/
const weatherText = document.getElementById("weather-text");
const weatherIconBox = document.getElementById("weather-icon-box");
const weeklyDetails = document.getElementById("weekly-details");
/*------ Global variables --------*/
const weatherUrl = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`;
const geoUrl = `https://wpt-a-tst.smhi.se/backend-startpage/geo/autocomplete/places/stockholm?sweonly=true`;
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
let lon = 18.062639; // Stockholm
let lat = 59.329468; // Stockholm
let weatherData;
const weatherArray = [];
let geoData;
const geoArray = [];
let weatherArrayGroupedByDate = [];
/*------ Logic --------*/
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
    getWeeklyDetails();
    insertWeatherData(municipality, county, place);
});
const getWeeklyDetails = () => {
    weatherArrayGroupedByDate = weatherArray.reduce((accumulatedGroupedObjects, weatherReport) => {
        let existingGroupedObject = accumulatedGroupedObjects.find(groupedObject => groupedObject.date === weatherReport.date);
        // create a new grouped object for the date
        if (!existingGroupedObject) {
            accumulatedGroupedObjects.push({
                date: weatherReport.date,
                dayOfWeek: weatherReport.dayOfWeek,
                temperature: [weatherReport.temperature],
                symbolCode: [weatherReport.symbolCode]
            });
        }
        else {
            existingGroupedObject.temperature.push(weatherReport.temperature);
            existingGroupedObject.symbolCode.push(weatherReport.symbolCode);
        }
        return accumulatedGroupedObjects;
    }, []);
};
const getTempMinMax = (index) => {
    var _a;
    const tempArray = (_a = weatherArrayGroupedByDate[index]) === null || _a === void 0 ? void 0 : _a.temperature;
    const minTemp = Math.min(...tempArray);
    const maxTemp = Math.max(...tempArray);
    const minMaxTemp = `${maxTemp}°C / ${minTemp}°C`;
    return minMaxTemp;
};
const insertWeatherData = (place, municipality, county) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    const currentLocalTime = new Date().toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
    // reset element before filling it
    weatherText.innerHTML = "";
    // if missing location or weather data
    if ((!locations || locations.length === 0) || (!weatherArray || weatherArray.length === 0)) {
        weatherText.innerHTML = `<p class="error-message">Unfortunately there is no data for this location<p>`;
        return;
    }
    // insert data. Index 0 is always the current weather report in the weatherArray
    // TO DO: change path "day" to a variable which valur depends on current time - if it's daytime or night time
    weatherIconBox.innerHTML += `
  <img id="weather-icon" src="weather_icons/centered/stroke/day/${(_a = weatherArray[0]) === null || _a === void 0 ? void 0 : _a.symbolCode}.svg" alt="weather icon">  
  `;
    weatherText.innerHTML += `
    <h1>${(_b = weatherArray[0]) === null || _b === void 0 ? void 0 : _b.temperature}°C</h1>
    <h2>${place}</h2>
    <h3>${municipality}, ${county}</h3>
    <p>Time: ${currentLocalTime}</p>
    <p>${(_c = weatherArray[0]) === null || _c === void 0 ? void 0 : _c.symbolMeaning}</p>
  `;
    // tomorrow has index 1
    weeklyDetails.innerHTML += `
    <div class="day-box">
      <p class="day">${(_d = weatherArrayGroupedByDate[1]) === null || _d === void 0 ? void 0 : _d.dayOfWeek}</p>
      <div class="details">
        <img id="weather-icon" src="weather_icons/centered/stroke/day/${(_e = weatherArrayGroupedByDate[1]) === null || _e === void 0 ? void 0 : _e.symbolCode[2]}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(1)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${(_f = weatherArrayGroupedByDate[2]) === null || _f === void 0 ? void 0 : _f.dayOfWeek}</p>
      <div class="details">
        <img id="weather-icon" src="weather_icons/centered/stroke/day/${(_g = weatherArrayGroupedByDate[2]) === null || _g === void 0 ? void 0 : _g.symbolCode[2]}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(2)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${(_h = weatherArrayGroupedByDate[3]) === null || _h === void 0 ? void 0 : _h.dayOfWeek}</p>
      <div class="details">
        <img id="weather-icon" src="weather_icons/centered/stroke/day/${(_j = weatherArrayGroupedByDate[3]) === null || _j === void 0 ? void 0 : _j.symbolCode[2]}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(3)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${(_k = weatherArrayGroupedByDate[4]) === null || _k === void 0 ? void 0 : _k.dayOfWeek}</p>
      <div class="details">
        <img id="weather-icon" src="weather_icons/centered/stroke/day/${(_l = weatherArrayGroupedByDate[4]) === null || _l === void 0 ? void 0 : _l.symbolCode[2]}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(4)}</p>
      </div>
    </div>
    <div class="day-box">
      <p class="day">${(_m = weatherArrayGroupedByDate[5]) === null || _m === void 0 ? void 0 : _m.dayOfWeek}</p>
      <div class="details">
        <img id="weather-icon" src="weather_icons/centered/stroke/day/${(_o = weatherArrayGroupedByDate[5]) === null || _o === void 0 ? void 0 : _o.symbolCode[2]}.svg" alt="weather icon"> 
        <p class="degrees">${getTempMinMax(5)}</p>
      </div>
    </div>
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
/*------ Fetch data --------*/
const fetchWeatherData = () => __awaiter(void 0, void 0, void 0, function* () {
    // create dynamic fetch url inside fetch function to get updated values for lon & lat
    const filteredWeatherUrl = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/${lon}/lat/${lat}/data.json?timeseries=72&parameters=air_temperature,symbol_code`;
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
            const dayNumber = (new Date(localDate)).getDay();
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
});
/*------ Event listeners --------*/
document.addEventListener("DOMContentLoaded", () => {
    //fetchGeoData();
    getLocationAndCoordinates(0);
});
//# sourceMappingURL=script.js.map