import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8080/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      navigate('/videos');
    } catch (err) {
      setError('Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: 'transparent' }}>
      <Box
        sx={{
          backdropFilter: 'blur(10px)',
          background: 'rgba(24, 18, 43, 0.25)',
          borderRadius: '24px',
          border: '2px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
          p: 4,
          width: 350,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" mb={2} fontWeight={700} align="center" sx={{ color: '#fff', textShadow: '0 0 8px #fff8' }}>login</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField label="Username" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} required
            InputProps={{ style: { color: '#fff', background: 'rgba(255,255,255,0.05)', borderRadius: 8 } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} required
            InputProps={{ style: { color: '#fff', background: 'rgba(255,255,255,0.05)', borderRadius: 8 } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, borderRadius: 8, boxShadow: '0 0 16px #7C3AED88' }}>Login</Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login; 