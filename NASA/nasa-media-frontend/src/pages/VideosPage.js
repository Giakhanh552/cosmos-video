import React, { useEffect, useState } from 'react';
import { 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  CardActionArea, 
  CircularProgress, 
  Box, 
  Alert,
  Container,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Fade,
  Skeleton,
  Button,
  Badge,
  Avatar
} from '@mui/material';
import {
  Search as SearchIcon,
  PlayArrow,
  VideoLibrary,
  Category as CategoryIcon,
  AccessTime,
  Visibility,
  Star,
  FilterList,
  ViewModule,
  ViewList
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryName, setCategoryName] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate();
  const { categoryId } = useParams();

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        let url = 'http://localhost:8080/videos';
        if (categoryId) {
          url = `http://localhost:8080/categories/${categoryId}/videos`;
        }
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideos(res.data || []);
        setFilteredVideos(res.data || []);
      } catch (err) {
        setError('Không thể tải danh sách video!');
      } finally {
        setLoading(false);
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

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (video.tags && video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
      setFilteredVideos(filtered);
    }
  }, [searchTerm, videos]);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('vi-VN');
  };

  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const VideoCardSkeleton = () => (
    <Card sx={{
      height: 400,
      borderRadius: '24px',
      background: 'rgba(24, 18, 43, 0.25)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <Skeleton variant="rectangular" height={220} sx={{ borderRadius: '24px 24px 0 0' }} />
      <CardContent>
        <Skeleton variant="text" height={32} />
        <Skeleton variant="text" height={20} width="80%" />
        <Skeleton variant="text" height={20} width="60%" />
      </CardContent>
    </Card>
  );

  const VideoCard = ({ video, index }) => {
    const youtubeId = getYouTubeVideoId(video.url);
    const thumbnail = video.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : '/default-thumb.jpg');

    return (
      <Fade in={true} timeout={300 + index * 100}>
        <Card
          sx={{
            height: 400,
            borderRadius: '24px',
            background: 'rgba(24, 18, 43, 0.25)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            overflow: 'hidden',
            '&:hover': {
              transform: 'translateY(-12px) scale(1.02)',
              boxShadow: '0 20px 40px 0 rgba(124, 58, 237, 0.4)',
              border: '1px solid rgba(124, 58, 237, 0.5)',
              '& .play-overlay': {
                opacity: 1,
              },
              '& .video-thumbnail': {
                transform: 'scale(1.1)',
              }
            }
          }}
        >
          <CardActionArea 
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
            onClick={() => navigate(`/videos/${video.id}`)}
          >
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
              <CardMedia
                component="img"
                image={thumbnail}
                alt={video.title}
                className="video-thumbnail"
                sx={{
                  height: 220,
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease',
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
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                }}
              >
                <IconButton
                  sx={{
                    background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                    color: 'white',
                    width: 64,
                    height: 64,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #8B5CF6, #06B6D4)',
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <PlayArrow sx={{ fontSize: 32 }} />
                </IconButton>
              </Box>

              {/* Duration Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  background: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                <AccessTime sx={{ fontSize: 12, mr: 0.5 }} />
                {video.duration || ''}
              </Box>
            </Box>

            <CardContent sx={{ flex: 1, p: 3 }}>
              {/* Title */}
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: '#fff',
                  mb: 1,
                  fontSize: '1.1rem',
                  lineHeight: 1.3,
                  height: '2.6rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {video.title}
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: '#A1A1AA',
                  mb: 2,
                  height: '3rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: 1.5,
                }}
              >
                {video.description}
              </Typography>

              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {video.tags.slice(0, 3).map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag}
                      size="small"
                      sx={{
                        background: 'linear-gradient(45deg, #7C3AED22, #0EA5E922)',
                        color: '#7C3AED',
                        border: '1px solid rgba(124, 58, 237, 0.3)',
                        fontSize: '0.7rem',
                        height: 24,
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* Meta Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                <Typography variant="caption" sx={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime sx={{ fontSize: 14 }} />
                  {video.created_at ? formatDate(video.created_at) : 'Gần đây'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Badge badgeContent={video.views || 0} color="primary" max={999}>
                    <Visibility sx={{ fontSize: 16, color: '#6B7280' }} />
                  </Badge>
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </Fade>
    );
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
            color: '#fff'
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <VideoLibrary sx={{ fontSize: 40, color: '#7C3AED', mr: 2 }} />
          <Typography 
            variant="h3" 
            fontWeight={700}
            sx={{ 
              color: '#fff',
              textShadow: '0 0 20px #7C3AED88',
              background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {categoryName ? `${categoryName}` : 'Khám Phá Vũ Trụ'}
          </Typography>
        </Box>
        
        <Typography variant="h6" sx={{ color: '#A1A1AA', mb: 3 }}>
          {categoryName 
            ? `Khám phá những video tuyệt vời về ${categoryName.toLowerCase()}`
            : 'Bộ sưu tập video khám phá vũ trụ từ NASA và các nguồn uy tín'
          }
        </Typography>

        {/* Search and Controls */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between'
        }}>
          <TextField
            placeholder="Tìm kiếm video, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flex: 1,
              maxWidth: { xs: '100%', md: 400 },
              '& .MuiOutlinedInput-root': {
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 3,
                color: '#fff',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.2)',
                },
                '&:hover fieldset': {
                  borderColor: '#7C3AED',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#7C3AED',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#7C3AED' }} />
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              onClick={() => setViewMode('grid')}
              sx={{
                background: viewMode === 'grid' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                color: viewMode === 'grid' ? '#7C3AED' : '#A1A1AA',
                '&:hover': { background: 'rgba(124, 58, 237, 0.3)' }
              }}
            >
              <ViewModule />
            </IconButton>
            <IconButton
              onClick={() => setViewMode('list')}
              sx={{
                background: viewMode === 'list' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)',
                color: viewMode === 'list' ? '#7C3AED' : '#A1A1AA',
                '&:hover': { background: 'rgba(124, 58, 237, 0.3)' }
              }}
            >
              <ViewList />
            </IconButton>
          </Box>
        </Box>

        {/* Results Count */}
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
            {loading ? 'Đang tải...' : `Tìm thấy ${filteredVideos.length} video`}
          </Typography>
          {searchTerm && (
            <Chip
              label={`Tìm kiếm: "${searchTerm}"`}
              onDelete={() => setSearchTerm('')}
              size="small"
              sx={{
                background: 'rgba(124, 58, 237, 0.2)',
                color: '#7C3AED',
                border: '1px solid rgba(124, 58, 237, 0.3)',
              }}
            />
          )}
        </Box>
      </Box>

      {/* Videos Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {[...Array(8)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <VideoCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filteredVideos.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 8,
            background: 'rgba(24, 18, 43, 0.25)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <VideoLibrary sx={{ fontSize: 80, color: '#374151', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#6B7280', mb: 1 }}>
            {searchTerm ? 'Không tìm thấy video nào' : 'Chưa có video nào'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#9CA3AF' }}>
            {searchTerm 
              ? `Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc`
              : categoryName 
                ? `Chưa có video nào trong ${categoryName}`
                : 'Hãy quay lại sau để khám phá những video mới'
            }
          </Typography>
          {searchTerm && (
            <Button 
              variant="contained" 
              onClick={() => setSearchTerm('')}
              sx={{ 
                mt: 2,
                background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                borderRadius: 3
              }}
            >
              Xóa tìm kiếm
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredVideos.map((video, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video.id}>
              <VideoCard video={video} index={index} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default VideosPage; 