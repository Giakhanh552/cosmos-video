import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Movie as MovieIcon,
  Home,
  VideoLibrary,
  Category,
  Add,
  Favorite,
  Person,
  Logout,
  Login,
  PersonAdd,
  NotificationsNone,
  Search,
  Brightness4,
  Brightness7
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null);
  const isLoggedIn = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setProfileMenuAnchor(null);
    navigate('/login');
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const navItems = [
    { label: 'Trang chủ', icon: <Home />, path: '/' },
    { label: 'Videos', icon: <VideoLibrary />, path: '/videos' },
    { label: 'Danh mục', icon: <Category />, path: '/categories' },
  ];

  const adminItems = [
    { label: 'Thêm Video', icon: <Add />, path: '/add-video' },
    { label: 'Thêm Danh mục', icon: <Add />, path: '/add-category' },
  ];

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{
        background: 'rgba(15, 10, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Toolbar sx={{ 
        py: 1,
        px: { xs: 2, md: 4 },
        justifyContent: 'space-between',
      }}>
        {/* Logo Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            component={Link} 
            to="/" 
            sx={{ 
              mr: 2,
              background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
              color: 'white',
              width: 48,
              height: 48,
              '&:hover': {
                background: 'linear-gradient(45deg, #8B5CF6, #06B6D4)',
                transform: 'scale(1.05)',
              }
            }}
          >
            <MovieIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            sx={{ 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 700,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            NASA Cosmos Explorer
          </Typography>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          alignItems: 'center',
          gap: 1,
          flexGrow: 1,
          justifyContent: 'center'
        }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 500,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(124, 58, 237, 0.2)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                }
              }}
            >
              {item.label}
            </Button>
          ))}

          {/* Admin Items */}
          {role === 'admin' && (
            <>
              <Box sx={{ width: 2, height: 24, background: 'rgba(255,255,255,0.2)', mx: 1 }} />
              {adminItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    fontWeight: 500,
                    background: 'rgba(124, 58, 237, 0.1)',
                    border: '1px solid rgba(124, 58, 237, 0.3)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(124, 58, 237, 0.3)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </>
          )}
        </Box>

        {/* User Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Button */}
          <Tooltip title="Tìm kiếm">
            <IconButton
              color="inherit"
              sx={{
                '&:hover': {
                  background: 'rgba(124, 58, 237, 0.2)',
                }
              }}
            >
              <Search />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          {isLoggedIn && (
            <Tooltip title="Thông báo">
              <IconButton
                color="inherit"
                sx={{
                  '&:hover': {
                    background: 'rgba(124, 58, 237, 0.2)',
                  }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsNone />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* User Menu */}
          {isLoggedIn ? (
            <>
              {/* Favorites */}
              <Button
                color="inherit"
                component={Link}
                to="/favorites"
                startIcon={<Favorite />}
                sx={{
                  borderRadius: 3,
                  px: 2,
                  display: { xs: 'none', sm: 'flex' },
                  '&:hover': {
                    background: 'rgba(14, 165, 233, 0.2)',
                  }
                }}
              >
                Yêu thích
              </Button>

              {/* Profile Menu */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {role === 'admin' && (
                  <Chip 
                    label="Admin" 
                    size="small"
                    sx={{
                      background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                      color: 'white',
                      fontWeight: 600,
                      display: { xs: 'none', sm: 'inline-flex' }
                    }}
                  />
                )}
                
                <IconButton
                  onClick={handleProfileMenuOpen}
                  sx={{
                    '&:hover': {
                      background: 'rgba(124, 58, 237, 0.2)',
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36,
                      background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    <Person />
                  </Avatar>
                </IconButton>
              </Box>

              <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  sx: {
                    background: 'rgba(24, 18, 43, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    mt: 1,
                    minWidth: 200,
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem 
                  onClick={() => { navigate('/profile'); handleProfileMenuClose(); }}
                  sx={{
                    color: '#fff',
                    '&:hover': {
                      background: 'rgba(124, 58, 237, 0.2)',
                    }
                  }}
                >
                  <Person sx={{ mr: 2 }} />
                  Hồ sơ
                </MenuItem>
                
                <MenuItem 
                  onClick={() => { navigate('/favorites'); handleProfileMenuClose(); }}
                  sx={{
                    color: '#fff',
                    display: { xs: 'flex', sm: 'none' },
                    '&:hover': {
                      background: 'rgba(14, 165, 233, 0.2)',
                    }
                  }}
                >
                  <Favorite sx={{ mr: 2 }} />
                  Yêu thích
                </MenuItem>

                <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 1, pt: 1 }} />
                
                <MenuItem 
                  onClick={handleLogout}
                  sx={{
                    color: '#EF4444',
                    '&:hover': {
                      background: 'rgba(239, 68, 68, 0.1)',
                    }
                  }}
                >
                  <Logout sx={{ mr: 2 }} />
                  Đăng xuất
                </MenuItem>
              </Menu>
            </>
          ) : (
            /* Login/Register Buttons */
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                startIcon={<Login />}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  '&:hover': {
                    background: 'rgba(124, 58, 237, 0.2)',
                  }
                }}
              >
                Đăng nhập
              </Button>
              
              <Button
                variant="contained"
                component={Link}
                to="/register"
                startIcon={<PersonAdd />}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #8B5CF6, #06B6D4)',
                    transform: 'translateY(-2px)',
                  }
                }}
              >
                Đăng ký
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>

      {/* Mobile Navigation */}
      <Box 
        sx={{ 
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'center',
          pb: 1,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(15, 10, 26, 0.9)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={item.path}
              startIcon={item.icon}
              size="small"
              sx={{
                borderRadius: 2,
                px: 2,
                py: 0.5,
                fontSize: '0.8rem',
                minWidth: 'auto',
                '&:hover': {
                  background: 'rgba(124, 58, 237, 0.2)',
                }
              }}
            >
              {item.label}
            </Button>
          ))}
          
          {role === 'admin' && adminItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              component={Link}
              to={item.path}
              startIcon={item.icon}
              size="small"
              sx={{
                borderRadius: 2,
                px: 2,
                py: 0.5,
                fontSize: '0.8rem',
                minWidth: 'auto',
                background: 'rgba(124, 58, 237, 0.1)',
                border: '1px solid rgba(124, 58, 237, 0.3)',
                '&:hover': {
                  background: 'rgba(124, 58, 237, 0.3)',
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Box>
    </AppBar>
  );
};

export default Navbar; 