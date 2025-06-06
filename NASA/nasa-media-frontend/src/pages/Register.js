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
  Stack,
  LinearProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Person,
  Lock,
  Rocket,
  Login as LoginIcon,
  CheckCircle
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Cấu hình axios
axios.defaults.withCredentials = true;

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const validateForm = () => {
    if (formData.username.length < 3) {
      setError('Tên tài khoản phải có ít nhất 3 ký tự!');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự!');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      await axios.post('http://localhost:8080/register', {
        username: formData.username,
        password: formData.password,
      });
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại! Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/) || password.match(/[^a-zA-Z0-9]/)) strength += 25;
    return strength;
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength <= 25) return '#EF4444';
    if (strength <= 50) return '#F59E0B';
    if (strength <= 75) return '#0EA5E9';
    return '#10B981';
  };

  const getStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength <= 25) return 'Yếu';
    if (strength <= 50) return 'Trung bình';
    if (strength <= 75) return 'Mạnh';
    return 'Rất mạnh';
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
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
                boxShadow: '0 20px 40px rgba(16, 185, 129, 0.2)',
              }}
            >
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(45deg, #10B981, #0EA5E9)',
                  borderRadius: '50%',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)',
                }}
                className="floating-animation"
              >
                <CheckCircle sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              
              <Typography 
                variant="h3" 
                fontWeight={700}
                sx={{ 
                  mb: 2,
                  background: 'linear-gradient(45deg, #10B981, #0EA5E9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Đăng Ký Thành Công!
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Tài khoản của bạn đã được tạo thành công. Bạn sẽ được chuyển đến trang đăng nhập...
              </Typography>

              <LinearProgress 
                sx={{ 
                  borderRadius: 2,
                  height: 6,
                  background: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(45deg, #10B981, #0EA5E9)',
                  }
                }} 
              />
            </Paper>
          </Fade>
        </Container>
      </Box>
    );
  }

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
                Đăng Ký
              </Typography>
              
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ maxWidth: 400, mx: 'auto' }}
              >
                Tham gia cộng đồng khám phá vũ trụ và bắt đầu hành trình của bạn
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

            {/* Register Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Tên tài khoản"
                  value={formData.username}
                  onChange={handleChange('username')}
                  required
                  helperText="Tối thiểu 3 ký tự, không có khoảng trắng"
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

                <Box>
                  <TextField
                    fullWidth
                    label="Mật khẩu"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange('password')}
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
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Độ mạnh mật khẩu:
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ color: getStrengthColor(), fontWeight: 600 }}
                        >
                          {getStrengthText()}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={getPasswordStrength()}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getStrengthColor(),
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>
                  )}
                </Box>

                <TextField
                  fullWidth
                  label="Xác nhận mật khẩu"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  required
                  error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                  helperText={
                    formData.confirmPassword && formData.password !== formData.confirmPassword 
                      ? 'Mật khẩu không khớp' 
                      : ''
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#7C3AED' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          sx={{ color: '#CBD5E1' }}
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                  startIcon={<PersonAdd />}
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
                  {loading ? 'Đang tạo tài khoản...' : 'Đăng Ký'}
                </Button>
              </Stack>
            </Box>

            {/* Divider */}
            <Divider sx={{ mb: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                hoặc
              </Typography>
            </Divider>

            {/* Login Link */}
            <Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Đã có tài khoản?
              </Typography>
              
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="large"
                startIcon={<LoginIcon />}
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
                Đăng Nhập Ngay
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

export default Register; 