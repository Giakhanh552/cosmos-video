import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, CardActionArea, CircularProgress, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/videos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideos(res.data);
      } catch (err) {
        setError('Không thể tải danh sách video!');
      }
    };
    fetchVideos();
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!videos.length) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;

  return (
    <Box mt={2}>
      <Grid container spacing={3}>
        {videos.map(video => (
          <Grid item xs={12} sm={6} md={4} key={video.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/videos/${video.id}`)}>
                <CardMedia component="img" height="180" image={video.thumbnail} alt={video.title} />
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>{video.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{video.description.slice(0, 80)}...</Typography>
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