"use strict";
// TO DO: change longitude & latitude (lon & lat) values to variables that we fetch from geoURL
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*------ Global variables --------*/
const weatherUrl = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`;
const filteredWeatherUrl = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=48&parameters=air_temperature,symbol_code`;
const geoUrl = `https://wpt-a-tst.smhi.se/backend-startpage/geo/autocomplete/places/stockholm?pmponly=true`;
[];
[];
;
;
;
let weatherData;
let geoData;
const weatherArray = [];
const geoArray = [];
// let geoDataArray: GeoWeatherDataFormat[] = [];
// TO DO: map each values. Should probably use a more effective method of looping through values
const mapSymbolCode = (symbolCode) => {
    let meaning = "";
    if (symbolCode === 1) {
        meaning = "Clear sky";
    }
    else {
        meaning = "Something else";
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
                lat: (report.lat).toFixed(6),
                lon: (report.lon).toFixed(6)
            };
            geoArray.push(geoData);
        });
    }
    catch (error) {
        console.error('Fetch error:', error);
    }
});
const fetchWeatherData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(filteredWeatherUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = yield response.json();
        const lon = (data.geometry.coordinates[0]).toFixed(6);
        const lat = (data.geometry.coordinates[1]).toFixed(6);
        const fetchedWeatherReports = data.timeSeries;
        fetchedWeatherReports.map((report) => {
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
    catch (error) {
        console.error('Fetch error:', error);
    }
});
document.addEventListener("DOMContentLoaded", () => {
    fetchGeoData();
    fetchWeatherData();
});
//# sourceMappingURL=script.js.map