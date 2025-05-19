package routes

import (
	"nasa-media-backend/controllers"
	"nasa-media-backend/utils"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)
	r.GET("/videos", utils.AuthMiddleware(), controllers.GetVideos)
	r.POST("/videos/import", utils.AuthMiddleware(), utils.RequireAdmin(), controllers.ImportVideosFromNASA)
	r.GET("/videos/:id", utils.AuthMiddleware(), controllers.GetVideoByID)
	r.GET("/videos/search", utils.AuthMiddleware(), controllers.SearchVideos)
	r.GET("/profile", utils.AuthMiddleware(), controllers.GetProfile)
	r.POST("/change-password", utils.AuthMiddleware(), controllers.ChangePassword)
	r.GET("/categories", controllers.GetCategories)
	r.POST("/categories", utils.AuthMiddleware(), utils.RequireAdmin(), controllers.CreateCategory)
	r.GET("/comments", controllers.GetComments)
	r.POST("/comments", utils.AuthMiddleware(), controllers.CreateComment)
	r.GET("/favorites", controllers.GetFavorites)
	r.POST("/favorites", utils.AuthMiddleware(), controllers.CreateFavorite)

	return r
}
