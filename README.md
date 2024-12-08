# Weather App

A professional-grade React Native weather application that provides current weather information, hourly forecasts, and detailed weather conditions for any city.

## Features

- **Search Functionality:**
  - Users can search for the weather in any city.

- **Dynamic Modes:**
  - Automatic day/night mode based on the current time.
  - Smooth gradient backgrounds for day and night themes.

- **Weather Details:**
  - Displays current temperature, weather description, and weather icon.
  - Provides additional details like wind speed, humidity, pressure, and feels-like temperature.
  - Hourly weather forecasts with temperature and icons.

- **Error Handling:**
  - User-friendly error messages for invalid city names.
  - Error modal styled to match the application's professional design.

## Screenshots

![weatherapp](https://github.com/user-attachments/assets/0fe1cc21-1d26-4ddd-bb5f-7be195d1bad5)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd weather-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the application:
   ```bash
   npx react-native run-android
   # or for iOS
   npx react-native run-ios
   ```

## Technologies Used

- **Frontend:** React Native
- **API:** OpenWeatherMap API
- **Styling:** React Native Linear Gradient
- **State Management:** React Hooks

## API Integration

This app uses the [OpenWeatherMap API](https://openweathermap.org/api) to fetch:
- Current weather data
- Hourly forecasts
