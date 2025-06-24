import { Response, NextFunction } from 'express';
import { fetchOrGetCachedWeather } from '../services/weather.service';
import { OK, BAD_REQUEST } from '../utils/http-status';
import { AuthRequest } from '../middleware/auth.middleware';

export const getWeather = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lon = parseFloat(req.query.lon as string);

    if (isNaN(lat)) {
      res.status(BAD_REQUEST).json({ message: 'lat is required' });
      return;
    }

    if (isNaN(lon)) {
      res.status(BAD_REQUEST).json({ message: 'lon is required' });
      return;
    }

    const result = await fetchOrGetCachedWeather(lat, lon, req.user._id);

    res.status(OK).json({
      source: result.source,
      coordinates: {
        lat: lat.toFixed(2),
        lon: lon.toFixed(2)
      },
      tempC: result.data.main.temp,
      humidity: result.data.main.humidity,
      description: result.data.weather[0].description,
      fetchedAt: result.fetchedAt,
    });

  } catch (error: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      message: 'Error in getWeather',
    });
  }
};
