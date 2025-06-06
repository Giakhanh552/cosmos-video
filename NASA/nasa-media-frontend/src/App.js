import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box, ThemeProvider, createTheme, GlobalStyles } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import VideosPage from './pages/VideosPage';
import VideoDetail from './pages/VideoDetail';
import FavoritesPage from './pages/FavoritesPage';
import CategoriesPage from './pages/CategoriesPage';
import CategoryVideos from './pages/CategoryVideos';
import AddVideo from './pages/AddVideo';
import AddCategory from './pages/AddCategory';

const cosmosTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED',
      light: '#8B5CF6',
      dark: '#6D28D9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0EA5E9',
      light: '#06B6D4',
      dark: '#0284C7',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0F0A1A',
      paper: 'rgba(24, 18, 43, 0.4)',
    },
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    success: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    error: {
      main: '#EF4444',
      light: '#F87171',
      dark: '#DC2626',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2.75rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
      borderRadius: '0.75rem',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#7C3AED #1a1a1a',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
            borderRadius: '4px',
            '&:hover': {
              background: 'linear-gradient(45deg, #8B5CF6, #06B6D4)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(24, 18, 43, 0.25)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '1.5rem',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          padding: '0.75rem 1.5rem',
          fontSize: '0.925rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #7C3AED 0%, #0EA5E9 100%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #8B5CF6 0%, #06B6D4 100%)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderColor: 'rgba(124, 58, 237, 0.5)',
          color: '#7C3AED',
          '&:hover': {
            borderColor: '#7C3AED',
            backgroundColor: 'rgba(124, 58, 237, 0.1)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(124, 58, 237, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#7C3AED',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#CBD5E1',
            '&.Mui-focused': {
              color: '#7C3AED',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '0.75rem',
          backdropFilter: 'blur(12px)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(15, 10, 26, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(24, 18, 43, 0.25)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});

const globalStyles = (
  <GlobalStyles
    styles={{
      '*': {
        boxSizing: 'border-box',
      },
      html: {
        MozOsxFontSmoothing: 'grayscale',
        WebkitFontSmoothing: 'antialiased',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100%',
        width: '100%',
      },
      body: {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        minHeight: '100%',
        width: '100%',
        margin: 0,
        padding: 0,
      },
      '#root': {
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
      },
      '.glassmorphism': {
        background: 'rgba(24, 18, 43, 0.25)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      '.gradient-text': {
        background: 'linear-gradient(45deg, #7C3AED, #0EA5E9)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
      '.floating-animation': {
        animation: 'floating 6s ease-in-out infinite',
      },
      '@keyframes floating': {
        '0%': { transform: 'translate(0, 0px)' },
        '50%': { transform: 'translate(0, -20px)' },
        '100%': { transform: 'translate(0, 0px)' },
      },
      '@keyframes fadeInUp': {
        from: {
          opacity: 0,
          transform: 'translateY(30px)',
        },
        to: {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
      '.fade-in-up': {
        animation: 'fadeInUp 0.6s ease-out',
      },
      '.hover-lift': {
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: '0 20px 40px rgba(124, 58, 237, 0.4)',
        },
      },
    }}
  />
);

function App() {
  const videoBg = "";
  
  const videoSettings = {
    opacity: 0.3,
    brightness: 0.4,
    contrast: 1.2,
    blur: 0,
  };
  
  return (
    <ThemeProvider theme={cosmosTheme}>
      <CssBaseline />
      {globalStyles}
      
      {/* Animated Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -2,
          background: 'radial-gradient(ellipse at top, rgba(124, 58, 237, 0.1) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
        }}
      />
      
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
          opacity: videoSettings.opacity,
          filter: `brightness(${videoSettings.brightness}) contrast(${videoSettings.contrast}) blur(${videoSettings.blur}px)`,
        }}
        src={videoBg}
        onError={(e) => {
          console.error('Video failed to load:', e);
          e.target.style.display = 'none';
        }}
      />
      
      {/* Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'linear-gradient(135deg, rgba(15, 10, 26, 0.9) 0%, rgba(24, 18, 43, 0.8) 100%)',
        }}
      />

      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box 
            component="main" 
            sx={{ 
              flex: 1, 
              pt: 2,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/videos" element={<VideosPage />} />
              <Route path="/videos/:id" element={<VideoDetail />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/add-video" element={<AddVideo />} />
              <Route path="/add-category" element={<AddCategory />} />
              <Route path="/categories/:categoryId/videos" element={<CategoryVideos />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
