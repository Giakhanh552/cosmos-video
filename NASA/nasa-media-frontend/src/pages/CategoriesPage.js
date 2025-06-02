import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Paper, Typography, CircularProgress, Box, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      <Paper sx={{ width: 400, background: 'rgba(35,41,70,0.25)', backdropFilter: 'blur(16px)', borderRadius: 4, border: '1.5px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px 0 rgba(31,38,135,0.17)' }}>
        <Typography variant="h5" mb={2} fontWeight={700} align="center">Danh mục</Typography>
        <List>
          {categories.map(cat => (
            <ListItem button key={cat.id} onClick={() => navigate(`/categories/${cat.id}/videos`)}>
              <ListItemText primary={cat.name} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default CategoriesPage; 