import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Fade,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import {
  PlayArrow,
  Rocket,
  Public,
  StarBorder,
  VideoLibrary,
  Category,
  Favorite,
  TrendingUp,
  ExploreOutlined,
  Science,
  Satellite
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [stats, setStats] = useState({ videos: 0, categories: 0, users: 0 });
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        // Fetch videos
        const videosRes = await axios.get('http://localhost:8080/videos', { headers });
        const videos = videosRes.data || [];
        
        // Fetch categories
        const categoriesRes = await axios.get('http://localhost:8080/categories', { headers });
        const categories = categoriesRes.data || [];
        
        setStats({
          videos: videos.length,
          categories: categories.length,
          users: 1000 // Mock data
        });
        
        // Set featured videos (first 3)
        setFeaturedVideos(videos.slice(0, 3));
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const features = [
    {
      icon: <VideoLibrary sx={{ fontSize: 40 }} />,
      title: 'Video Chất Lượng Cao',
      description: 'Khám phá hàng ngàn video về vũ trụ với chất lượng 4K từ NASA và các nguồn uy tín',
      color: '#7C3AED'
    },
    {
      icon: <Science sx={{ fontSize: 40 }} />,
      title: 'Nội Dung Khoa Học',
      description: 'Học hỏi từ các chuyên gia hàng đầu về thiên văn học và khám phá vũ trụ',
      color: '#0EA5E9'
    },
    {
      icon: <Satellite sx={{ fontSize: 40 }} />,
      title: 'Cập Nhật Liên Tục',
      description: 'Luôn được cập nhật những khám phá mới nhất từ không gian vũ trụ',
      color: '#10B981'
    }
  ];

  const StatCard = ({ number, label, icon, color }) => (
    <Fade in timeout={600}>
      <Card className="glassmorphism hover-lift" sx={{ textAlign: 'center', p: 3 }}>
        <Box sx={{ color, mb: 2 }}>
          {icon}
        </Box>
        <Typography variant="h3" fontWeight={800} className="gradient-text">
          {number.toLocaleString()}+
        </Typography>
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          {label}
        </Typography>
      </Card>
    </Fade>
  );

  const FeatureCard = ({ feature, index }) => (
    <Fade in timeout={800 + index * 200}>
      <Card 
        className="glassmorphism hover-lift"
        sx={{ 
          height: '100%',
          p: 3,
          transition: 'all 0.3s ease',
          '&:hover': {
            '& .feature-icon': {
              transform: 'scale(1.1) rotate(5deg)',
            }
          }
        }}
      >
        <Box 
          className="feature-icon"
          sx={{ 
            color: feature.color, 
            mb: 2,
            transition: 'transform 0.3s ease',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          {feature.icon}
        </Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, color: '#fff' }}>
          {feature.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          {feature.description}
        </Typography>
      </Card>
    </Fade>
  );

  const FeaturedVideoCard = ({ video, index }) => {
    const getYouTubeVideoId = (url) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYouTubeVideoId(video.url);
    const thumbnail = video.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : '/default-thumb.jpg');

    return (
      <Fade in timeout={1000 + index * 200}>
        <Card 
          className="glassmorphism hover-lift"
          sx={{ 
            cursor: 'pointer',
            overflow: 'hidden',
            '&:hover .play-overlay': { opacity: 1 }
          }}
          onClick={() => navigate(`/videos/${video.id}`)}
        >
          <Box sx={{ position: 'relative' }}>
            <Box
              component="img"
              src={thumbnail}
              alt={video.title}
              sx={{
                width: '100%',
                height: 200,
                objectFit: 'cover',
              }}
            />
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
              <IconButton
                sx={{
                  background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                  color: 'white',
                  width: 56,
                  height: 56,
                  '&:hover': {
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <PlayArrow sx={{ fontSize: 28 }} />
              </IconButton>
            </Box>
          </Box>
          <CardContent>
            <Typography 
              variant="h6" 
              fontWeight={600}
              sx={{
                color: '#fff',
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {video.title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {video.description}
            </Typography>
          </CardContent>
        </Card>
      </Fade>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 8, pt: 4 }}>
          <Fade in timeout={400}>
            <Box>
              <Box sx={{ mb: 3 }}>
                <Rocket 
                  className="floating-animation" 
                  sx={{ 
                    fontSize: 80, 
                    color: '#7C3AED',
                    filter: 'drop-shadow(0 0 20px rgba(124, 58, 237, 0.5))'
                  }} 
                />
              </Box>
              
              <Typography 
                variant="h1" 
                className="gradient-text fade-in-up"
                sx={{ 
                  mb: 2,
                  textShadow: '0 0 40px rgba(124, 58, 237, 0.3)',
                }}
              >
                NASA Cosmos Explorer
              </Typography>
              
              <Typography 
                variant="h5" 
                color="text.secondary" 
                sx={{ 
                  mb: 4, 
                  maxWidth: 800, 
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontWeight: 400
                }}
                className="fade-in-up"
              >
                Khám phá vũ trụ bao la qua những video chất lượng cao từ NASA 
                và các nguồn khoa học uy tín trên thế giới
              </Typography>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                justifyContent="center"
                sx={{ mb: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ExploreOutlined />}
                  component={Link}
                  to="/videos"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: '2rem',
                    boxShadow: '0 8px 32px rgba(124, 58, 237, 0.4)',
                  }}
                >
                  Khám Phá Ngay
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Category />}
                  component={Link}
                  to="/categories"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    borderRadius: '2rem',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                    }
                  }}
                >
                  Danh Mục
                </Button>
              </Stack>

              {/* Quick Stats */}
              <Stack 
                direction="row" 
                spacing={4} 
                justifyContent="center"
                sx={{ 
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Chip 
                  icon={<VideoLibrary />}
                  label={`${stats.videos} Videos`}
                  sx={{
                    background: 'rgba(124, 58, 237, 0.2)',
                    color: '#7C3AED',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    fontWeight: 600,
                  }}
                />
                <Chip 
                  icon={<Category />}
                  label={`${stats.categories} Danh Mục`}
                  sx={{
                    background: 'rgba(14, 165, 233, 0.2)',
                    color: '#0EA5E9',
                    border: '1px solid rgba(14, 165, 233, 0.3)',
                    fontWeight: 600,
                  }}
                />
                <Chip 
                  icon={<TrendingUp />}
                  label={`${stats.users}+ Người Dùng`}
                  sx={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10B981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontWeight: 600,
                  }}
                />
              </Stack>
            </Box>
          </Fade>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h3" 
            textAlign="center" 
            fontWeight={700}
            className="gradient-text"
            sx={{ mb: 6 }}
          >
            Tính Năng Nổi Bật
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard feature={feature} index={index} />
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Featured Videos */}
        {featuredVideos.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography 
              variant="h3" 
              textAlign="center" 
              fontWeight={700}
              className="gradient-text"
              sx={{ mb: 6 }}
            >
              Video Nổi Bật
            </Typography>
            
            <Grid container spacing={4}>
              {featuredVideos.map((video, index) => (
                <Grid item xs={12} md={4} key={video.id}>
                  <FeaturedVideoCard video={video} index={index} />
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                component={Link}
                to="/videos"
                sx={{
                  borderRadius: '2rem',
                  px: 3,
                }}
              >
                Xem Tất Cả Videos
              </Button>
            </Box>
          </Box>
        )}

        {/* Call to Action */}
        <Box 
          className="glassmorphism"
          sx={{ 
            textAlign: 'center', 
            py: 6,
            px: 4,
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
            border: '1px solid rgba(124, 58, 237, 0.2)',
          }}
        >
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: '#fff' }}>
            Bắt Đầu Hành Trình Khám Phá
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
            Tham gia cộng đồng khám phá vũ trụ và cập nhật những khám phá mới nhất
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              component={Link}
              to="/register"
              sx={{
                borderRadius: '2rem',
                px: 4,
                py: 1.5,
              }}
            >
              Đăng Ký Ngay
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/login"
              sx={{
                borderRadius: '2rem',
                px: 4,
                py: 1.5,
              }}
            >
              Đăng Nhập
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 