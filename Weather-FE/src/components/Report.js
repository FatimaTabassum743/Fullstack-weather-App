import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, List, ListItem, ListItemText, Box, CircularProgress, AppBar, Toolbar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import styled from '@emotion/styled';

// Styled components using Emotion
const StyledPaper = styled(Paper)`
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #ffffff;
`;

const Report = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch reports when the component mounts
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await API.get('/reports');
        setReports(response.data);
      } catch (err) {
        alert('Error fetching report');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear any stored tokens or session data
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    navigate('/login'); // Redirect to the login page
  };

  // Navigate to the weather search page
  const goToWeatherSearch = () => {
    navigate('/weather-search');
  };

  return (
    <>
      {/* AppBar for Logout and Navigation */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6">Weather App</Typography>
          <Box>
            <Button color="inherit" onClick={goToWeatherSearch}>
              Search Weather
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Weather Report Content */}
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Weather Search Report
        </Typography>

        {/* Loading indicator */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <StyledPaper elevation={3}>
            <List>
              {reports.length === 0 ? (
                <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                  No reports found.
                </Typography>
              ) : (
                reports.map((report, index) => (
                  <ListItem key={index} divider sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                    <ListItemText
                      primary={<Typography variant="h6">{`${report.username} searched for ${report.city}`}</Typography>}
                      secondary={
                        <Typography variant="body2">
                          Temperature: {report.temperature}°C, Condition: {report.condition}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </StyledPaper>
        )}
      </Container>
    </>
  );
};

export default Report;
