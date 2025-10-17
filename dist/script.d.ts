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
    date: string;
    dayOfWeek: string;
    temperature: number;
    symbolCode: number;
    symbolMeaning: string;
    lat: number;
    lon: number;
}
interface GeoDataFormat {
    country: string;
    place: string;
    county: string;
    municipality: string;
    lat: number;
    lon: number;
}
interface GroupedWeatherDataFormat {
    date: string;
    dayOfWeek: string;
    temperature: number[];
    symbolCode: number[];
}
declare const weatherText: HTMLElement;
declare const weatherIconBox: HTMLElement;
declare const weeklyDetails: HTMLElement;
declare const weatherUrl: string;
declare const geoUrl: string;
declare const weatherSymbols: {
    id: number;
    description: string;
}[];
declare const locations: GeoDataFormat[];
declare let lon: number;
declare let lat: number;
declare let weatherData: WeatherDataFormat;
declare const weatherArray: WeatherDataFormat[];
declare let geoData: GeoDataFormat;
declare const geoArray: GeoDataFormat[];
declare let weatherArrayGroupedByDate: GroupedWeatherDataFormat[];
declare const getLocationAndCoordinates: (index: number) => Promise<void>;
declare const getWeeklyDetails: () => void;
declare const getTempMinMax: (index: number) => string;
declare const insertWeatherData: (place: string, municipality: string, county: string) => void;
declare const mapSymbolCode: (symbolCode: number) => string;
declare const fetchGeoData: () => Promise<void>;
declare const fetchWeatherData: () => Promise<void>;
//# sourceMappingURL=script.d.ts.map