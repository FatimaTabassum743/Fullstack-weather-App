import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Grid, Paper } from '@mui/material';
import styled  from '@emotion/styled';

// Styled components using Emotion
const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f4f6f9;
`;

const StyledPaper = styled(Paper)`
  padding: 30px;
  width: 100%;
  max-width: 400px;
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
`;

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);

      localStorage.setItem('token', res.data.token);
      // localStorage.setItem('user details ', res.data);
      console.log(res.data,"details")
      navigate('/weather');
    } catch (err) {
      alert('Login failed. Invalid credentials.');
    }
  };

  return (
    <StyledContainer>
      <StyledPaper>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </Box>
          <Box mb={3}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </Box>
          <StyledButton type="submit" variant="contained">
            Login
          </StyledButton>
        </form>
        <Grid container justifyContent="flex-end" mt={2}>
          <Typography variant="body2">
            Don't have an account? <a href="/signup">Sign Up</a>
          </Typography>
        </Grid>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Login;
