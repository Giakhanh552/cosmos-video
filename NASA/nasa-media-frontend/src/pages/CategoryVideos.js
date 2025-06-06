import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Chip,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Fade,
  Stack,
  IconButton
} from '@mui/material';
import {
  VideoLibrary,
  Category as CategoryIcon,
  Home,
  PlayArrow,
  ArrowBack,
  Visibility,
  AccessTime
} from '@mui/icons-material';
import axios from 'axios';

const CategoryVideos = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategoryVideos();
    fetchCategoryInfo();
  }, [categoryId]);

  const fetchCategoryVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`http://localhost:8080/categories/${categoryId}/videos`, {
        headers
      });
      setVideos(response.data || []);
    } catch (err) {
      console.error('Error fetching category videos:', err);
      setError('Không thể tải video của danh mục này');
    }
  };

  const fetchCategoryInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get('http://localhost:8080/categories', { headers });
      const categories = response.data || [];
      const foundCategory = categories.find(cat => cat._id === categoryId);
      setCategory(foundCategory);
    } catch (err) {
      console.error('Error fetching category info:', err);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeThumbnail = (url) => {
    try {
      const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return videoId ? `https://img.youtube.com/vi/${videoId[1]}/maxresdefault.jpg` : null;
    } catch {
      return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const VideoCard = ({ video, index }) => (
    <Fade in timeout={400 + index * 100}>
      <Card
        className="glassmorphism hover-lift"
        sx={{
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            '& .play-overlay': {
              opacity: 1,
            },
            '& .video-thumbnail': {
              transform: 'scale(1.05)',
            }
          }
        }}
      >
        <CardActionArea 
          onClick={() => navigate(`/videos/${video._id}`)}
          sx={{ height: '100%' }}
        >
          {/* Video Thumbnail */}
          <Box sx={{ position: 'relative', overflow: 'hidden' }}>
            <CardMedia
              component="img"
              height="200"
              image={video.thumbnail || getYouTubeThumbnail(video.url) || '/placeholder-video.jpg'}
              alt={video.title}
              className="video-thumbnail"
              sx={{
                transition: 'transform 0.3s ease',
                objectFit: 'cover'
              }}
            />
            
            {/* Play Overlay */}
            <Box
              className="play-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <PlayArrow sx={{ fontSize: 48, color: '#fff' }} />
            </Box>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Title */}
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                color: '#fff',
                mb: 1,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
                minHeight: '2.6em'
              }}
            >
              {video.title}
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.4,
                minHeight: '2.8em'
              }}
            >
              {video.description}
            </Typography>

            {/* Tags */}
            {video.tags && video.tags.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {video.tags.slice(0, 3).map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    sx={{
                      background: 'linear-gradient(45deg, rgba(124, 58, 237, 0.2), rgba(14, 165, 233, 0.2))',
                      color: '#7C3AED',
                      border: '1px solid rgba(124, 58, 237, 0.3)',
                      fontSize: '0.7rem',
                      height: 24,
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* Meta Information */}
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Visibility sx={{ fontSize: 16, color: '#A1A1AA' }} />
                  <Typography variant="caption" color="text.secondary">
                    {video.views || 0}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime sx={{ fontSize: 16, color: '#A1A1AA' }} />
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(video.created_at)}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Fade>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} sx={{ color: '#7C3AED' }} />
        </Box>
      </Container>
    );
  }

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Fade in timeout={400}>
        <Box>
          {/* Breadcrumbs */}
          <Box sx={{ mb: 4 }}>
            <Breadcrumbs
              aria-label="breadcrumb"
              sx={{
                '& .MuiBreadcrumbs-separator': {
                  color: '#A1A1AA',
                },
                '& .MuiBreadcrumbs-ol': {
                  alignItems: 'center',
                }
              }}
            >
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate('/')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  '&:hover': { color: '#7C3AED' }
                }}
              >
                <Home sx={{ fontSize: 20 }} />
                Trang chủ
              </Link>
              <Link
                underline="hover"
                color="inherit"
                onClick={() => navigate('/categories')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#A1A1AA',
                  cursor: 'pointer',
                  '&:hover': { color: '#7C3AED' }
                }}
              >
                <CategoryIcon sx={{ fontSize: 20 }} />
                Danh mục
              </Link>
              <Typography
                color="text.primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: '#7C3AED',
                  fontWeight: 600
                }}
              >
                <VideoLibrary sx={{ fontSize: 20 }} />
                {category?.name || 'Danh mục'}
              </Typography>
            </Breadcrumbs>
          </Box>

          {/* Back Button */}
          <Box sx={{ mb: 4 }}>
            <IconButton
              onClick={() => navigate('/categories')}
              sx={{
                color: '#7C3AED',
                background: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                '&:hover': {
                  background: 'rgba(124, 58, 237, 0.2)',
                }
              }}
            >
              <ArrowBack />
            </IconButton>
          </Box>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ mb: 3 }}>
              <VideoLibrary 
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
              {category?.name || 'Danh mục'}
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}
            >
              {category?.description || 'Khám phá các video trong danh mục này'}
            </Typography>

            <Chip
              icon={<VideoLibrary />}
              label={`${videos.length} video${videos.length !== 1 ? 's' : ''}`}
              sx={{
                background: 'linear-gradient(45deg, rgba(124, 58, 237, 0.2), rgba(14, 165, 233, 0.2))',
                color: '#7C3AED',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                fontWeight: 600,
                fontSize: '0.9rem',
                px: 2
              }}
            />
          </Box>

          {/* Videos Grid */}
          {videos.length > 0 ? (
            <Grid container spacing={3}>
              {videos.map((video, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                  <VideoCard video={video} index={index} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                px: 2,
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(14, 165, 233, 0.1))',
                borderRadius: 4,
                border: '2px solid rgba(124, 58, 237, 0.3)',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
                  animation: 'shimmer 2s infinite',
                },
                '@keyframes shimmer': {
                  '0%': { transform: 'translateX(-100%)' },
                  '100%': { transform: 'translateX(100%)' },
                },
              }}
            >
              <VideoLibrary sx={{ 
                fontSize: 80, 
                color: '#7C3AED', 
                mb: 2,
                filter: 'drop-shadow(0 0 20px rgba(124, 58, 237, 0.5))'
              }} />
              <Typography 
                variant="h4" 
                fontWeight={700} 
                sx={{ 
                  color: '#7C3AED', 
                  mb: 1,
                  textShadow: '0 0 10px rgba(124, 58, 237, 0.5)',
                  background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Coming Soon 🚀
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#A1A1AA', 
                  mb: 3,
                  fontStyle: 'italic'
                }}
              >
                Danh mục này sắp có nội dung thú vị. Hãy đón chờ nhé!
              </Typography>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 3
              }}>
                {[...Array(3)].map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#7C3AED',
                      animation: `pulse 1.5s infinite ${i * 0.2}s`,
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
                        '50%': { opacity: 1, transform: 'scale(1.2)' },
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </Box>
      </Fade>
    </Container>
  );
};

export default CategoryVideos; 