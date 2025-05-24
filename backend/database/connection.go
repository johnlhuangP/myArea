package database

import (
	"log"
	"os"

	"myarea-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

// Connect initializes database connection
func Connect() {
	var err error
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
		PrepareStmt: false,
	})

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("✅ Database connected successfully")
}

// Migrate runs database migrations
func Migrate() {
	err := DB.AutoMigrate(&models.User{}, &models.Location{}, &models.Guide{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
	log.Println("✅ Database migrations completed")
}

// SeedBayAreaLocations adds sample Bay Area locations to the database
func SeedBayAreaLocations() {
	// Check if locations already exist
	var count int64
	DB.Model(&models.Location{}).Count(&count)
	if count > 0 {
		log.Println("⏭️  Sample locations already exist, skipping seed")
		return
	}

	// Create a sample user for seeding (this should be replaced with actual user creation)
	sampleUser := models.User{
		Email:       "seed@myarea.com",
		Username:    "myarea_seed",
		DisplayName: "MyArea Curator",
	}
	DB.FirstOrCreate(&sampleUser, models.User{Email: "seed@myarea.com"})

	sampleLocations := []models.Location{
		{
			UserID:      sampleUser.ID,
			Name:        "Golden Gate Bridge",
			Description: stringPtr("Iconic suspension bridge and San Francisco landmark"),
			Category:    models.CategoryViewpoint,
			Address:     "Golden Gate Bridge, San Francisco, CA 94129",
			Latitude:    37.8199,
			Longitude:   -122.4783,
			City:        "San Francisco",
			Rating:      intPtr(5),
			Tags:        []string{"iconic", "photography", "walking"},
		},
		{
			UserID:      sampleUser.ID,
			Name:        "Tartine Bakery",
			Description: stringPtr("Famous bakery known for incredible pastries and bread"),
			Category:    models.CategoryCafe,
			Address:     "600 Guerrero St, San Francisco, CA 94110",
			Latitude:    37.7617,
			Longitude:   -122.4240,
			City:        "San Francisco",
			Rating:      intPtr(4),
			PriceLevel:  intPtr(3),
			Tags:        []string{"bakery", "pastries", "coffee"},
		},
		{
			UserID:      sampleUser.ID,
			Name:        "Dolores Park",
			Description: stringPtr("Popular park with great city views and picnic spots"),
			Category:    models.CategoryPark,
			Address:     "Dolores St & 18th St, San Francisco, CA 94114",
			Latitude:    37.7596,
			Longitude:   -122.4269,
			City:        "San Francisco",
			Rating:      intPtr(4),
			Tags:        []string{"picnic", "views", "outdoor"},
		},
		{
			UserID:      sampleUser.ID,
			Name:        "Muir Woods",
			Description: stringPtr("Ancient redwood forest just north of the Golden Gate"),
			Category:    models.CategoryHike,
			Address:     "1 Muir Woods Rd, Mill Valley, CA 94941",
			Latitude:    37.8965,
			Longitude:   -122.5811,
			City:        "Mill Valley",
			Rating:      intPtr(5),
			Tags:        []string{"redwoods", "nature", "hiking"},
		},
		{
			UserID:      sampleUser.ID,
			Name:        "The Ferry Building",
			Description: stringPtr("Historic ferry terminal with artisanal food vendors"),
			Category:    models.CategoryShopping,
			Address:     "1 Ferry Building, San Francisco, CA 94111",
			Latitude:    37.7955,
			Longitude:   -122.3933,
			City:        "San Francisco",
			Rating:      intPtr(4),
			PriceLevel:  intPtr(3),
			Tags:        []string{"food", "market", "shopping"},
		},
	}

	for _, location := range sampleLocations {
		result := DB.Create(&location)
		if result.Error != nil {
			log.Printf("Failed to seed location %s: %v", location.Name, result.Error)
		}
	}

	log.Printf("✅ Seeded %d sample Bay Area locations", len(sampleLocations))
}

// Helper functions for pointers
func stringPtr(s string) *string {
	return &s
}

func intPtr(i int) *int {
	return &i
}
