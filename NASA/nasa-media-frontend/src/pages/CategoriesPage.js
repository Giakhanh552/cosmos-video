import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Paper, Typography, CircularProgress, Box, Alert } from '@mui/material';
import axios from 'axios';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:8080/categories');
        setCategories(res.data);
      } catch (err) {
        setError('Không thể tải danh sách category!');
      }
    };
    fetchCategories();
  }, []);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!categories.length) return <Box display="flex" justifyContent="center" mt={8}><CircularProgress /></Box>;

  return (
    <Box mt={2} display="flex" justifyContent="center">
      <Paper sx={{ width: 400 }}>
        <Typography variant="h5" mb={2} fontWeight={700} align="center">Danh mục</Typography>
        <List>
          {categories.map(cat => (
            <ListItem key={cat.id}>
              <ListItemText primary={cat.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CategoriesPage; 