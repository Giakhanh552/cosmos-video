package routes

import (
	"net/http"
	"os"

	"cosmic-vision-backend/controllers"
	"cosmic-vision-backend/utils"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {

	r := gin.Default()

	// Configure CORS based on environment
	allowedOrigins := []string{"http://localhost:3000"}
	if os.Getenv("GO_ENV") == "production" {
		// Add your Vercel domain here when you deploy
		allowedOrigins = []string{"http://localhost:3000", "https://your-vercel-app.vercel.app"}
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		MaxAge:           12 * time.Hour,
		AllowCredentials: true,
	}))

	// Health check endpoint for Render
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":  "healthy",
			"message": "Cosmic Vision Backend is running",
		})
	})

	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)

	r.GET("/videos", utils.AuthMiddleware(), controllers.GetVideos)
	r.POST("/videos", utils.AuthMiddleware(), utils.RequireAdmin(), controllers.CreateVideo)
	r.PUT("/videos/:id", utils.AuthMiddleware(), utils.RequireAdmin(), controllers.UpdateVideo)
	r.DELETE("/videos/:id", utils.AuthMiddleware(), utils.RequireAdmin(), controllers.DeleteVideo)
	r.GET("/videos/:id", utils.AuthMiddleware(), controllers.GetVideoByID)
	r.GET("/videos/search", utils.AuthMiddleware(), controllers.SearchVideos)
	r.POST("/videos/import", utils.AuthMiddleware(), utils.RequireAdmin(), controllers.ImportVideosFromNASA)

	r.GET("/profile", utils.AuthMiddleware(), controllers.GetProfile)
	r.POST("/change-password", utils.AuthMiddleware(), controllers.ChangePassword)

	r.GET("/categories", controllers.GetCategories)
	r.POST("/categories", utils.AuthMiddleware(), utils.RequireAdmin(), controllers.CreateCategory)

	r.GET("/categories/:id/videos", controllers.GetVideosByCategory)

	r.GET("/comments", controllers.GetComments)
	r.POST("/comments", utils.AuthMiddleware(), controllers.CreateComment)

	r.GET("/favorites", controllers.GetFavorites)
	r.POST("/favorites", utils.AuthMiddleware(), controllers.CreateFavorite)

	return r
}
