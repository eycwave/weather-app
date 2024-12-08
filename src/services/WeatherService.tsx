import axios from 'axios';

// API key for OpenWeatherMap
const API_KEY = 'YOUR_API_KEY';

// Fetches current weather data for a given city.
export const fetchWeather = async (city: string) => {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=tr`
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        throw error;
    }
};

// Fetches hourly weather data for a given city.
export const fetchHourlyWeather = async (city: string) => {
    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=tr`
        );
        // Map the raw data to a simplified format
        return response.data.list.map((item: any) => ({
            hour: new Date(item.dt * 1000).toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            temp: Math.round(item.main.temp), // Round temperature to the nearest whole number
            icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        }));
    } catch (error) {
        console.error('Error fetching hourly weather:', error);
        throw error;
    }   
};

// Export the weather functions for use in other files
export default { fetchWeather, fetchHourlyWeather };
