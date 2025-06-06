import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  CardMedia,
  Skeleton
} from '@mui/material';
import {
  CloudUpload,
  VideoLibrary,
  Category,
  Description,
  Title,
  Link as LinkIcon,
  Delete,
  AutoAwesome,
  Image as ImageIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddVideo = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    categoryId: '',
    tags: [],
    thumbnail: ''
  });
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoFillLoading, setAutoFillLoading] = useState(false);
  const [urlCheckLoading, setUrlCheckLoading] = useState(false);
  const [urlExists, setUrlExists] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:8080/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (err) {
      setError('Không thể tải danh sách thể loại');
    }
  };

  // Hàm lấy YouTube video ID từ URL
  const getYouTubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Hàm lấy Vimeo video ID từ URL
  const getVimeoVideoId = (url) => {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Hàm kiểm tra URL đã tồn tại hay chưa
  const checkUrlExists = async (url) => {
    setUrlCheckLoading(true);
    setUrlExists(false);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/search?search=${encodeURIComponent(url)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Check if any video has the exact same URL
      const existingVideo = response.data.find(video => video.url === url);
      if (existingVideo) {
        setUrlExists(true);
        setError('⚠️ Video với URL này đã tồn tại trong hệ thống. Vui lòng chọn video khác.');
        return true;
      } else {
        setUrlExists(false);
        setError(''); // Clear any previous error
        return false;
      }
    } catch (err) {
      console.error('URL check error:', err);
      // Don't show error for URL check, just continue
      setUrlExists(false);
      return false;
    } finally {
      setUrlCheckLoading(false);
    }
  };

  // Hàm auto-fill metadata từ video URL
  const autoFillVideoData = async (url) => {
    console.log('🔍 AI Auto-fill started with URL:', url);
    setAutoFillLoading(true);
    try {
      let videoData = null;

      // Check if it's YouTube
      const youtubeId = getYouTubeVideoId(url);
      if (youtubeId) {
        videoData = await fetchYouTubeData(youtubeId);
      } else {
        // Check if it's Vimeo
        const vimeoId = getVimeoVideoId(url);
        if (vimeoId) {
          videoData = await fetchVimeoData(vimeoId);
        } else {
          // Try oEmbed for other platforms
          videoData = await fetchOEmbedData(url);
        }
      }

      if (videoData) {
        const newFormData = {
          ...formData,
          url: url, // Use the passed URL parameter instead of formData.url
          title: videoData.title || formData.title,
          description: videoData.description || formData.description,
          thumbnail: videoData.thumbnail || formData.thumbnail
        };

        console.log('🔍 New form data before AI processing:', newFormData);

        // Auto-generate tags from title
        if (videoData.title) {
          const autoTags = generateTagsFromTitle(videoData.title);
          newFormData.tags = [...new Set([...formData.tags, ...autoTags])];
        }

        // 🤖 AI Auto-categorization
        if (videoData.title && categories.length > 0) {
          const selectedCategoryId = autoSelectCategory(
            videoData.title, 
            videoData.description || ''
          );
          if (selectedCategoryId) {
            newFormData.categoryId = selectedCategoryId;
            
            // Show notification about AI categorization
            const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);
            setSuccess(`🤖 AI đã tự động chọn thể loại: "${selectedCategory?.name}"`);
          }
        }
        
        console.log('🔍 Final form data with URL:', newFormData.url);
        setFormData(newFormData);
      }
    } catch (err) {
      console.error('Auto-fill error:', err);
    } finally {
      setAutoFillLoading(false);
    }
  };

  // Fetch YouTube data using oEmbed
  const fetchYouTubeData = async (videoId) => {
    try {
      const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      const response = await fetch(oEmbedUrl);
      const data = await response.json();
      
      return {
        title: data.title,
        description: `Video từ kênh: ${data.author_name}`,
        thumbnail: data.thumbnail_url
      };
    } catch (err) {
      throw new Error('Không thể lấy dữ liệu YouTube');
    }
  };

  // Fetch Vimeo data using oEmbed
  const fetchVimeoData = async (videoId) => {
    try {
      const oEmbedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`;
      const response = await fetch(oEmbedUrl);
      const data = await response.json();
      
      return {
        title: data.title,
        description: `Video từ Vimeo bởi: ${data.author_name}`,
        thumbnail: data.thumbnail_url
      };
    } catch (err) {
      throw new Error('Không thể lấy dữ liệu Vimeo');
    }
  };

  // Fetch data using generic oEmbed
  const fetchOEmbedData = async (url) => {
    try {
      const oEmbedUrl = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
      const response = await fetch(oEmbedUrl);
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      return {
        title: data.title,
        description: data.description || `Video từ ${data.provider_name}`,
        thumbnail: data.thumbnail_url
      };
    } catch (err) {
      throw new Error('Không thể lấy dữ liệu video');
    }
  };

  // Generate tags from title using simple AI logic
  const generateTagsFromTitle = (title) => {
    const spaceKeywords = ['space', 'cosmos', 'universe', 'galaxy', 'planet', 'star', 'astronomy', 'astronaut', 'rocket', 'satellite', 'moon', 'mars', 'earth', 'solar', 'nebula', 'black hole'];
    const words = title.toLowerCase().split(/\s+/);
    const tags = [];
    
    spaceKeywords.forEach(keyword => {
      if (title.toLowerCase().includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    // Add some general tags based on common space-related words
    if (words.some(word => ['explore', 'discovery', 'mission'].includes(word))) {
      tags.push('exploration');
    }
    if (words.some(word => ['beautiful', 'amazing', 'stunning'].includes(word))) {
      tags.push('amazing');
    }
    
    return tags.slice(0, 5); // Limit to 5 tags
  };

  // AI Auto-categorization function
  const autoSelectCategory = (title, description) => {
    const content = `${title} ${description}`.toLowerCase();
    
    // Tìm category "khác" hoặc tạo mới
    let otherCategory = categories.find(cat => 
      cat.name.toLowerCase().includes('khác') || 
      cat.name.toLowerCase().includes('other') ||
      cat.name.toLowerCase().includes('miscellaneous')
    );

    // Nếu không có category "khác", sẽ dùng category đầu tiên làm fallback
    const fallbackCategory = otherCategory || categories[0];

    // Định nghĩa các keywords cho từng loại category
    const categoryKeywords = {
      // Hành tinh và hệ mặt trời
      planets: ['planet', 'mars', 'venus', 'jupiter', 'saturn', 'mercury', 'neptune', 'uranus', 'earth', 'solar system', 'hành tinh', 'sao hỏa', 'sao kim', 'mặt trời'],
      
      // Thiên văn học và quan sát
      astronomy: ['telescope', 'observatory', 'constellation', 'astronomy', 'astronomer', 'observe', 'thiên văn', 'kính thiên văn', 'quan sát', 'chòm sao'],
      
      // Phi thuyền và tàu vũ trụ
      spacecraft: ['spacecraft', 'shuttle', 'rocket', 'launch', 'mission', 'apollo', 'artemis', 'tàu vũ trụ', 'phi thuyền', 'tên lửa', 'phóng'],
      
      // Phi hành gia
      astronauts: ['astronaut', 'cosmonaut', 'spacewalk', 'eva', 'crew', 'commander', 'phi hành gia', 'nhà du hành', 'đi bộ ngoài không gian'],
      
      // Khám phá vũ trụ
      exploration: ['exploration', 'discover', 'mission', 'probe', 'rover', 'khám phá', 'khám phá vũ trụ', 'tìm hiểu', 'nghiên cứu'],
      
      // Thiên hà và sao
      galaxies: ['galaxy', 'star', 'nebula', 'milky way', 'constellation', 'supernova', 'thiên hà', 'ngôi sao', 'tinh vân', 'dải ngân hà'],
      
      // Trạm vũ trụ
      space_station: ['space station', 'iss', 'international space station', 'orbital', 'trạm vũ trụ', 'trạm không gian quốc tế'],
      
      // Vệ tinh
      satellites: ['satellite', 'orbit', 'communication', 'weather', 'gps', 'vệ tinh', 'quỹ đạo'],
      
      // Lịch sử vũ trụ
      history: ['history', 'first', 'historical', 'vintage', 'archive', 'lịch sử', 'đầu tiên', 'cổ điển'],
      
      // Khoa học và công nghệ
      science: ['science', 'technology', 'research', 'experiment', 'physics', 'khoa học', 'công nghệ', 'nghiên cứu', 'thí nghiệm'],
      
      // Giáo dục
      education: ['education', 'learn', 'tutorial', 'explain', 'guide', 'course', 'giáo dục', 'học tập', 'hướng dẫn', 'giải thích'],
      
      // Tương lai và sci-fi
      future: ['future', 'sci-fi', 'science fiction', 'advanced', 'next generation', 'tương lai', 'khoa học viễn tưởng'],

      // Trái Đất từ không gian
      earth: ['earth from space', 'blue planet', 'home planet', 'atmospheric', 'climate', 'trái đất từ vũ trụ', 'hành tinh xanh'],

      // Tài liệu và phim ảnh
      documentary: ['documentary', 'film', 'movie', 'series', 'documentary', 'tài liệu', 'phim', 'series']
    };

    // Tính điểm cho mỗi category dựa trên keywords
    const categoryScores = {};
    
    Object.keys(categoryKeywords).forEach(categoryType => {
      categoryScores[categoryType] = 0;
      categoryKeywords[categoryType].forEach(keyword => {
        if (content.includes(keyword)) {
          categoryScores[categoryType] += 1;
          // Bonus points if keyword appears in title
          if (title.toLowerCase().includes(keyword)) {
            categoryScores[categoryType] += 2;
          }
        }
      });
    });

    // Tìm category với điểm cao nhất
    let bestCategory = null;
    let maxScore = 0;

    Object.keys(categoryScores).forEach(categoryType => {
      if (categoryScores[categoryType] > maxScore) {
        maxScore = categoryScores[categoryType];
        bestCategory = categoryType;
      }
    });

    // Map category types to actual category names in the database
    const categoryMapping = {
      planets: ['hành tinh', 'planet', 'solar system', 'hệ mặt trời'],
      astronomy: ['thiên văn', 'astronomy', 'quan sát', 'observation'],
      spacecraft: ['tàu vũ trụ', 'spacecraft', 'phi thuyền', 'rocket', 'tên lửa'],
      astronauts: ['phi hành gia', 'astronaut', 'cosmonaut'],
      exploration: ['khám phá', 'exploration', 'discovery', 'mission'],
      galaxies: ['thiên hà', 'galaxy', 'star', 'ngôi sao', 'nebula', 'tinh vân'],
      space_station: ['trạm vũ trụ', 'space station', 'iss'],
      satellites: ['vệ tinh', 'satellite'],
      history: ['lịch sử', 'history', 'historical'],
      science: ['khoa học', 'science', 'technology', 'công nghệ'],
      education: ['giáo dục', 'education', 'tutorial', 'hướng dẫn'],
      future: ['tương lai', 'future', 'sci-fi'],
      earth: ['trái đất', 'earth', 'blue planet'],
      documentary: ['tài liệu', 'documentary', 'phim']
    };

    // Tìm category thực tế trong database
    if (bestCategory && maxScore > 0) {
      const possibleNames = categoryMapping[bestCategory] || [];
      
      for (const name of possibleNames) {
        const foundCategory = categories.find(cat => 
          cat.name.toLowerCase().includes(name.toLowerCase())
        );
        if (foundCategory) {
          console.log(`🤖 AI Auto-categorized: "${foundCategory.name}" (Score: ${maxScore})`);
          return foundCategory._id;
        }
      }
    }

    // Nếu không tìm được category phù hợp, tìm hoặc đề xuất tạo category "khác"
    console.log('🤖 AI: Không tìm được category phù hợp, chọn category "Khác"');
    return fallbackCategory?._id || '';
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Check URL and auto-fill when URL is entered
    if (name === 'url' && value.trim()) {
      // Clear any existing timeout
      clearTimeout(window.urlTimeout);
      
      // Set new timeout
      window.urlTimeout = setTimeout(async () => {
        const url = value.trim();
        // First check if URL already exists
        const exists = await checkUrlExists(url);
        
        // Only auto-fill if URL doesn't exist
        if (!exists) {
          autoFillVideoData(url);
        }
      }, 1000); // Debounce for 1 second
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validation
      if (!formData.title.trim()) {
        setError('Vui lòng nhập tiêu đề video');
        setLoading(false);
        return;
      }
      
      if (!formData.url.trim()) {
        setError('Vui lòng nhập URL video');
        setLoading(false);
        return;
      }
      
      if (!formData.description.trim()) {
        setError('Vui lòng nhập mô tả video');
        setLoading(false);
        return;
      }

      // Check for duplicate URL before submitting
      if (urlExists) {
        setError('Video với URL này đã tồn tại. Vui lòng chọn video khác.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      
      // Chuẩn bị data để gửi, loại bỏ categoryId nếu rỗng
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        url: formData.url.trim(),
        tags: formData.tags,
        ...(formData.thumbnail && { thumbnail: formData.thumbnail }),
        ...(formData.categoryId && { category_id: formData.categoryId })
      };

      console.log('Submitting data:', submitData); // Debug log

      await axios.post('http://localhost:8080/videos', submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccess('Video đã được thêm thành công!');
      setTimeout(() => {
        navigate('/videos');
      }, 2000);
    } catch (err) {
      console.error('Submit error:', err.response?.data); // Debug log
      if (err.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/login'), 2000);
      } else if (err.response?.status === 409) {
        // Handle duplicate URL error
        setError(err.response?.data?.error || 'Video với URL này đã tồn tại. Không thể thêm video trùng lặp.');
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Có lỗi xảy ra khi thêm video');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      py: 4,
      background: 'transparent'
    }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
        <Card sx={{
          background: 'rgba(24, 18, 43, 0.25)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          border: '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <VideoLibrary sx={{ fontSize: 48, color: '#7C3AED', mb: 2 }} />
              <Typography 
                variant="h4" 
                fontWeight={700} 
                sx={{ 
                  color: '#fff', 
                  textShadow: '0 0 10px #7C3AED88',
                  mb: 1
                }}
              >
                Thêm Video Mới
              </Typography>
              <Typography variant="body1" sx={{ color: '#A1A1AA' }}>
                Chia sẻ video khám phá vũ trụ của bạn
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 2 }}>
                <AutoAwesome sx={{ color: '#7C3AED', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#7C3AED' }}>
                  AI sẽ tự động điền tiêu đề, thumbnail và thể loại khi bạn nhập link
                </Typography>
              </Box>
            </Box>

            {/* Alerts */}
            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {/* Auto-fill loading indicator */}
            {autoFillLoading && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesome sx={{ animation: 'spin 1s linear infinite' }} />
                  AI đang phân tích video và tự động điền thông tin...
                </Box>
                <LinearProgress sx={{ mt: 1, borderRadius: 1 }} />
              </Alert>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* URL */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="URL Video"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    required
                    placeholder="https://www.youtube.com/watch?v=... hoặc https://vimeo.com/..."
                    InputProps={{
                      startAdornment: <LinkIcon sx={{ mr: 1, color: '#0EA5E9' }} />,
                      style: { 
                        color: '#fff', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: 12 
                      }
                    }}
                    InputLabelProps={{ style: { color: '#A1A1AA' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#0EA5E9',
                        },
                      },
                    }}
                  />
                  
                  {/* URL Check Status */}
                  {urlCheckLoading && (
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LinearProgress size={16} sx={{ flexGrow: 1, borderRadius: 1 }} />
                      <Typography variant="body2" sx={{ color: '#A1A1AA' }}>
                        Đang kiểm tra URL...
                      </Typography>
                    </Box>
                  )}
                  
                  {urlExists && (
                    <Alert severity="warning" sx={{ mt: 1, borderRadius: 2 }}>
                      Video với URL này đã tồn tại trong hệ thống!
                    </Alert>
                  )}
                </Grid>

                {/* Thumbnail Preview */}
                {formData.thumbnail && (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="subtitle2" sx={{ color: '#A1A1AA', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <ImageIcon />
                        Thumbnail được AI tự động lấy:
                      </Typography>
                      <CardMedia
                        component="img"
                        image={formData.thumbnail}
                        alt="Video thumbnail"
                        sx={{
                          maxWidth: 320,
                          maxHeight: 180,
                          borderRadius: 2,
                          mx: 'auto',
                          border: '2px solid rgba(255,255,255,0.2)'
                        }}
                      />
                    </Box>
                  </Grid>
                )}

                {/* Title */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tiêu đề video"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <Title sx={{ mr: 1, color: '#7C3AED' }} />,
                      style: { 
                        color: '#fff', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: 12 
                      }
                    }}
                    InputLabelProps={{ style: { color: '#A1A1AA' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#7C3AED',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Category */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                    <FormControl fullWidth>
                      <InputLabel 
                        id="category-label"
                        sx={{ 
                          color: '#A1A1AA',
                          '&.Mui-focused': {
                            color: '#7C3AED'
                          }
                        }}
                      >
                        Thể loại (tùy chọn)
                      </InputLabel>
                      <Select
                        labelId="category-label"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        label="Thể loại (tùy chọn)"
                        sx={{
                          color: '#fff',
                          background: 'rgba(255,255,255,0.05)',
                          borderRadius: 3,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255,255,255,0.2)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#7C3AED',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#7C3AED',
                          },
                          '& .MuiSelect-icon': {
                            color: '#7C3AED',
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              background: 'rgba(24, 18, 43, 0.95)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              '& .MuiMenuItem-root': {
                                color: '#fff',
                                '&:hover': {
                                  background: 'rgba(124, 58, 237, 0.2)',
                                },
                                '&.Mui-selected': {
                                  background: 'rgba(124, 58, 237, 0.3)',
                                  '&:hover': {
                                    background: 'rgba(124, 58, 237, 0.4)',
                                  },
                                },
                              },
                            },
                          },
                        }}
                      >
                        <MenuItem value="">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Category sx={{ color: '#A1A1AA', fontSize: 20 }} />
                            <em style={{ color: '#A1A1AA' }}>Không chọn thể loại</em>
                          </Box>
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category._id} value={category._id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Category sx={{ color: '#7C3AED', fontSize: 20 }} />
                              {category.name}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {/* AI Auto-Categorization Button */}
                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (formData.title && categories.length > 0) {
                          const selectedCategoryId = autoSelectCategory(
                            formData.title,
                            formData.description
                          );
                          if (selectedCategoryId) {
                            setFormData(prev => ({ ...prev, categoryId: selectedCategoryId }));
                            const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);
                            setSuccess(`🤖 AI đã tự động chọn thể loại: "${selectedCategory?.name}"`);
                          } else {
                            setError('AI không tìm được thể loại phù hợp. Vui lòng chọn thủ công.');
                          }
                        } else {
                          setError('Vui lòng nhập tiêu đề video trước khi sử dụng AI');
                        }
                      }}
                      disabled={!formData.title.trim() || categories.length === 0}
                      sx={{
                        minWidth: 'auto',
                        px: 2,
                        py: 1.8,
                        borderColor: '#7C3AED',
                        color: '#7C3AED',
                        borderRadius: 3,
                        height: 56,
                        '&:hover': {
                          borderColor: '#5B21B6',
                          background: 'rgba(124, 58, 237, 0.1)',
                        },
                        '&:disabled': {
                          borderColor: 'rgba(255,255,255,0.2)',
                          color: 'rgba(255,255,255,0.3)',
                        }
                      }}
                    >
                      <AutoAwesome sx={{ fontSize: 24 }} />
                    </Button>
                  </Box>
                </Grid>

                {/* Tags Input */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Thêm tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      InputProps={{
                        style: { 
                          color: '#fff', 
                          background: 'rgba(255,255,255,0.05)', 
                          borderRadius: 12 
                        }
                      }}
                      InputLabelProps={{ style: { color: '#A1A1AA' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.2)',
                          },
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleAddTag}
                      sx={{
                        background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                        borderRadius: 3,
                        px: 3
                      }}
                    >
                      Thêm
                    </Button>
                  </Box>
                </Grid>

                {/* Tags Display */}
                {formData.tags.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {formData.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleRemoveTag(tag)}
                          deleteIcon={<Delete />}
                          sx={{
                            background: 'linear-gradient(45deg, #7C3AED44, #0EA5E944)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.2)',
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    InputProps={{
                      startAdornment: <Description sx={{ mr: 1, mt: 1, color: '#0EA5E9', alignSelf: 'flex-start' }} />,
                      style: { 
                        color: '#fff', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: 12 
                      }
                    }}
                    InputLabelProps={{ style: { color: '#A1A1AA' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(255,255,255,0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#0EA5E9',
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', pt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || urlExists || urlCheckLoading}
                      startIcon={<CloudUpload />}
                      sx={{
                        background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                        borderRadius: 4,
                        px: 6,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        boxShadow: '0 0 20px #7C3AED44',
                        '&:hover': {
                          boxShadow: '0 0 30px #7C3AED66',
                        },
                      }}
                    >
                      {loading ? 'Đang thêm...' : 'Thêm Video'}
                    </Button>
                    {loading && (
                      <LinearProgress 
                        sx={{ 
                          mt: 2, 
                          borderRadius: 1,
                          background: 'rgba(255,255,255,0.1)',
                          '& .MuiLinearProgress-bar': {
                            background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                          }
                        }} 
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>

      {/* CSS for spin animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  );
};

export default AddVideo; 