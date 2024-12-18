import React, { useState } from 'react';
import { Button, TextField, Typography, Box, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import API from '../services/api';

// Styled components using Emotion
const StyledContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f4f6f9;
`;

const StyledPaper = styled(Paper)`
  padding: 30px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background: #fff;
`;

const StyledButton = styled(Button)`
  background-color: #3f51b5;
  color: #fff;
  &:hover {
    background-color: #303f9f;
  }
  width: 100%;
  padding: 10px;
  margin-top: 20px;
`;

const StyledButton2 = styled(Button)`
  border-color: #3f51b5;
  color: #3f51b5;
  &:hover {
    background-color: #303f9f;
    color: #fff;
  }
  width: 100%;
  padding: 10px;
  margin-top: 20px;
`;

const WeatherSearch = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const navigate = useNavigate();

  const validateCityName = (cityName) => {
    const cityRegex = /^[a-zA-Z\s]+$/; // Allows only alphabetic characters and spaces
    return cityRegex.test(cityName.trim());
  };

  const handleSearch = async () => {
    if (!validateCityName(city)) {
      setPopupMessage('Please enter a valid city name. Only alphabets are allowed.');
      setPopupOpen(true);
      return;
    }

    try {
      const res = await API.post('/weather', { city });
      const data = res.data;

      // Check if the response contains the necessary fields
      if (!data || !data.location || !data.current) {
        throw new Error('Invalid data structure');
      }

      setWeatherData(data);
    } catch (err) {
      setPopupMessage('Failed to fetch weather data. Please try again.');
      setPopupOpen(true);
    }
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const goToReport = () => {
    navigate('/reports');
  };

  return (
    <StyledContainer>
      <StyledPaper>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Weather Search
        </Typography>

        {/* Input to Enter City */}
        <TextField
          label="Enter city name"
          variant="outlined"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
          margin="normal"
        />

        {/* Button to Fetch Weather Data */}
        <StyledButton onClick={handleSearch} variant="contained">
          Get Weather
        </StyledButton>

        {/* Button to View Reports */}
        <StyledButton2
          variant="outlined"
          color="secondary"
          onClick={goToReport}
          fullWidth
          sx={{ marginTop: '10px' }}
        >
          View Reports
        </StyledButton2>

        {/* Display Weather Data */}
        {weatherData && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              Weather in {weatherData.location.name}, {weatherData.location.country}
            </Typography>
            <Typography variant="body1">
              <strong>Temperature:</strong> {weatherData.current.temperature}°C
            </Typography>
            <Typography variant="body1">
              <strong>Condition:</strong> {weatherData.current.weather_descriptions[0]}
            </Typography>
            <Typography variant="body1">
              <strong>Humidity:</strong> {weatherData.current.humidity}%
            </Typography>
            <img
              src={weatherData.current.weather_icons[0]}
              alt="weather icon"
              style={{ marginTop: '10px', width: '50px' }}
            />
          </Box>
        )}

        {/* Popup for Invalid Input or Error */}
        <Dialog open={popupOpen} onClose={closePopup}>
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <Typography>{popupMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closePopup} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </StyledPaper>
    </StyledContainer>
  );
};

export default WeatherSearch;
