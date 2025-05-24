package models

import (
	"time"

	"github.com/google/uuid"
)

// User represents a user in the system
type User struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	Email       string    `json:"email" gorm:"uniqueIndex;not null"`
	Username    string    `json:"username" gorm:"uniqueIndex;not null"`
	DisplayName string    `json:"display_name" gorm:"not null"`
	AvatarURL   *string   `json:"avatar_url"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Location represents a recommended place
type Location struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID      uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
	Name        string    `json:"name" gorm:"not null"`
	Description *string   `json:"description"`
	Category    string    `json:"category" gorm:"not null"`
	Address     string    `json:"address" gorm:"not null"`
	Latitude    float64   `json:"latitude" gorm:"not null"`
	Longitude   float64   `json:"longitude" gorm:"not null"`
	City        string    `json:"city" gorm:"not null"`
	Rating      *int      `json:"rating" gorm:"check:rating >= 1 AND rating <= 5"`
	PriceLevel  *int      `json:"price_level" gorm:"check:price_level >= 1 AND price_level <= 4"`
	Tags        []string  `json:"tags" gorm:"type:text[]"`
	ImageURL    *string   `json:"image_url"`
	WebsiteURL  *string   `json:"website_url"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Foreign key
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// Guide represents a collection of locations
type Guide struct {
	ID          uuid.UUID   `json:"id" gorm:"type:uuid;primary_key;default:gen_random_uuid()"`
	UserID      uuid.UUID   `json:"user_id" gorm:"type:uuid;not null"`
	Title       string      `json:"title" gorm:"not null"`
	Description *string     `json:"description"`
	City        string      `json:"city" gorm:"not null"`
	IsPublic    bool        `json:"is_public" gorm:"default:true"`
	LocationIDs []uuid.UUID `json:"location_ids" gorm:"type:uuid[]"`
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`

	// Foreign key
	User User `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// LocationCategory enum values
const (
	CategoryRestaurant    = "restaurant"
	CategoryCafe          = "cafe"
	CategoryBar           = "bar"
	CategoryShopping      = "shopping"
	CategoryPark          = "park"
	CategoryHike          = "hike"
	CategoryMuseum        = "museum"
	CategoryEntertainment = "entertainment"
	CategoryBeach         = "beach"
	CategoryViewpoint     = "viewpoint"
	CategoryOther         = "other"
)

// ValidCategories returns all valid location categories
func ValidCategories() []string {
	return []string{
		CategoryRestaurant,
		CategoryCafe,
		CategoryBar,
		CategoryShopping,
		CategoryPark,
		CategoryHike,
		CategoryMuseum,
		CategoryEntertainment,
		CategoryBeach,
		CategoryViewpoint,
		CategoryOther,
	}
}

// IsValidCategory checks if a category is valid
func IsValidCategory(category string) bool {
	for _, valid := range ValidCategories() {
		if category == valid {
			return true
		}
	}
	return false
}
