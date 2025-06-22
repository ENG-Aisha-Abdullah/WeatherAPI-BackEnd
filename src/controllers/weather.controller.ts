import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import WeatherCollection from '../models/Weather.model';
import HistoryCollection from '../models/History.model';
import { OK, BAD_REQUEST } from '../utils/http-status';
import { AuthRequest } from '../middleware/auth.middleware';

export const getWeather = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {

  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);
    const userId = req.user.id;

    if (!lat || !lon) {
      res.status(BAD_REQUEST).json({ message: 'lat and lon are required' });
      return;
    }

    const now = new Date();
    const CACHE_DURATION_MS = 10 * 60 * 1000; 
    let cached = await WeatherCollection.findOne({ lat, lon });

    let weatherData;
    let source: 'cache' | 'api';

    if (cached && now.getTime() - cached.fetchedAt.getTime() < CACHE_DURATION_MS) {
      weatherData = cached.data;
      source = 'cache';
    } else {
      const apiKey = process.env.WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    //    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=6d2002e4d7759fc039323f3af05f9de5`;
      const response = await axios.get(url);
      weatherData = response.data;
      source = 'api';

      if (cached) {
        cached.data = weatherData;
        cached.fetchedAt = now;
        await cached.save();
      } else {
        cached = await WeatherCollection.create({ lat, lon, data: weatherData, fetchedAt: now });
      }
    }

    await HistoryCollection.create({
      user: userId,
      lat,
      lon,
      data: weatherData,
      fetchedAt: now,
      weather: cached._id
    });

    res.status(OK).json({ source, data: weatherData });
  } catch (err) {
    next(err);
  }
};
