import HistoryCollection from '../models/History.model';
import { Types } from 'mongoose';

export const getUserHistory = async (userId: Types.ObjectId) => {
  const history = await HistoryCollection
    .find({ user: userId })
    .populate('weather')
    .sort({ requestedAt: -1 });

  return history.map(entry => {
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
};
