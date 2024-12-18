import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, Grid, Paper } from '@mui/material';
import styled from '@emotion/styled'; // Corrected import

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

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';

    if (name === 'username') {
      if (!value) {
        error = 'Username is required.';
      } else if (!/^[a-zA-Z0-9_]{3,}$/.test(value)) {
        error = 'Username must be at least 3 characters long and contain only letters, numbers, or underscores.';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Password is required.';
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
      ) {
        error =
          'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.';
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  const validateForm = () => {
    const validationErrors = {};
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));
    return !Object.values(errors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await API.post('/auth/signup', formData);
        alert('Signup successful! Please login.');
        navigate('/login');
      } catch (err) {
        alert('Signup failed. User might already exist.');
      }
    }
  };

  return (
    <StyledContainer>
      <StyledPaper>
        <Typography variant="h4" align="center" color="primary" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              required
            />
          </Box>
          <Box mb={3}>
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              required
            />
          </Box>
          <StyledButton type="submit" variant="contained">
            Sign Up
          </StyledButton>
        </form>
        <Grid container justifyContent="flex-end" mt={2}>
          <Typography variant="body2">
            Already have an account? <a href="/login">Login</a>
          </Typography>
        </Grid>
      </StyledPaper>
    </StyledContainer>
  );
};

export default Signup;
