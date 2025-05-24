package handlers

import (
	"myarea-backend/database"
	"myarea-backend/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

// CreateLocationRequest represents location creation payload
type CreateLocationRequest struct {
	Name        string   `json:"name" validate:"required"`
	Description *string  `json:"description"`
	Category    string   `json:"category" validate:"required"`
	Address     string   `json:"address" validate:"required"`
	Latitude    float64  `json:"latitude" validate:"required"`
	Longitude   float64  `json:"longitude" validate:"required"`
	City        string   `json:"city" validate:"required"`
	Rating      *int     `json:"rating"`
	PriceLevel  *int     `json:"price_level"`
	Tags        []string `json:"tags"`
	ImageURL    *string  `json:"image_url"`
	WebsiteURL  *string  `json:"website_url"`
}

// GetLocations returns all public locations, optionally filtered by city and category
func GetLocations(c *fiber.Ctx) error {
	city := c.Query("city", "San Francisco") // Default to San Francisco for Phase 1
	category := c.Query("category")

	query := database.DB.Preload("User").Where("city ILIKE ?", "%"+city+"%")

	if category != "" {
		if !models.IsValidCategory(category) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid category",
			})
		}
		query = query.Where("category = ?", category)
	}

	var locations []models.Location
	if err := query.Find(&locations).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch locations",
		})
	}

	return c.JSON(fiber.Map{
		"locations": locations,
		"count":     len(locations),
	})
}

// GetLocation returns a specific location by ID
func GetLocation(c *fiber.Ctx) error {
	locationID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid location ID",
		})
	}

	var location models.Location
	if err := database.DB.Preload("User").First(&location, locationID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Location not found",
		})
	}

	return c.JSON(location)
}

// CreateLocation creates a new location (requires authentication)
func CreateLocation(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)

	var req CreateLocationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate required fields
	if req.Name == "" || req.Category == "" || req.Address == "" || req.City == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Name, category, address, and city are required",
		})
	}

	// Validate category
	if !models.IsValidCategory(req.Category) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid category",
		})
	}

	// Validate rating if provided
	if req.Rating != nil && (*req.Rating < 1 || *req.Rating > 5) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Rating must be between 1 and 5",
		})
	}

	// Validate price level if provided
	if req.PriceLevel != nil && (*req.PriceLevel < 1 || *req.PriceLevel > 4) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Price level must be between 1 and 4",
		})
	}

	// Create location
	location := models.Location{
		UserID:      userID,
		Name:        req.Name,
		Description: req.Description,
		Category:    req.Category,
		Address:     req.Address,
		Latitude:    req.Latitude,
		Longitude:   req.Longitude,
		City:        req.City,
		Rating:      req.Rating,
		PriceLevel:  req.PriceLevel,
		Tags:        req.Tags,
		ImageURL:    req.ImageURL,
		WebsiteURL:  req.WebsiteURL,
	}

	if err := database.DB.Create(&location).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create location",
		})
	}

	// Load user info for response
	database.DB.Preload("User").First(&location, location.ID)

	return c.Status(fiber.StatusCreated).JSON(location)
}

// UpdateLocation updates an existing location (owner only)
func UpdateLocation(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	locationID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid location ID",
		})
	}

	// Find location and verify ownership
	var location models.Location
	if err := database.DB.First(&location, locationID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Location not found",
		})
	}

	if location.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You can only update your own locations",
		})
	}

	var req CreateLocationRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Update fields
	if req.Name != "" {
		location.Name = req.Name
	}
	if req.Description != nil {
		location.Description = req.Description
	}
	if req.Category != "" {
		if !models.IsValidCategory(req.Category) {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid category",
			})
		}
		location.Category = req.Category
	}
	if req.Address != "" {
		location.Address = req.Address
	}
	if req.City != "" {
		location.City = req.City
	}
	if req.Latitude != 0 {
		location.Latitude = req.Latitude
	}
	if req.Longitude != 0 {
		location.Longitude = req.Longitude
	}
	if req.Rating != nil {
		if *req.Rating < 1 || *req.Rating > 5 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Rating must be between 1 and 5",
			})
		}
		location.Rating = req.Rating
	}
	if req.PriceLevel != nil {
		if *req.PriceLevel < 1 || *req.PriceLevel > 4 {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Price level must be between 1 and 4",
			})
		}
		location.PriceLevel = req.PriceLevel
	}
	if req.Tags != nil {
		location.Tags = req.Tags
	}
	if req.ImageURL != nil {
		location.ImageURL = req.ImageURL
	}
	if req.WebsiteURL != nil {
		location.WebsiteURL = req.WebsiteURL
	}

	if err := database.DB.Save(&location).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to update location",
		})
	}

	// Load user info for response
	database.DB.Preload("User").First(&location, location.ID)

	return c.JSON(location)
}

// DeleteLocation deletes a location (owner only)
func DeleteLocation(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(uuid.UUID)
	locationID, err := uuid.Parse(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid location ID",
		})
	}

	// Find location and verify ownership
	var location models.Location
	if err := database.DB.First(&location, locationID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Location not found",
		})
	}

	if location.UserID != userID {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "You can only delete your own locations",
		})
	}

	if err := database.DB.Delete(&location).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to delete location",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Location deleted successfully",
	})
}

// GetUserLocations returns all locations for a specific user
func GetUserLocations(c *fiber.Ctx) error {
	username := c.Params("username")

	// Find user by username
	var user models.User
	if err := database.DB.Where("username = ?", username).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	var locations []models.Location
	if err := database.DB.Preload("User").Where("user_id = ?", user.ID).Find(&locations).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch user locations",
		})
	}

	return c.JSON(fiber.Map{
		"user":      user,
		"locations": locations,
		"count":     len(locations),
	})
}
