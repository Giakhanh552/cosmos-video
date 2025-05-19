import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => (
  <Box textAlign="center" mt={8}>
    <Typography variant="h2" gutterBottom fontWeight={700} color="primary">
      NASA Media Explorer
    </Typography>
    <Typography variant="h5" color="text.secondary" mb={4}>
      Khám phá vũ trụ qua hình ảnh và video chất lượng cao từ NASA và các nguồn uy tín!
    </Typography>
    <Button variant="contained" color="primary" size="large" component={Link} to="/videos">
      Khám phá Video
    </Button>
  </Box>
);

export default Home; 