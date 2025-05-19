package main

import (
	"nasa-media-backend/config"
	"nasa-media-backend/routes"
	"time"

	_ "nasa-media-backend/docs"

	"github.com/gin-contrib/cors"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

func main() {
	// Connect to MongoDB
	config.ConnectDB()

	// Initialize router with routes
	r := routes.SetupRouter()

	// Cấu hình CORS (đổi tên biến để tránh trùng package config)
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"http://localhost:3000"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization"}
	corsConfig.AllowCredentials = true
	corsConfig.MaxAge = 12 * time.Hour

	r.Use(cors.New(corsConfig))

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// Chạy server ở port 8080
	r.Run(":8080")
}
