"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = exports.refreshToken = exports.signIn = exports.signUp = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = require("../models/User.model");
const jwt_1 = require("../config/jwt");
const error_1 = require("../utils/error");
const http_status_1 = require("../utils/http-status");
const signUp = async (userData) => {
    const existingUser = await User_model_1.UsersCollection.findOne({ email: userData.email });
    if (existingUser) {
        throw new error_1.AppError('Email already exists', http_status_1.BAD_REQUEST);
    }
    const user = await User_model_1.UsersCollection.create(userData);
    const { accessToken, refreshToken } = await generateTokens(user);
    return { user, accessToken, refreshToken };
};
exports.signUp = signUp;
const signIn = async (email, passwordHash) => {
    const user = await User_model_1.UsersCollection.findOne({ email });
    if (!user) {
        throw new error_1.AppError('Invalid credentials', http_status_1.UNAUTHORIZED);
    }
    const { accessToken, refreshToken } = await generateTokens(user);
    return { user, accessToken, refreshToken };
};
exports.signIn = signIn;
const refreshToken = async (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.secret);
        if (decoded.type !== 'refresh') {
            throw new error_1.AppError('Invalid token type', http_status_1.UNAUTHORIZED);
        }
        const user = await User_model_1.UsersCollection.findOne({ id: decoded.user.id });
        if (!user) {
            throw new error_1.AppError('User not found or inactive', http_status_1.UNAUTHORIZED);
        }
        return generateTokens(user);
    }
    catch (error) {
        throw new error_1.AppError('Invalid refresh token', http_status_1.UNAUTHORIZED);
    }
};
exports.refreshToken = refreshToken;
const generateTokens = async (user) => {
    const accessToken = jsonwebtoken_1.default.sign({
        type: 'access',
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    }, jwt_1.jwtConfig.secret, jwt_1.jwtConfig.accessToken.options);
    const refreshToken = jsonwebtoken_1.default.sign({
        type: 'refresh',
        user: {
            id: user.id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    }, jwt_1.jwtConfig.secret, jwt_1.jwtConfig.refreshToken.options);
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
