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
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2} fontWeight={700} align="center">Thông tin cá nhân</Typography>
        <Typography><b>Username:</b> {user.username}</Typography>
        <Typography><b>Email:</b> {user.email}</Typography>
        <Typography><b>Role:</b> {user.role}</Typography>
        <Typography><b>Created At:</b> {new Date(user.created_at * 1000).toLocaleString()}</Typography>
      </Paper>
    </Box>
  );
};

export default ProfilePage; 