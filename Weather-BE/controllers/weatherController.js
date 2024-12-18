const axios = require('axios');
const db = require('../models/WeatherSearch');
require('dotenv').config();

exports.searchWeather = async (req, res) => {
  const { city } = req.body;

  try {
    const weatherResponse = await axios.get(
      `http://api.weatherstack.com/current?access_key=613dc53cf06f24ca0c45f5802c257cfb&query=${city}`
    );

    // Check if the response has the expected data
    const weatherInfo = weatherResponse.data;
    if (!weatherInfo || !weatherInfo.current) {
      return res.status(400).json({ message: 'Invalid city name or no weather data available' });
    }

    // Proceed to insert only if the weather data is valid
    await db.query(
      'INSERT INTO weather_search (user_id, city, weather_info) VALUES (?, ?, ?)',
      [req.user.id, city, JSON.stringify(weatherInfo)]
    );

    res.json(weatherInfo);
  } catch (err) {
    console.error(err); // Log the error for better debugging
    res.status(500).json({ message: 'Error fetching weather data' });
  }
};


exports.getReports = async (req, res) => {
  try {
    const [reports] = await db.query(
      'SELECT ws.city, ws.weather_info, u.username FROM weather_search ws JOIN users u ON ws.user_id = u.id WHERE ws.user_id = ?',
      [req.user.id] // Use the user ID from the token
    );
    // Make sure the weather_info is included properly
    const formattedReports = reports.map(report => {
      return {
        ...report,
        weather_info: JSON.parse(report.weather_info), // Parse the weather_info
      };
    });

    res.json(formattedReports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
};


