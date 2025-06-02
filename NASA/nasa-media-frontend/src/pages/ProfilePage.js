import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch (err) {
        setError('Không thể tải thông tin user!');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!user) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: 'transparent' }}>
      <Box
        sx={{
          backdropFilter: 'blur(16px)',
          background: 'rgba(35,41,70,0.25)',
          borderRadius: 4,
          border: '1.5px solid rgba(255,255,255,0.15)',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.17)',
          p: 4,
          width: 350,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" mb={2} fontWeight={700} align="center" sx={{ color: '#fff', textShadow: '0 0 8px #fff8' }}>Thông tin cá nhân</Typography>
        <Typography sx={{ color: '#fff' }}><b>Username:</b> {user.username}</Typography>
        <Typography sx={{ color: '#fff' }}><b>Email:</b> {user.email}</Typography>
        <Typography sx={{ color: '#fff' }}><b>Role:</b> {user.role}</Typography>
        <Typography sx={{ color: '#fff' }}><b>Created At:</b> {new Date(user.created_at * 1000).toLocaleString()}</Typography>
      </Box>
    </Box>
  );
};

export default ProfilePage; 