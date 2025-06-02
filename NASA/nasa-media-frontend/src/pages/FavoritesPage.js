import React, { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, CardActionArea, CircularProgress, Box, Alert } from '@mui/material';
import axios from 'axios';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = JSON.parse(atob(token.split('.')[1])).user_id;
        const res = await axios.get(`http://localhost:8080/favorites?user_id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data);
      } catch (err) {
        setError('Không thể tải danh sách yêu thích!');
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (loading) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;
  if (!favorites || favorites.length === 0) return <Box mt={8} textAlign="center"><Typography variant="h6" color="text.secondary">Chưa có video nào được yêu thích.</Typography></Box>;

  return (
    <Box mt={2}>
      <Typography variant="h5" mb={2} fontWeight={700}>Danh sách yêu thích</Typography>
      <Grid container spacing={3}>
        {favorites.map(fav => (
          <Grid item xs={12} sm={6} md={4} key={fav.video_id}>
            <Card>
              <CardActionArea>
                <CardContent>
                  <Typography variant="body1">Video ID: {fav.video_id}</Typography>
                  <Typography variant="body2" color="text.secondary">User ID: {fav.user_id}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FavoritesPage; 