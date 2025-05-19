import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardMedia, CardContent, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');

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

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!video) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;

  return (
    <Box mt={4} display="flex" justifyContent="center">
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardMedia component="img" height="320" image={video.thumbnail} alt={video.title} />
        <CardContent>
          <Typography variant="h5" fontWeight={700}>{video.title}</Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>{video.description}</Typography>
          <Typography variant="body2" color="text.secondary">Category: {video.category_id}</Typography>
          <Typography variant="body2" color="text.secondary">Uploader: {video.uploader_id}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VideoDetail; 