import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, Box, ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfilePage from './pages/ProfilePage';
import VideosPage from './pages/VideosPage';
import VideoDetail from './pages/VideoDetail';
import FavoritesPage from './pages/FavoritesPage';
import CategoriesPage from './pages/CategoriesPage';
import AddVideo from './pages/AddVideo';
import AddCategory from './pages/AddCategory';

const cosmosTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED', // tím cosmos
    },
    secondary: {
      main: '#0EA5E9', // xanh cosmos
    },
    background: {
      default: '#18122B', // nền tối vũ trụ
      paper: '#232946',
    },
    text: {
      primary: '#F4F4F4',
      secondary: '#A1A1AA',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #232946 0%, #7C3AED 100%)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={cosmosTheme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="lg">
          <Box mt={4}>
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
            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
