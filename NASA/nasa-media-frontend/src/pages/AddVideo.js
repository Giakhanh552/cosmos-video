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
  const [uploading, setUploading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

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

  // Hàm upload file video
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post('http://localhost:8080/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUrl(res.data.url); // server trả về { url: ... }
      setSuccess('Tải video lên thành công!');
    } catch (err) {
      setError('Tải video lên thất bại! ' + (err.response?.data?.error || err.message));
    } finally {
      setUploading(false);
    }
  };

  // Hàm gọi Groq API để sinh tiêu đề và mô tả
  async function fetchGroqTitleDesc(url) {
    const prompt = `Viết tiêu đề và mô tả ngắn cho video này: ${url}`;
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }]
      })
    });
    const data = await res.json();
    const text = data.choices[0].message.content;
    // Tách tiêu đề và mô tả
    const [titleLine, ...descLines] = text.split('\n');
    const title = titleLine.replace(/^Tiêu đề: ?/, '').trim();
    const description = descLines.join('\n').replace(/^Mô tả: ?/, '').trim();
    return { title, description };
  }

  const handleAutoFill = async () => {
    setLoadingAI(true);
    setError('');
    try {
      const { title, description } = await fetchGroqTitleDesc(url);
      setTitle(title);
      setDescription(description);
    } catch {
      setError('Không thể lấy mô tả tự động!');
    }
    setLoadingAI(false);
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
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5" mb={2} fontWeight={700} align="center" sx={{ color: '#fff', textShadow: '0 0 8px #fff8' }}>Thêm Video</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField label="Tiêu đề" fullWidth margin="normal" value={title} onChange={e => setTitle(e.target.value)} required
            InputProps={{ style: { color: '#fff', background: 'rgba(255,255,255,0.05)', borderRadius: 8 } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
          <TextField label="Mô tả" fullWidth margin="normal" value={description} onChange={e => setDescription(e.target.value)} required
            InputProps={{ style: { color: '#fff', background: 'rgba(255,255,255,0.05)', borderRadius: 8 } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
          <TextField label="URL Video" fullWidth margin="normal" value={url} onChange={e => {
            setUrl(e.target.value);
            const thumb = getYouTubeThumbnail(e.target.value);
            if (thumb) setThumbnail(thumb);
          }} required
            InputProps={{ style: { color: '#fff', background: 'rgba(255,255,255,0.05)', borderRadius: 8 } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
          <TextField label="Thumbnail" fullWidth margin="normal" value={thumbnail} onChange={e => setThumbnail(e.target.value)} required
            InputProps={{ style: { color: '#fff', background: 'rgba(255,255,255,0.05)', borderRadius: 8 } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          />
          <TextField select label="Danh mục" fullWidth margin="normal" value={category} onChange={e => setCategory(e.target.value)} required
            InputProps={{ style: { color: '#fff', background: 'rgba(255,255,255,0.05)', borderRadius: 8 } }}
            InputLabelProps={{ style: { color: '#fff' } }}
          >
            {categories.map(cat => (
              <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2, mb: 1, borderRadius: 8, boxShadow: '0 0 16px #7C3AED88' }}
            disabled={uploading}
          >
            {uploading ? 'Đang tải lên...' : 'Tải video'}
            <input type="file" accept="video/*" hidden onChange={handleFileChange} />
          </Button>
          <Button
            onClick={handleAutoFill}
            disabled={!url || loadingAI}
            variant="outlined"
            color="secondary"
            sx={{ mb: 2, borderRadius: 8 }}
          >
            {loadingAI ? 'Đang tạo AI...' : 'Tạo tiêu đề & mô tả tự động'}
          </Button>
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2, borderRadius: 8, boxShadow: '0 0 16px #7C3AED88' }}>Thêm</Button>
        </form>
      </Box>
    </Box>
  );
};

export default AddVideo; 