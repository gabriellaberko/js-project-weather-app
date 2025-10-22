declare const weatherText: HTMLElement;
declare const weeklyDetails: HTMLElement;
declare const searchBtn: HTMLElement;
declare const closeBtn: HTMLElement;
declare const searchBox: HTMLElement;
declare const searchInput: HTMLInputElement;
declare const searchBtnRight: HTMLButtonElement;
declare const arrowButton: HTMLButtonElement;
declare const sunriseSunsetDiv: HTMLElement;
declare const weatherOverview: HTMLElement;
declare const weatherEffectDiv: HTMLElement;
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
    backgroundClass: string;
}
interface GroupedWeatherDataFormat {
    date: string;
    dayOfWeek: string;
    temperature: number[];
    symbolCode: number[];
}
declare const weatherSymbols: {
    id: number;
    description: string;
}[];
declare const locations: GeoDataFormat[];
declare let lon: number;
declare let lat: number;
declare let localSunriseTime: string;
declare let localSunsetTime: string;
declare let dayOrNight: string;
declare let weatherData: WeatherDataFormat;
declare let weatherArray: WeatherDataFormat[];
declare let searchedLocation: GeoDataFormat;
declare let searchedLocations: GeoDataFormat[];
declare let weatherArrayGroupedByDate: GroupedWeatherDataFormat[];
declare let index: number;
declare const fetchWeatherData: () => Promise<void>;
declare const fetchGeoData: (userSearchInput: string) => Promise<void>;
declare const fetchSunData: () => Promise<void>;
declare const showRain: (currentSymbolCode: number) => void;
declare const checkIfDayOrNight: (sunriseTimeUTC: Date, sunsetTimeUTC: Date) => void;
declare const getIndexOfLocations: () => void;
declare const getLocationAndCoordinates: (array: GeoDataFormat[], index: number) => Promise<void>;
declare const getWeeklyDetails: () => void;
declare const getTempMinMax: (index: number) => string;
declare const insertWeatherData: (index: number, place: string, municipality: string, county: string, backgroundClass: string) => void;
declare const mapSymbolCode: (symbolCode: number) => string;
//# sourceMappingURL=script.d.ts.map