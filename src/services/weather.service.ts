import axios from "axios";
import WeatherCollection from "../models/Weather.model";
import HistoryCollection from "../models/History.model";
import { Types } from "mongoose";

interface WeatherResult {
  source: 'cache' | 'openweather';
  data: any;
  fetchedAt: Date;
}

export const fetchOrGetCachedWeather = async (
  lat: number,
  lon: number,
  userId: Types.ObjectId
): Promise<WeatherResult> => {
  const findLat = parseFloat(lat.toFixed(2));
  const findLon = parseFloat(lon.toFixed(2));
  const now = new Date();

  let weather = await WeatherCollection.findOne({ lat: findLat, lon: findLon });
  let source: 'cache' | 'openweather';
  let weatherData: any;

  if (weather) {
    source = "cache";
    weatherData = weather.data;
  } else {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    weatherData = response.data;
    source = "openweather";

    weather = await WeatherCollection.create({
      lat: findLat,
      lon: findLon,
      data: { ...weatherData, source },
      fetchedAt: now,
    });
  }

  await HistoryCollection.create({
    user: userId,
    weather: weather._id,
    lat,
    lon,
    requestedAt: now,
    data: {
      source,
      city: weatherData?.name,
      tempC: weatherData.main.temp,
      description: weatherData.weather[0].description,
    },
  });

  return {
    source,
    data: weatherData,
    fetchedAt: weather.fetchedAt,
  };
};
