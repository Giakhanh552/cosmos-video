import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Alert, 
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Fade,
  Chip,
  IconButton,
  Button,
  Stack
} from '@mui/material';
import {
  Category as CategoryIcon,
  VideoLibrary,
  Add,
  FilterList,
  Search,
  GridView,
  ViewList
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();
  
  // Check admin role
  let isAdmin = false;
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.role === 'admin';
    }
  } catch {}

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        const res = await axios.get('http://localhost:8080/categories', { headers });
        setCategories(res.data || []);
      } catch (err) {
        setError('Không thể tải danh sách danh mục!');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  const categoryIcons = [
    '🚀', '🛸', '🌌', '⭐', '🌟', '🔭', '🌍', '🌙', 
    '☄️', '🛰️', '👨‍🚀', '🔬', '🌠', '🪐', '🌕', '🌑'
  ];

  const getRandomIcon = (index) => {
    return categoryIcons[index % categoryIcons.length];
  };

  const CategoryCard = ({ category, index }) => (
    <Fade in timeout={600 + index * 100}>
      <Card 
        className="glassmorphism hover-lift"
        sx={{ 
          height: '100%',
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          '&:hover': {
            '& .category-icon': {
              transform: 'scale(1.2) rotate(10deg)',
            },
            '& .hover-overlay': {
              opacity: 1,
            }
          }
        }}
      >
        <CardActionArea 
          onClick={() => {
            console.log('🔍 Category clicked:', category);
            console.log('🔍 Category ID:', category._id);
            console.log('🔍 Navigating to:', `/categories/${category._id}/videos`);
            navigate(`/categories/${category._id}/videos`);
          }}
          sx={{ height: '100%', p: 3 }}
        >
          <CardContent sx={{ textAlign: 'center', p: 0 }}>
            {/* Category Icon */}
            <Box
              className="category-icon"
              sx={{
                fontSize: '3rem',
                mb: 2,
                transition: 'transform 0.3s ease',
                display: 'block',
              }}
            >
              {getRandomIcon(index)}
            </Box>

            {/* Category Name */}
            <Typography 
              variant="h6" 
              fontWeight={700}
              sx={{ 
                color: '#fff',
                mb: 1,
                textAlign: 'center'
              }}
            >
              {category.name}
            </Typography>

            {/* Description */}
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                mb: 2,
                textAlign: 'center',
                minHeight: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {category.description || 'Khám phá các video trong danh mục này'}
            </Typography>

            {/* Video Count or Coming Soon */}
            {(category.video_count || 0) > 0 ? (
              <Chip
                icon={<VideoLibrary />}
                label={`${category.video_count} videos`}
                size="small"
                sx={{
                  background: 'linear-gradient(45deg, rgba(124, 58, 237, 0.2), rgba(14, 165, 233, 0.2))',
                  color: '#7C3AED',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  fontWeight: 500,
                }}
              />
            ) : (
              <Chip
                label="🚀 Coming Soon"
                size="small"
                sx={{
                  background: 'linear-gradient(45deg, rgba(255, 165, 0, 0.2), rgba(255, 140, 0, 0.2))',
                  color: '#FF8C00',
                  border: '1px solid rgba(255, 140, 0, 0.3)',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  animation: 'glow 2s ease-in-out infinite alternate',
                  '@keyframes glow': {
                    from: { boxShadow: '0 0 5px rgba(255, 140, 0, 0.3)' },
                    to: { boxShadow: '0 0 15px rgba(255, 140, 0, 0.6)' },
                  },
                }}
              />
            )}
          </CardContent>
        </CardActionArea>

        {/* Hover Overlay */}
        <Box
          className="hover-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <Button
            variant="contained"
            startIcon={<VideoLibrary />}
            sx={{
              background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
              borderRadius: '2rem',
              px: 3,
              pointerEvents: 'auto',
              '&:hover': {
                background: 'linear-gradient(45deg, #8B5CF6, #06B6D4)',
              }
            }}
          >
            Xem Videos
          </Button>
        </Box>
      </Card>
    </Fade>
  );

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error"
          sx={{
            borderRadius: 3,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} sx={{ color: '#7C3AED' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={400}>
        <Box>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ mb: 3 }}>
              <CategoryIcon 
                className="floating-animation" 
                sx={{ 
                  fontSize: 60, 
                  color: '#7C3AED',
                  filter: 'drop-shadow(0 0 20px rgba(124, 58, 237, 0.5))'
                }} 
              />
            </Box>
            
            <Typography 
              variant="h2" 
              fontWeight={700}
              className="gradient-text"
              sx={{ mb: 2 }}
            >
              Danh Mục Video
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              Khám phá các chủ đề khác nhau về vũ trụ và khoa học vũ trụ
            </Typography>

            {/* Action Bar */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center"
              alignItems="center"
              sx={{ mb: 4 }}
            >
              {/* View Mode Toggle */}
              <Stack direction="row" spacing={1}>
                <IconButton
                  onClick={() => setViewMode('grid')}
                  sx={{
                    color: viewMode === 'grid' ? '#7C3AED' : '#CBD5E1',
                    background: viewMode === 'grid' ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(124, 58, 237, 0.1)',
                    }
                  }}
                >
                  <GridView />
                </IconButton>
                
                <IconButton
                  onClick={() => setViewMode('list')}
                  sx={{
                    color: viewMode === 'list' ? '#7C3AED' : '#CBD5E1',
                    background: viewMode === 'list' ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(124, 58, 237, 0.1)',
                    }
                  }}
                >
                  <ViewList />
                </IconButton>
              </Stack>

              {/* Admin Add Button */}
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/add-category')}
                  sx={{
                    background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                    borderRadius: '2rem',
                    px: 3,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #8B5CF6, #06B6D4)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Thêm Danh Mục
                </Button>
              )}
            </Stack>

            {/* Stats */}
            <Chip
              icon={<CategoryIcon />}
              label={`${categories.length} danh mục`}
              sx={{
                background: 'rgba(124, 58, 237, 0.2)',
                color: '#7C3AED',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 1,
              }}
            />
          </Box>

          {/* Categories Grid */}
          {categories.length > 0 ? (
            <Grid container spacing={4}>
              {categories.map((category, index) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={6} 
                  md={4} 
                  lg={3} 
                  key={category.id}
                >
                  <CategoryCard category={category} index={index} />
                </Grid>
              ))}
            </Grid>
          ) : (
            /* Empty State */
            <Box
              className="glassmorphism"
              sx={{
                textAlign: 'center',
                py: 8,
                px: 4,
                background: 'rgba(24, 18, 43, 0.3)',
              }}
            >
              <CategoryIcon 
                sx={{ 
                  fontSize: 80, 
                  color: '#94A3B8',
                  mb: 3,
                  opacity: 0.5
                }} 
              />
              
              <Typography variant="h5" fontWeight={600} sx={{ mb: 2, color: '#fff' }}>
                Chưa có danh mục nào
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Hãy thêm danh mục đầu tiên để tổ chức các video của bạn
              </Typography>

              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => navigate('/add-category')}
                  sx={{
                    background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                    borderRadius: '2rem',
                    px: 4,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #8B5CF6, #06B6D4)',
                    }
                  }}
                >
                  Thêm Danh Mục Đầu Tiên
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Fade>
    </Container>
  );
};

export default CategoriesPage; 