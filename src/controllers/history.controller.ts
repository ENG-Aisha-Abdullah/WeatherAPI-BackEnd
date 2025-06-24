import { Response } from 'express';
import { OK, BAD_REQUEST } from '../utils/http-status';
import { AuthRequest } from '../middleware/auth.middleware';
import { getUserHistory } from '../services/history.service';

export const getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const history = await getUserHistory(userId);

    res.status(OK).json(history);
  } catch (error: any) {
    res.status(BAD_REQUEST).json({
      success: false,
      message: 'Error in getHistory',
    });
  }
};
