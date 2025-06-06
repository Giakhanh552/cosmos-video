package main

import (
	"context"
	"fmt"
	"math/rand"
	"time"

	"cosmic-vision-backend/config"
	"cosmic-vision-backend/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func SeedData() {
	config.ConnectDB()
	ctx := context.Background()
	rand.Seed(time.Now().UnixNano())

	// 1. Seed categories
	categoryNames := []string{"Black Holes", "Time Dilation", "Galaxies", "Nebulae", "Exoplanets", "Cosmology", "Stars", "Supernovae", "Dark Matter", "Space Exploration"}
	categoryIDs := []primitive.ObjectID{}
	for _, name := range categoryNames {
		cat := models.Category{ID: primitive.NewObjectID(), Name: name}
		_, err := config.DB.Collection("categories").InsertOne(ctx, cat)
		if err != nil {
			fmt.Println("Error inserting category:", err)
		}
		categoryIDs = append(categoryIDs, cat.ID)
	}

	// 2. Seed users
	userIDs := []primitive.ObjectID{}
	for i := 1; i <= 50; i++ {
		user := models.User{
			ID:        primitive.NewObjectID(),
			Username:  fmt.Sprintf("user%d", i),
			Password:  "$2a$14$CwTycUXWue0Thq9StjUM0uJ8vQxQ5QhQJQ1QJQ1QJQ1QJQ1QJQ1QK", // bcrypt hash for 'password'
			Email:     fmt.Sprintf("user%d@example.com", i),
			CreatedAt: time.Now().Unix(),
			Role:      "user",
		}
		_, err := config.DB.Collection("users").InsertOne(ctx, user)
		if err != nil {
			fmt.Println("Error inserting user:", err)
		}
		userIDs = append(userIDs, user.ID)
	}

	// 3. Seed videos
	videoIDs := []primitive.ObjectID{}
	for i := 1; i <= 50; i++ {
		catID := categoryIDs[rand.Intn(len(categoryIDs))]
		uploaderID := userIDs[rand.Intn(len(userIDs))]
		video := models.Video{
			ID:          primitive.NewObjectID(),
			Title:       fmt.Sprintf("NASA Video %d", i),
			Description: fmt.Sprintf("This is a sample description for NASA video %d.", i),
			URL:         fmt.Sprintf("https://www.youtube.com/watch?v=video%d", i),
			Thumbnail:   fmt.Sprintf("https://img.youtube.com/vi/video%d/maxresdefault.jpg", i),
			CategoryID:  catID,
			UploaderID:  uploaderID,
			CreatedAt:   time.Now().Unix(),
		}
		_, err := config.DB.Collection("videos").InsertOne(ctx, video)
		if err != nil {
			fmt.Println("Error inserting video:", err)
		}
		videoIDs = append(videoIDs, video.ID)
	}

	// 4. Seed comments
	for i := 1; i <= 50; i++ {
		userID := userIDs[rand.Intn(len(userIDs))]
		videoID := videoIDs[rand.Intn(len(videoIDs))]
		comment := models.Comment{
			ID:        primitive.NewObjectID(),
			UserID:    userID,
			VideoID:   videoID,
			Content:   fmt.Sprintf("This is a comment %d on video.", i),
			CreatedAt: time.Now().Unix(),
		}
		_, err := config.DB.Collection("comments").InsertOne(ctx, comment)
		if err != nil {
			fmt.Println("Error inserting comment:", err)
		}
	}

	// 5. Seed favorites
	for i := 1; i <= 50; i++ {
		userID := userIDs[rand.Intn(len(userIDs))]
		videoID := videoIDs[rand.Intn(len(videoIDs))]
		favorite := models.Favorite{
			UserID:  userID,
			VideoID: videoID,
		}
		_, err := config.DB.Collection("favorites").InsertOne(ctx, favorite)
		if err != nil {
			fmt.Println("Error inserting favorite:", err)
		}
	}

	fmt.Println("Seeded 50 records for each collection!")
}
