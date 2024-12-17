const express = require('express');
const { searchWeather, getReports } = require('../controllers/weatherController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/weather', auth, searchWeather);
router.get('/reports', auth, getReports);

module.exports = router;
