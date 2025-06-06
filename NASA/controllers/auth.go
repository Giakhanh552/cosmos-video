package controllers

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	"cosmic-vision-backend/config"
	"cosmic-vision-backend/models"
	"cosmic-vision-backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Printf("DEBUG: username=%s, email=%s, password=%s, password_len=%d\n", user.Username, user.Email, user.Password, len(user.Password))

	// Validate username length
	if len(user.Username) < 3 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username must be at least 3 characters"})
		return
	}

	// Check if username already exists
	var existingUser models.User
	err := config.DB.Collection("users").FindOne(
		context.Background(),
		map[string]interface{}{"username": user.Username},
	).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username already exists"})
		return
	}

	// Validate email format
	if !strings.Contains(user.Email, "@") || !strings.Contains(user.Email, ".") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
		return
	}

	// Check if email already exists
	err = config.DB.Collection("users").FindOne(
		context.Background(),
		map[string]interface{}{"email": user.Email},
	).Decode(&existingUser)
	if err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email already exists"})
		return
	}

	// Validate password length
	if len(user.Password) < 6 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be at least 6 characters"})
		return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user.Password = string(hashedPassword)
	user.CreatedAt = time.Now().Unix()
	if user.Username == "admin" {
		user.Role = "admin"
	} else {
		user.Role = "user"
	}

	_, err = config.DB.Collection("users").InsertOne(context.Background(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User registered successfully",
		"user": gin.H{
			"username": user.Username,
			"email":    user.Email,
			"role":     user.Role,
		},
	})
}

func Login(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var user models.User
	err := config.DB.Collection("users").FindOne(context.Background(), map[string]interface{}{"username": req.Username}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username or password"})
		return
	}
	token, err := utils.GenerateJWT(user.ID.Hex(), user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"token": token, "role": user.Role})
}

func GetProfile(c *gin.Context) {
	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	var user models.User
	objID, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userID"})
		return
	}
	err = config.DB.Collection("users").FindOne(context.Background(), map[string]interface{}{"_id": objID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	user.Password = ""
	c.JSON(http.StatusOK, user)
}

func ChangePassword(c *gin.Context) {
	userID, ok := c.Get("userID")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	var req struct {
		OldPassword string `json:"oldPassword"`
		NewPassword string `json:"newPassword"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	objID, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid userID"})
		return
	}
	var user models.User
	err = config.DB.Collection("users").FindOne(context.Background(), map[string]interface{}{"_id": objID}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.OldPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Old password is incorrect"})
		return
	}
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(req.NewPassword), 14)
	_, err = config.DB.Collection("users").UpdateOne(
		context.Background(),
		map[string]interface{}{"_id": objID},
		map[string]interface{}{"$set": map[string]interface{}{"password": string(hashedPassword)}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}

// Promote a user to admin (should be protected by admin authentication in production)
func PromoteToAdmin(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	_, err := config.DB.Collection("users").UpdateOne(
		context.Background(),
		map[string]interface{}{"username": req.Username},
		map[string]interface{}{"$set": map[string]interface{}{"role": "admin"}},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to promote user"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User promoted to admin"})
}
