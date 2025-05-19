import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Cấu hình axios
axios.defaults.withCredentials = true;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    if (username.length < 3) {
      setError('Username phải có ít nhất 3 ký tự');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Email không hợp lệ');
      return false;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/register', 
        {
          username,
          email,
          password
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true
        }
      );

      setSuccess('Đăng ký thành công! Chuyển hướng đến trang đăng nhập...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.error || 'Đăng ký thất bại! Vui lòng thử lại.';
      setError(errorMessage);
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2} fontWeight={700} align="center">Đăng ký</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={e => setUsername(e.target.value)}
            helperText="Tối thiểu 3 ký tự"
            required
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={e => setPassword(e.target.value)}
            helperText="Tối thiểu 6 ký tự"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Đăng ký
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Register; 