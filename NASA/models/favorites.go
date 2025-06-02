package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Favorite struct {
	UserID  primitive.ObjectID `bson:"user_id" json:"user_id"`
	VideoID primitive.ObjectID `bson:"video_id" json:"video_id"`
}
