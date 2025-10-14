declare const url: string;
declare const filteredUrl: string;
declare const geoUrl: string;
interface fetchedDataStructure {
    time: string;
    intervalParametersStartTime: string;
    data: {
        air_temperature: number;
        symbol_code: number;
    };
}
type WeatherData = {
    time: string;
    temperature: string;
    symbol: number;
};
declare const weatherArray: WeatherData[];
declare const addToWeatherArray: (weatherData: WeatherData) => void;
declare const mapFetchedData: (fetchedWeatherReports: fetchedDataStructure[]) => void;
declare const fetchWeatherData: () => Promise<void>;
//# sourceMappingURL=script.d.ts.map