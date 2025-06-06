# 🚀 Hướng dẫn Deploy Go Backend trên Render - Chi tiết

## Bước 1: Tạo Web Service
1. Truy cập https://render.com
2. Click **"Dashboard"** → **"New"** → **"Web Service"**

## Bước 2: Connect Repository
1. Click **"Connect GitHub"** (hoặc GitLab)
2. Chọn repository: `cosmos-video` hoặc tên repo của bạn
3. Click **"Connect"**

## Bước 3: Điền Form Configuration

### 📝 Basic Information
```
Name: cosmic-vision-backend
Region: Oregon (US West) - gần VN nhất
Branch: main
Runtime: Go
```

### 🔧 Build & Deploy Settings
```
Root Directory: 
(để trống - Render sẽ tự tìm go.mod)

Build Command: 
go build -o cosmic-vision-backend .

Start Command: 
./cosmic-vision-backend
```

### 💰 Pricing Plan
```
Plan: Free
(0$/tháng, 750 giờ/tháng)
```

## Bước 4: Environment Variables

Click **"Advanced"** và thêm các variables sau:

### 🔐 Required Environment Variables
```
Variable Name: PORT
Value: 10000

Variable Name: GO_ENV  
Value: production

Variable Name: MONGODB_URI
Value: mongodb+srv://[username]:[password]@[cluster].mongodb.net/[database]?retryWrites=true&w=majority

Variable Name: JWT_SECRET
Value: cosmic_vision_jwt_secret_2024_super_secure_random_key_here
```

### 📝 Cách lấy MONGODB_URI:
1. Truy cập MongoDB Atlas
2. Click **"Connect"** → **"Connect your application"**
3. Copy connection string
4. Thay `<password>` bằng password thật
5. Thay `<database>` bằng tên database (ví dụ: `cosmic_vision`)

## Bước 5: Advanced Settings (Optional)

### 🏥 Health Check
```
Health Check Path: /api/health
```

### 🔄 Auto Deploy
```
Auto-Deploy: Yes
(tự động deploy khi push code mới)
```

## Bước 6: Deploy

1. Click **"Create Web Service"**
2. Render sẽ bắt đầu build và deploy
3. Quá trình deploy mất khoảng 2-5 phút

## 🎯 Kết quả sau khi Deploy thành công

Bạn sẽ có:
- URL: `https://cosmic-vision-backend.onrender.com`
- Health check: `https://cosmic-vision-backend.onrender.com/api/health`

## 🔍 Troubleshooting

### Lỗi thường gặp:

**1. Build failed:**
```
Solution: Kiểm tra go.mod và go.sum có trong root directory
```

**2. Can't connect to MongoDB:**
```
Solution: Kiểm tra MONGODB_URI và whitelist IP 0.0.0.0/0 trong MongoDB Atlas
```

**3. Service unavailable:**
```
Solution: Kiểm tra PORT environment variable = 10000
```

## 📱 Monitoring

Sau khi deploy:
1. Check **"Logs"** tab để xem real-time logs
2. Check **"Metrics"** để xem performance
3. Check **"Settings"** để update env vars

---

## 🔄 Update Code

Để update code:
1. Push code mới lên GitHub
2. Render sẽ tự động rebuild và deploy (nếu Auto-Deploy enabled)
3. Hoặc click **"Manual Deploy"** trong dashboard 