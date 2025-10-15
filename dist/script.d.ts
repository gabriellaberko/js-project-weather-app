declare const weatherUrl: string;
declare const filteredWeatherUrl: string;
declare const geoUrl: string;
interface fetchedWeatherDataFormat {
    time: string;
    intervalParametersStartTime: string;
    data: {
        air_temperature: number;
        symbol_code: number;
    };
}
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
interface WeatherDataFormat {
    time: string;
    temperature: string;
    symbolNumber: number;
    symbolMeaning: string;
    lat: number | string;
    lon: number | string;
}
interface GeoDataFormat {
    country: string;
    county: string;
    municipality: string;
    lat: number | string;
    lon: number | string;
}
interface GeoWeatherDataFormat extends WeatherDataFormat {
    country: string;
    county: string;
    municipality: string;
}
declare let weatherData: WeatherDataFormat;
declare let geoData: GeoDataFormat;
declare const weatherArray: WeatherDataFormat[];
declare const geoArray: GeoDataFormat[];
declare const mapSymbolCode: (symbolCode: number) => string;
declare const fetchGeoData: () => Promise<void>;
declare const fetchWeatherData: () => Promise<void>;
//# sourceMappingURL=script.d.ts.map