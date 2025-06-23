import { Request, Response } from 'express';
import HistoryCollection from '../models/History.model';
import { OK, BAD_REQUEST } from '../utils/http-status';
import { AuthRequest } from '../middleware/auth.middleware';

export const getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;

    const history = await HistoryCollection
      .find({ user: userId })
      .populate('weather')
      .sort({ requestedAt: -1 });

    const allHistory = history.map(entry => {
      const weatherData = (entry.weather as any)?.data || {};
      return {
        lat: entry.lat,
        lon: entry.lon,
        requestedAt: entry.requestedAt,
        weather: {
          city: weatherData?.name || 'Unknown',
          source: weatherData?.source || 'unknown',
          tempC: weatherData?.main?.temp || null,
          description: weatherData?.weather?.[0]?.description || '',
        },
      };
    });

    res.status(OK).json(allHistory);
  } catch (error: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      message: 'Error in getHistory',
    });
  }
};
