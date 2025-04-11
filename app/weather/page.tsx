"use client";

import React, { useEffect, useState } from "react";

interface WeatherData {
  temperature: number;
  description: string;
  time: string;
  weatherCode: number;
}

const getBackgroundColor = (code: number): string => {
  if ([61, 63, 65].includes(code)) return "#a4b0be";
  if ([3, 45, 48].includes(code)) return "#dcdde1";
  if ([0].includes(code)) return "#f1c40f";
  if ([71, 73, 75].includes(code)) return "#dff9fb";
  return "#ffffff";
};

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
  return map[code] || "Unknown";
};

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const city = "College Station";

        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            city
          )}&count=1`
        );
        const geoJson = await geoRes.json();
        const location = geoJson.results[0];
        const lat = location.latitude;
        const lon = location.longitude;

        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const weatherJson = await weatherRes.json();

        const { temperature, weathercode, time } = weatherJson.current_weather;

        setWeatherData({
          temperature,
          description: getDescription(weathercode),
          time: new Date().toISOString(),
          weatherCode: weathercode,
        });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeatherData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading)
    return <div style={{ fontSize: "24px", padding: "40px" }}>Loading...</div>;
  if (!weatherData)
    return (
      <div style={{ fontSize: "24px", padding: "40px" }}>
        Error loading weather data.
      </div>
    );

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
