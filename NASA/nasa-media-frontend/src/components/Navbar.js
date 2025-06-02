import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <AppBar position="static" color="primary" sx={{ background: 'rgba(35, 41, 70, 0.35)', backdropFilter: 'blur(18px)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', borderBottom: '1.5px solid rgba(255,255,255,0.15)' }}>
      <Toolbar sx={{ backdropFilter: 'blur(18px)' }}>
        <IconButton edge="start" color="inherit" component={Link} to="/" sx={{ mr: 2 }}>
          <MovieIcon />
        </IconButton>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          NASA Media Explorer
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/videos">Videos</Button>
          <Button color="inherit" component={Link} to="/categories">Categories</Button>
          {role === 'admin' && <Button color="inherit" component={Link} to="/add-video">Thêm Video</Button>}
          {role === 'admin' && <Button color="inherit" component={Link} to="/add-category">Thêm Category</Button>}
          {isLoggedIn && <Button color="inherit" component={Link} to="/favorites">Favorites</Button>}
          {isLoggedIn && <Button color="inherit" component={Link} to="/profile">Profile</Button>}
          {!isLoggedIn && <Button color="inherit" component={Link} to="/login">Login</Button>}
          {!isLoggedIn && <Button color="inherit" component={Link} to="/register">Register</Button>}
          {isLoggedIn && <Button color="inherit" onClick={handleLogout}>Logout</Button>}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 