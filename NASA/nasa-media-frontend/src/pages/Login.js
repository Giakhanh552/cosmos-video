import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Box,
  IconButton,
  InputAdornment,
  Fade,
  Divider,
  Stack
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Person,
  Lock,
  Rocket,
  PersonAdd
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/login', {
        username,
        password,
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      navigate('/');
    } catch (err) {
      setError('Tài khoản hoặc mật khẩu không đúng!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        position: 'relative',
      }}
    >
      <Container maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            className="glassmorphism"
            sx={{
              p: { xs: 3, sm: 5 },
              textAlign: 'center',
              background: 'rgba(24, 18, 43, 0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 4,
              boxShadow: '0 20px 40px rgba(124, 58, 237, 0.2)',
            }}
          >
            {/* Logo & Title */}
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                  borderRadius: '50%',
                  boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4)',
                }}
                className="floating-animation"
              >
                <Rocket sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography 
                variant="h3" 
                fontWeight={700}
                className="gradient-text"
                sx={{ mb: 1 }}
              >
                Đăng Nhập
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ maxWidth: 400, mx: 'auto' }}
              >
                Chào mừng trở lại! Hãy đăng nhập để tiếp tục khám phá vũ trụ
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#F87171'
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Tên tài khoản"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: '#7C3AED' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(124, 58, 237, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#7C3AED',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Mật khẩu"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#7C3AED' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: '#CBD5E1' }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.05)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(124, 58, 237, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#7C3AED',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={<LoginIcon />}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                    boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #8B5CF6, #06B6D4)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 40px rgba(124, 58, 237, 0.5)',
                    },
                    '&:disabled': {
                      background: 'rgba(124, 58, 237, 0.3)',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }
                  }}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </Button>
              </Stack>
            </Box>

            {/* Divider */}
            <Divider sx={{ mb: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                hoặc
              </Typography>
            </Divider>

            {/* Register Link */}
            <Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Chưa có tài khoản?
              </Typography>
              
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                size="large"
                startIcon={<PersonAdd />}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1.5,
                  borderColor: 'rgba(124, 58, 237, 0.5)',
                  color: '#7C3AED',
                  '&:hover': {
                    borderColor: '#7C3AED',
                    background: 'rgba(124, 58, 237, 0.1)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Đăng Ký Ngay
              </Button>
            </Box>

            {/* Back to Home */}
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Button
                component={Link}
                to="/"
                color="inherit"
                sx={{
                  color: '#CBD5E1',
                  '&:hover': {
                    color: '#7C3AED',
                    background: 'rgba(124, 58, 237, 0.1)',
                  }
                }}
              >
                ← Về trang chủ
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login; 