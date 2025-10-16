declare const weatherText: HTMLElement;
declare const weatherUrl: string;
declare const geoUrl: string;
declare let lon: number;
declare let lat: number;
declare const weatherSymbols: {
    id: number;
    description: string;
}[];
declare const places: GeoDataFormat[];
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
    municipality?: string;
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
    lat: number;
    lon: number;
}
interface GeoDataFormat {
    country: string;
    county: string;
    municipality?: string;
    lat: number;
    lon: number;
}
interface GeoWeatherDataFormat extends WeatherDataFormat {
    country: string;
    county: string;
    municipality?: string;
}
declare let weatherData: WeatherDataFormat;
declare let geoData: GeoDataFormat;
declare const weatherArray: WeatherDataFormat[];
declare const geoArray: GeoDataFormat[];
declare const getLocationAndCoordinates: (index: number) => Promise<void>;
declare const insertWeatherData: (municipality: string, county: string) => void;
declare const mapSymbolCode: (symbolCode: number) => string;
declare const fetchGeoData: () => Promise<void>;
declare const fetchWeatherData: () => Promise<void>;
//# sourceMappingURL=script.d.ts.map