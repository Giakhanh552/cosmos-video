package controllers

import (
	"context"
	"net/http"

	"nasa-media-backend/config"
	"nasa-media-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetFavorites(c *gin.Context) {
	userID := c.Query("user_id")
	filter := map[string]interface{}{}
	if userID != "" {
		objID, err := primitive.ObjectIDFromHex(userID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user_id"})
			return
		}
		filter["user_id"] = objID
	}
	var favorites []models.Favorite
	cursor, err := config.DB.Collection("favorites").Find(context.Background(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching favorites"})
		return
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var fav models.Favorite
		if err := cursor.Decode(&fav); err == nil {
			favorites = append(favorites, fav)
		}
	}
	c.JSON(http.StatusOK, favorites)
}

func CreateFavorite(c *gin.Context) {
	var fav models.Favorite
	if err := c.ShouldBindJSON(&fav); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := config.DB.Collection("favorites").InsertOne(context.Background(), fav)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating favorite"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Favorite created successfully"})
}
