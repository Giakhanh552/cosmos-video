package main

import (
	"nasa-media-backend/config"
	"nasa-media-backend/routes"
)

func main() {
	config.ConnectDB()
	router := routes.SetupRouter()
	router.Run(":8080")
}
