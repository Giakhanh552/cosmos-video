import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, CardActionArea, CircularProgress, Box, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token');
        let url = 'http://localhost:8080/videos';
        if (categoryId) {
          url = `http://localhost:8080/categories/${categoryId}/videos`;
        }
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideos(res.data);
      } catch (err) {
        setError('Không thể tải danh sách video!');
      }
    };
    fetchVideos();
  }, [categoryId]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      if (!categoryId) return;
      try {
        const res = await axios.get(`http://localhost:8080/categories`);
        const found = res.data.find(cat => cat.id === categoryId);
        setCategoryName(found ? found.name : "");
      } catch {}
    };
    fetchCategoryName();
  }, [categoryId]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!videos.length) return (
    <Box mt={8} textAlign="center">
      <Typography variant="h6" color="text.secondary">
        {categoryId && categoryName
          ? `Hiện tại chưa có video nào trong ${categoryName}`
          : "Hiện tại chưa có video nào."}
      </Typography>
    </Box>
  );

  return (
    <Box mt={2}>
      <Grid container spacing={3}>
        {videos.map(video => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: '0 4px 24px 0 rgba(31,38,135,0.17)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-8px) scale(1.03)', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.27)' }, background: 'rgba(35,41,70,0.7)', backdropFilter: 'blur(4px)' }}>
              <CardActionArea sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', height: '100%' }} onClick={() => navigate(`/videos/${video.id}`)}>
                <CardMedia
                  component="img"
                  image={video.thumbnail}
                  alt={video.title}
                  sx={{ height: 200, objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', minHeight: 100 }}>
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1, minHeight: 48, color: 'primary.main', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{video.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40, overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.description.slice(0, 80)}...</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VideosPage; 