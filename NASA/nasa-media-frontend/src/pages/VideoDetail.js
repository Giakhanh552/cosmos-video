import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  CircularProgress, 
  Alert, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  MenuItem,
  Container,
  Grid,
  Chip,
  IconButton,
  Fade,
  Avatar,
  Divider,
  Stack,
  Paper
} from '@mui/material';
import {
  PlayArrow,
  Edit,
  Delete,
  Share,
  Favorite,
  FavoriteBorder,
  AccessTime,
  Visibility,
  ThumbUp,
  Comment,
  Category as CategoryIcon,
  Person,
  ArrowBack,
  FullscreenOutlined
} from '@mui/icons-material';
import axios from 'axios';

const VideoDetail = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
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
    const fetchVideo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8080/videos/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVideo(res.data);
        
        // Fetch related videos
        const relatedRes = await axios.get('http://localhost:8080/videos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const related = (relatedRes.data || [])
          .filter(v => v.id !== id)
          .slice(0, 4);
        setRelatedVideos(related);
      } catch (err) {
        setError('Không thể tải video!');
      }
    };
    fetchVideo();
  }, [id]);

  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const isYouTubeUrl = (url) => {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa video này?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/videos');
    } catch (err) {
      setError('Xóa video thất bại!');
    }
  };

  const handleFavorite = async () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite API call
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const RelatedVideoCard = ({ video }) => {
    const youtubeId = getYouTubeId(video.url);
    const thumbnail = video.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '/default-thumb.jpg');

    return (
      <Card 
        className="glassmorphism hover-lift"
        sx={{ 
          cursor: 'pointer',
          mb: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(8px)',
          }
        }}
        onClick={() => navigate(`/videos/${video.id}`)}
      >
        <Box sx={{ display: 'flex', height: 120 }}>
          <CardMedia
            component="img"
            sx={{ width: 160, height: 120, objectFit: 'cover' }}
            image={thumbnail}
            alt={video.title}
          />
          <CardContent sx={{ flex: 1, p: 2 }}>
            <Typography 
              variant="subtitle2" 
              fontWeight={600}
              sx={{
                color: '#fff',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                mb: 1,
                lineHeight: 1.3,
              }}
            >
              {video.title}
            </Typography>
            <Typography 
              variant="caption" 
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
        </Box>
      </Card>
    );
  };

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

  if (!video) {
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
      <Fade in timeout={600}>
        <Box>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 3,
              color: '#CBD5E1',
              '&:hover': {
                background: 'rgba(124, 58, 237, 0.1)',
                color: '#7C3AED',
              }
            }}
          >
            Quay lại
          </Button>

          <Grid container spacing={4}>
            {/* Main Video Section */}
            <Grid item xs={12} lg={8}>
              <Card className="glassmorphism" sx={{ mb: 3, overflow: 'hidden' }}>
                {/* Video Player */}
                <Box sx={{ position: 'relative', aspectRatio: '16/9', background: '#000' }}>
                  {isYouTubeUrl(video.url) ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}?autoplay=0`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ 
                        borderRadius: '0',
                        border: 'none'
                      }}
                    />
                  ) : video.url ? (
                    <video 
                      width="100%" 
                      height="100%" 
                      controls 
                      src={video.url} 
                      poster={video.thumbnail}
                      style={{ 
                        borderRadius: '0',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <CardMedia 
                      component="img" 
                      height="100%" 
                      image={video.thumbnail} 
                      alt={video.title}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  
                  {/* Fullscreen Button */}
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.9)',
                      }
                    }}
                  >
                    <FullscreenOutlined />
                  </IconButton>
                </Box>
              </Card>

              {/* Video Info */}
              <Card className="glassmorphism" sx={{ p: 4 }}>
                <Typography 
                  variant="h4" 
                  fontWeight={700} 
                  sx={{ 
                    color: '#fff', 
                    mb: 3,
                    lineHeight: 1.3
                  }}
                >
                  {video.title}
                </Typography>

                {/* Action Buttons */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  sx={{ mb: 3 }}
                  alignItems={{ xs: 'stretch', sm: 'center' }}
                  justifyContent="space-between"
                >
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Button
                      variant="outlined"
                      startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                      onClick={handleFavorite}
                      sx={{
                        borderRadius: '2rem',
                        color: isFavorite ? '#F87171' : '#CBD5E1',
                        borderColor: isFavorite ? '#F87171' : 'rgba(255,255,255,0.2)',
                      }}
                    >
                      {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      sx={{
                        borderRadius: '2rem',
                        color: '#CBD5E1',
                        borderColor: 'rgba(255,255,255,0.2)',
                      }}
                    >
                      Chia sẻ
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<ThumbUp />}
                      sx={{
                        borderRadius: '2rem',
                        color: '#CBD5E1',
                        borderColor: 'rgba(255,255,255,0.2)',
                      }}
                    >
                      Thích
                    </Button>
                  </Stack>

                  {/* Admin Actions */}
                  {isAdmin && (
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => setShowEdit(true)}
                        sx={{
                          background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                          borderRadius: '2rem',
                        }}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={handleDelete}
                        sx={{
                          borderRadius: '2rem',
                          borderColor: '#EF4444',
                          color: '#EF4444',
                          '&:hover': {
                            borderColor: '#DC2626',
                            background: 'rgba(239, 68, 68, 0.1)',
                          }
                        }}
                      >
                        Xóa
                      </Button>
                    </Stack>
                  )}
                </Stack>

                {/* Meta Information */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={3} 
                  sx={{ mb: 3 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTime sx={{ fontSize: 20, color: '#94A3B8' }} />
                    <Typography variant="body2" color="text.secondary">
                      {video.created_at ? formatDate(video.created_at) : 'Không rõ'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Visibility sx={{ fontSize: 20, color: '#94A3B8' }} />
                    <Typography variant="body2" color="text.secondary">
                      {video.views || 0} lượt xem
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ fontSize: 20, color: '#94A3B8' }} />
                    <Typography variant="body2" color="text.secondary">
                      ID: {video.uploader_id}
                    </Typography>
                  </Box>
                </Stack>

                {/* Tags */}
                {video.tags && video.tags.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#fff' }}>
                      Tags
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {video.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          sx={{
                            background: 'linear-gradient(45deg, rgba(124, 58, 237, 0.2), rgba(14, 165, 233, 0.2))',
                            color: '#7C3AED',
                            border: '1px solid rgba(124, 58, 237, 0.3)',
                            fontWeight: 500,
                          }}
                        />
                      ))}
                    </Stack>
                  </Box>
                )}

                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Description */}
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: '#fff' }}>
                  Mô tả
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary" 
                  sx={{ 
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {video.description}
                </Typography>
              </Card>
            </Grid>

            {/* Sidebar */}
            <Grid item xs={12} lg={4}>
              {/* Related Videos */}
              <Card className="glassmorphism" sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#fff' }}>
                  Video liên quan
                </Typography>
                {relatedVideos.map((relatedVideo) => (
                  <RelatedVideoCard key={relatedVideo.id} video={relatedVideo} />
                ))}
                {relatedVideos.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Không có video liên quan
                  </Typography>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Edit Dialog */}
      <Dialog 
        open={showEdit} 
        onClose={() => setShowEdit(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(24, 18, 43, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 3,
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
          Cập nhật Video
        </DialogTitle>
        <DialogContent>
          {isAdmin && (
            <UpdateVideoForm 
              video={video} 
              onSuccess={() => { 
                setShowEdit(false); 
                setError(''); 
                window.location.reload(); 
              }} 
              onError={setError} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

function UpdateVideoForm({ video, onSuccess, onError }) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [url, setUrl] = useState(video.url);
  const [thumbnail, setThumbnail] = useState(video.thumbnail);
  const [category, setCategory] = useState(video.category_id);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/categories').then(res => setCategories(res.data));
  }, []);

  function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  function getYouTubeThumbnail(url) {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/videos/${video.id}`, {
        title,
        description,
        url,
        thumbnail,
        category_id: category
      }, { headers: { Authorization: `Bearer ${token}` } });
      if (onSuccess) onSuccess();
    } catch (err) {
      if (onError) onError('Cập nhật video thất bại!');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField 
        label="Tiêu đề" 
        fullWidth 
        margin="normal" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        required 
      />
      <TextField 
        label="Mô tả" 
        fullWidth 
        multiline
        rows={4}
        margin="normal" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        required 
      />
      <TextField 
        label="URL Video" 
        fullWidth 
        margin="normal" 
        value={url} 
        onChange={e => {
          setUrl(e.target.value);
          const thumb = getYouTubeThumbnail(e.target.value);
          if (thumb) setThumbnail(thumb);
        }} 
        required 
      />
      <TextField 
        label="Thumbnail" 
        fullWidth 
        margin="normal" 
        value={thumbnail} 
        onChange={e => setThumbnail(e.target.value)} 
        required 
      />
      <TextField 
        select 
        label="Danh mục" 
        fullWidth 
        margin="normal" 
        value={category} 
        onChange={e => setCategory(e.target.value)} 
        required
      >
        {categories.map(cat => (
          <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
        ))}
      </TextField>
      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        sx={{ 
          mt: 3,
          background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
          borderRadius: 2,
          py: 1.5,
        }}
      >
        Lưu thay đổi
      </Button>
    </Box>
  );
}

export default VideoDetail; 