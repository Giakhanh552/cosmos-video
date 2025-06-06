package main

import (
	"os"

	"cosmic-vision-backend/config"
	"cosmic-vision-backend/routes"
)

func main() {
	config.ConnectDB()
	router := routes.SetupRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	router.Run(":" + port)
}
