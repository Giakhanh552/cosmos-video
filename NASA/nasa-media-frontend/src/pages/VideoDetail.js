import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, CardContent, CircularProgress, Alert, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem } from '@mui/material';
import axios from 'axios';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();

  // Lấy role từ token
  let isAdmin = false;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.role === 'admin';
    }
  } catch {}

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/videos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideo(res.data);
      } catch (err) {
        setError('Không thể tải video!');
      }
    };
    fetchVideo();
  }, [id]);

  // Hàm lấy YouTube ID
  function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  function isYouTubeUrl(url) {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
  }

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa video này?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/videos');
    } catch (err) {
      setError('Xóa video thất bại!');
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!video) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        {isYouTubeUrl(video.url) ? (
          <iframe
            width="100%"
            height="320"
            src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : video.url ? (
          <video width="100%" height="320" controls src={video.url} poster={video.thumbnail} />
        ) : (
          <CardMedia component="img" height="320" image={video.thumbnail} alt={video.title} />
        )}
        <CardContent>
          <Typography variant="h5" fontWeight={700}>{video.title}</Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>{video.description}</Typography>
          <Typography variant="body2" color="text.secondary">Category: {video.category_id}</Typography>
          <Typography variant="body2" color="text.secondary">Uploader: {video.uploader_id}</Typography>
          <Box mt={2} display="flex" gap={2}>
            {isAdmin && <>
              <Button variant="contained" color="primary" onClick={() => setShowEdit(true)}>Sửa</Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>Xóa</Button>
            </>}
          </Box>
        </CardContent>
      </Card>
      <Dialog open={showEdit} onClose={() => setShowEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cập nhật Video</DialogTitle>
        <DialogContent>
          {isAdmin && <UpdateVideoForm video={video} onSuccess={() => { setShowEdit(false); setError(''); window.location.reload(); }} onError={setError} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

function UpdateVideoForm({ video, onSuccess, onError }) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [url, setUrl] = useState(video.url);
  const [thumbnail, setThumbnail] = useState(video.thumbnail);
  const [category, setCategory] = useState(video.category_id);
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:8080/categories').then(res => setCategories(res.data));
  }, []);
  function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  function getYouTubeThumbnail(url) {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/videos/${video.id}`, {
        title,
        description,
        url,
        thumbnail,
        category_id: category
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError('Cập nhật video thất bại!');
    }
  };
  return (
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
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Lưu</Button>
    </form>
  );
}

export default VideoDetail; 