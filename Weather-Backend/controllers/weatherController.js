const axios = require('axios');
const db = require('../models/WeatherSearch');
require('dotenv').config();

exports.searchWeather = async (req, res) => {
  const { city } = req.body;

  try {
    const weatherResponse = await axios.get(
      `http://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${city}`
    );

    const weatherInfo = weatherResponse.data;
    await db.query(
      'INSERT INTO weather_search (user_id, city, weather_info) VALUES (?, ?, ?)',
      [req.user.id, city, JSON.stringify(weatherInfo)]
    );

    res.json(weatherInfo);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching weather data' });
  }
};

exports.getReports = async (req, res) => {
  const [reports] = await db.query(
    'SELECT ws.city, ws.weather_info, u.username FROM weather_search ws JOIN users u ON ws.user_id = u.id'
  );
  res.json(reports);
};
