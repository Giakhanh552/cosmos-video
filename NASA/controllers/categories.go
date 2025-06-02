package controllers

import (
	"context"
	"net/http"

	"nasa-media-backend/config"
	"nasa-media-backend/models"

	"github.com/gin-gonic/gin"
)

func GetCategories(c *gin.Context) {
	var categories []models.Category
	cursor, err := config.DB.Collection("categories").Find(context.Background(), map[string]interface{}{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching categories"})
		return
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var cat models.Category
		if err := cursor.Decode(&cat); err == nil {
			categories = append(categories, cat)
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
