"use client";

import React, { useEffect, useState } from "react";

// Interface to define the structure of weather data
interface WeatherData {
  temperature: number;
  description: string;
  time: string;
  weatherCode: number;
}

// Function to determine background color based on weather code
const getBackgroundColor = (code: number): string => {
  if ([61, 63, 65].includes(code)) return "#a4b0be"; // Rainy weather
  if ([3, 45, 48].includes(code)) return "#dcdde1"; // Overcast or foggy
  if ([0].includes(code)) return "#f1c40f"; // Clear sky
  if ([71, 73, 75].includes(code)) return "#dff9fb"; // Snowy weather
  return "#ffffff"; // Default background color
};

// Function to map weather codes to descriptions
const getDescription = (code: number): string => {
  const map: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    95: "Thunderstorm",
  };
  return map[code] || "Unknown"; // Return "Unknown" if code is not in the map
};

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null); // State to store weather data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [currentTime, setCurrentTime] = useState<string>(""); // State to store current time

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const city = "College Station"; // City for which weather data is fetched

        // Fetch geolocation data for the city
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            city
          )}&count=1`
        );
        const geoJson = await geoRes.json();
        const location = geoJson.results[0]; // Extract the first result
        const lat = location.latitude; // Latitude of the city
        const lon = location.longitude; // Longitude of the city

        // Fetch current weather data using latitude and longitude
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const weatherJson = await weatherRes.json();

        const { temperature, weathercode, time } = weatherJson.current_weather;

        // Update weather data state
        setWeatherData({
          temperature,
          description: getDescription(weathercode), // Get description for weather code
          time: new Date().toISOString(), // Current time in ISO format
          weatherCode: weathercode,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error); // Log error
        setWeatherData(null); // Set weather data to null in case of error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchWeather(); // Call the function to fetch weather data

    // Update current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Show loading message while data is being fetched
  if (loading)
    return <div style={{ fontSize: "24px", padding: "40px" }}>Loading...</div>;

  // Show error message if weather data could not be fetched
  if (!weatherData)
    return (
      <div style={{ fontSize: "24px", padding: "40px" }}>
        Error loading weather data.
      </div>
    );

  // Get background color based on weather code
  const backgroundColor = getBackgroundColor(weatherData.weatherCode);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: "center",
        padding: "60px 20px",
        backgroundColor,
        minHeight: "100vh",
        transition: "background-color 0.5s ease",
        color: "#2f3542",
      }}
    >
      {/* Display weather information */}
      <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
        🌤️ Weather in College Station
      </h1>
      <p style={{ fontSize: "2rem", margin: "10px 0" }}>
        <strong>Temperature:</strong> {weatherData.temperature}°C
      </p>
      <p style={{ fontSize: "2rem", margin: "10px 0" }}>
        <strong>Condition:</strong> {weatherData.description}
      </p>
      <p style={{ fontSize: "1.5rem", marginTop: "30px", color: "#57606f" }}>
        <strong>Local Time:</strong> {currentTime}
      </p>
      {/* Button to navigate back to home */}
      <button
        onClick={() => (window.location.href = "/managerHome")}
        style={{
          marginTop: "40px",
          padding: "10px 20px",
          fontSize: "1.2rem",
          backgroundColor: "#1e90ff",
          color: "#ffffff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#3742fa")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#1e90ff")}
      >
        Go Back to Home
      </button>
    </div>
  );
};

export default WeatherPage;
