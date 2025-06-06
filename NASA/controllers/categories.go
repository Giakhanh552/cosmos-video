package controllers

import (
	"context"
	"net/http"

	"cosmic-vision-backend/config"
	"cosmic-vision-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CategoryWithCount struct {
	ID         primitive.ObjectID `json:"_id" bson:"_id"`
	Name       string             `json:"name" bson:"name"`
	VideoCount int64              `json:"video_count" bson:"video_count"`
}

func GetCategories(c *gin.Context) {
	var categories []CategoryWithCount
	cursor, err := config.DB.Collection("categories").Find(context.Background(), map[string]interface{}{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching categories"})
		return
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var cat models.Category
		if err := cursor.Decode(&cat); err == nil {
			// Count videos for this category
			videoCount, countErr := config.DB.Collection("videos").CountDocuments(
				context.Background(),
				map[string]interface{}{"category_id": cat.ID},
			)
			if countErr != nil {
				videoCount = 0 // Default to 0 if count fails
			}

			categoryWithCount := CategoryWithCount{
				ID:         cat.ID,
				Name:       cat.Name,
				VideoCount: videoCount,
			}
			categories = append(categories, categoryWithCount)
		}
	}
	c.JSON(http.StatusOK, categories)
}

func CreateCategory(c *gin.Context) {
	var cat models.Category
	if err := c.ShouldBindJSON(&cat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Không cần gán cat.ID, MongoDB sẽ tự sinh
	_, err := config.DB.Collection("categories").InsertOne(context.Background(), cat)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating category"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Category created successfully"})
}
