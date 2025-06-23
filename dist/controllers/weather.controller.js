"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const Weather_model_1 = __importDefault(require("../models/Weather.model"));
const History_model_1 = __importDefault(require("../models/History.model"));
const http_status_1 = require("../utils/http-status");
const getWeather = async (req, res, next) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lon = parseFloat(req.query.lon);
        const userId = req.user._id;
        if (isNaN(lat)) {
            res.status(http_status_1.BAD_REQUEST).json({ message: 'lat is required' });
            return;
        }
        if (isNaN(lon)) {
            res.status(http_status_1.BAD_REQUEST).json({ message: 'lon is required' });
            return;
        }
        const now = new Date();
        const findLat = parseFloat(lat.toFixed(2));
        const finfLot = parseFloat(lon.toFixed(2));
        let weather = await Weather_model_1.default.findOne({ lat: findLat, lon: finfLot });
        let source;
        let weatherData;
        if (weather) {
            source = 'cache';
            weatherData = weather.data;
        }
        else {
            const apiKey = process.env.WEATHER_API_KEY;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
            const response = await axios_1.default.get(url);
            weatherData = response.data;
            source = 'openweather';
            weather = await Weather_model_1.default.create({
                lat: findLat,
                lon: finfLot,
                data: {
                    ...weatherData,
                    source: "openweather"
                },
                fetchedAt: now,
            });
        }
        await History_model_1.default.create({
            user: userId,
            weather: weather._id,
            lat: lat,
            lon: lon,
            requestedAt: now,
            data: {
                source,
                city: weatherData?.name,
                tempC: weatherData.main.temp,
                description: weatherData.weather[0].description,
            },
        });
        res.status(http_status_1.OK).json({
            source,
            coordinates: { lat: lat.toFixed(2), lon: lon.toFixed(2), },
            tempC: weatherData.main.temp,
            humidity: weatherData.main.humidity,
            description: weatherData.weather[0].description,
            fetchedAt: weather.fetchedAt,
        });
    }
    catch (error) {
        res.status(http_status_1.BAD_REQUEST).json({
            success: false,
            message: 'Error in getWeather',
        });
    }
};
exports.getWeather = getWeather;
