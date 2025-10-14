
const url: string = `https://opendata-download-metfcst.smhi.se/api/category/snow1g/version/1/geotype/point/lon/18.062639/lat/59.329468/data.json`;

const test: number = "hej";

// interface SunriseData {
//   country: string
//   sunrise: number
//   sunset: number
//   timezone: number
// }

// Const weatherObj = {
//   Country: Sweden,
//   sunrise: 12:00
// }

const fetchData = async () => {
   try {
      const response = await fetch(url);
      console.log(response)

      if(!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      const timeSeries = data.timeSeries;

      console.log(data);
      console.log(response);
   }
   catch(error) {
    console.error('Fetch error:', error);
   }
}

fetchData();