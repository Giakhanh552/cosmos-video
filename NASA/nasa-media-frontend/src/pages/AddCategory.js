import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/categories', { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Thêm danh mục thành công!');
      setTimeout(() => navigate('/categories'), 1500);
    } catch (err) {
      setError('Thêm danh mục thất bại!');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" mb={2} fontWeight={700} align="center">Thêm Danh Mục</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Tên danh mục" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} required />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Thêm</Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddCategory; 