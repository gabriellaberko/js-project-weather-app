"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const url = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`;
const filteredUrl = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json?timeseries=48&parameters=air_temperature,symbol_code`;
const geoUrl = `https://wpt-a-tst.smhi.se/backend-startpage/geo/autocomplete/places/stockholm?pmponly=true`;
[];
const weatherArray = [];
const addToWeatherArray = (weatherData) => {
    weatherArray.push(weatherData);
};
const mapFetchedData = (fetchedWeatherReports) => {
    fetchedWeatherReports.map((report) => {
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
const fetchWeatherData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(filteredUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const fetchedWeatherReports = (yield response.json()).timeSeries;
        mapFetchedData(fetchedWeatherReports);
    }
    catch (error) {
        console.error('Fetch error:', error);
    }
});
document.addEventListener("DOMContentLoaded", () => {
    fetchWeatherData();
});
//# sourceMappingURL=script.js.map