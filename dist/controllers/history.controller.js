"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistory = void 0;
const History_model_1 = __importDefault(require("../models/History.model"));
const http_status_1 = require("../utils/http-status");
const getHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const history = await History_model_1.default
            .find({ user: userId })
            .populate('weather')
            .sort({ requestedAt: -1 });
        const allHistory = history.map(entry => {
            const weatherData = entry.weather?.data || {};
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
        res.status(http_status_1.OK).json(allHistory);
    }
    catch (error) {
        res.status(http_status_1.BAD_REQUEST).json({
            success: false,
            message: 'Error in getHistory',
        });
    }
};
exports.getHistory = getHistory;
