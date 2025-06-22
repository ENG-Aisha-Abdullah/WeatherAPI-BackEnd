import { Request, Response } from 'express';
import HistoryCollection from '../models/History.model';
import { OK } from '../utils/http-status';
import { AuthRequest } from '../middleware/auth.middleware';

export const getHistory = async (req: AuthRequest, res: Response, next: (err: any) => void): Promise<void> => {
  try {
    const userId = req.user.id;

const history = await HistoryCollection.find({ user: userId }).populate('weather').sort({ requestedAt: -1 });

    res.status(OK).json(history);
  } catch (err) {
    next(err);
  }
};
