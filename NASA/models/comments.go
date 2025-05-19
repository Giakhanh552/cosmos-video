package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Comment struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    primitive.ObjectID `bson:"user_id" json:"user_id"`
	VideoID   primitive.ObjectID `bson:"video_id" json:"video_id"`
	Content   string             `bson:"content" json:"content"`
	CreatedAt int64              `bson:"created_at" json:"created_at"`
}
