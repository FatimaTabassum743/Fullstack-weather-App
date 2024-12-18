import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import WeatherSearch from './components/WeatherSearch';
import Report from './components/Report';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {token ? (
          <>
            <Route path="/weather" element={<WeatherSearch />} />
            <Route path="/reports" element={<Report />} />
            <Route path="*" element={<Navigate to="/weather" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
