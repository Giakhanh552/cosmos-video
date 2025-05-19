package controllers

import (
	"context"
	"net/http"
	"time"

	"nasa-media-backend/config"
	"nasa-media-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetComments(c *gin.Context) {
	videoID := c.Query("video_id")
	filter := map[string]interface{}{}
	if videoID != "" {
		objID, err := primitive.ObjectIDFromHex(videoID)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid video_id"})
			return
		}
		filter["video_id"] = objID
	}
	var comments []models.Comment
	cursor, err := config.DB.Collection("comments").Find(context.Background(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching comments"})
		return
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var com models.Comment
		if err := cursor.Decode(&com); err == nil {
			comments = append(comments, com)
		}
	}
	c.JSON(http.StatusOK, comments)
}

func CreateComment(c *gin.Context) {
	var com models.Comment
	if err := c.ShouldBindJSON(&com); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	com.CreatedAt = time.Now().Unix()
	_, err := config.DB.Collection("comments").InsertOne(context.Background(), com)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating comment"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Comment created successfully"})
}
