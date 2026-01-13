import express from 'express';
import { getCurrentWeather } from '../controllers/weather.controller.js';

const router = express.Router();

router.get('/current', getCurrentWeather);

export default router;
