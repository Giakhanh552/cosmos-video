import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, MenuItem } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddVideo = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/categories').then(res => setCategories(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8080/videos', {
        title,
        description,
        url,
        thumbnail,
        category_id: category
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Thêm video thành công!');
      setTimeout(() => navigate('/videos'), 1500);
    } catch (err) {
      setError('Thêm video thất bại!');
    }
  };

  // Thêm hàm lấy thumbnail YouTube
  function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  function getYouTubeThumbnail(url) {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={2} fontWeight={700} align="center">Thêm Video</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Tiêu đề" fullWidth margin="normal" value={title} onChange={e => setTitle(e.target.value)} required />
          <TextField label="Mô tả" fullWidth margin="normal" value={description} onChange={e => setDescription(e.target.value)} required />
          <TextField label="URL Video" fullWidth margin="normal" value={url} onChange={e => {
            setUrl(e.target.value);
            const thumb = getYouTubeThumbnail(e.target.value);
            if (thumb) setThumbnail(thumb);
          }} required />
          <TextField label="Thumbnail" fullWidth margin="normal" value={thumbnail} onChange={e => setThumbnail(e.target.value)} required />
          <TextField select label="Danh mục" fullWidth margin="normal" value={category} onChange={e => setCategory(e.target.value)} required>
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Thêm</Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AddVideo; 