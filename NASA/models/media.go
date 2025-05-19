package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Video struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Title       string             `bson:"title" json:"title"`
	Description string             `bson:"description" json:"description"`
	URL         string             `bson:"url" json:"url"`
	Thumbnail   string             `bson:"thumbnail" json:"thumbnail"`
	CategoryID  primitive.ObjectID `bson:"category_id" json:"category_id"`
	UploaderID  primitive.ObjectID `bson:"uploader_id" json:"uploader_id"`
	CreatedAt   int64              `bson:"created_at" json:"created_at"`
}
