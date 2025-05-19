package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"nasa-media-backend/config"
	"nasa-media-backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetVideos(c *gin.Context) {
	var videos []models.Video
	cursor, err := config.DB.Collection("videos").Find(context.Background(), map[string]interface{}{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching videos"})
		return
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var v models.Video
		if err := cursor.Decode(&v); err == nil {
			videos = append(videos, v)
		} else {
			fmt.Println("Error decoding video:", err)
		}
	}
	c.JSON(http.StatusOK, videos)
}

type nasaAPIResponse struct {
	Collection struct {
		Items []struct {
			Data []struct {
				Title       string `json:"title"`
				Description string `json:"description"`
				DateCreated string `json:"date_created"`
			} `json:"data"`
			Links []struct {
				Href   string `json:"href"`
				Rel    string `json:"rel"`
				Render string `json:"render"`
			} `json:"links"`
		} `json:"items"`
	} `json:"collection"`
}

func ImportVideosFromNASA(c *gin.Context) {
	url := "https://images-api.nasa.gov/search?q=universe&media_type=video"
	resp, err := http.Get(url)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch from NASA API"})
		return
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read NASA API response body"})
		return
	}

	var nasaResp nasaAPIResponse
	if err := json.Unmarshal(body, &nasaResp); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse NASA API response"})
		return
	}

	count := 0
	for _, item := range nasaResp.Collection.Items {
		if len(item.Data) == 0 {
			continue
		}
		data := item.Data[0]
		thumbnail := ""
		url := ""
		for _, link := range item.Links {
			if link.Rel == "preview" || link.Render == "image" {
				thumbnail = link.Href
			}
			if link.Render == "mp4" {
				url = link.Href
			}
		}
		video := models.Video{
			Title:       data.Title,
			Description: data.Description,
			URL:         url,
			Thumbnail:   thumbnail,
			CreatedAt:   0,
		}
		_, err := config.DB.Collection("videos").InsertOne(context.Background(), video)
		if err != nil {
			fmt.Println("Error inserting video:", err)
		}
		count++
		if count >= 10 {
			break
		}
	}
	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Imported %d videos from NASA", count)})
}

func GetVideoByID(c *gin.Context) {
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	var video models.Video
	err = config.DB.Collection("videos").FindOne(context.Background(), map[string]interface{}{"_id": objID}).Decode(&video)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Video not found"})
		return
	}
	c.JSON(http.StatusOK, video)
}

func SearchVideos(c *gin.Context) {
	search := c.Query("search")
	filter := map[string]interface{}{}
	if search != "" {
		filter = map[string]interface{}{
			"$or": []map[string]interface{}{
				{"title": map[string]interface{}{"$regex": search, "$options": "i"}},
				{"description": map[string]interface{}{"$regex": search, "$options": "i"}},
			},
		}
	}
	var videos []models.Video
	cursor, err := config.DB.Collection("videos").Find(context.Background(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error searching videos"})
		return
	}
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var v models.Video
		if err := cursor.Decode(&v); err == nil {
			videos = append(videos, v)
		} else {
			fmt.Println("Error decoding video:", err)
		}
	}
	c.JSON(http.StatusOK, videos)
}
