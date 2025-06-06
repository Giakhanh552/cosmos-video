package main

import (
	"cosmic-vision-backend/config"
	"cosmic-vision-backend/routes"
)

func main() {
	config.ConnectDB()
	router := routes.SetupRouter()
	router.Run(":8080")
}
