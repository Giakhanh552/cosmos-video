# Deployment Guide - Cosmic Vision

## 🚀 Backend Deployment (Render)

### 1. Prepare Repository
Đảm bảo repository có các file sau:
- `go.mod` và `go.sum`
- `main.go` đã cấu hình PORT environment variable
- Routes có health check endpoint `/api/health`

### 2. Deploy trên Render
1. Truy cập [render.com](https://render.com)
2. Kết nối GitHub repository
3. Tạo "New Web Service"
4. Cấu hình:
   ```
   Name: cosmic-vision-backend
   Environment: Go
   Build Command: go build -o cosmic-vision-backend .
   Start Command: ./cosmic-vision-backend
   ```

### 3. Environment Variables
Thêm các biến môi trường sau:
```
PORT=10000
GO_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-super-secret-jwt-key
```

### 4. Lấy Backend URL
Sau khi deploy thành công, bạn sẽ có URL dạng:
`https://cosmic-vision-backend.onrender.com`

---

## 🌐 Frontend Deployment (Vercel)

### 1. Cấu hình Environment Variables
Trong Vercel dashboard, thêm:
```
REACT_APP_API_URL=https://cosmic-vision-backend.onrender.com
```

### 2. Deploy trên Vercel
1. Truy cập [vercel.com](https://vercel.com)
2. Import project từ GitHub
3. Chọn thư mục `nasa-media-frontend`
4. Vercel sẽ tự động detect React app

### 3. Build Settings
```
Framework Preset: Create React App
Root Directory: nasa-media-frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### 4. Cập nhật CORS
Sau khi có Vercel URL, cập nhật trong `routes/routes.go`:
```go
allowedOrigins = []string{
    "http://localhost:3000", 
    "https://your-app-name.vercel.app"
}
```

---

## 🔧 Local Development

### Backend
```bash
cd /path/to/cosmos-video/NASA
go mod tidy
go run main.go
```

### Frontend
```bash
cd nasa-media-frontend
npm install
npm start
```

---

## 📝 Notes
- Render free tier có thể sleep sau 15 phút không hoạt động
- MongoDB Atlas có free tier với 512MB storage
- Đảm bảo CORS được cấu hình đúng cho production URLs 