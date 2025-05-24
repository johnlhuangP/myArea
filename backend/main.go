package main

import (
	"log"
	"myarea-backend/database"
	"myarea-backend/handlers"
	"myarea-backend/middleware"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize database
	database.Connect()
	database.Migrate()
	//database.SeedBayAreaLocations()

	// Initialize Fiber app
	app := fiber.New(fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			if e, ok := err.(*fiber.Error); ok {
				code = e.Code
			}
			return c.Status(code).JSON(fiber.Map{
				"error": err.Error(),
			})
		},
	})

	// Middleware
	app.Use(logger.New())

	// Get CORS origin from environment or default to localhost
	corsOrigin := os.Getenv("CORS_ORIGIN")
	if corsOrigin == "" {
		corsOrigin = "http://localhost:3000"
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins: corsOrigin,
		AllowHeaders: "Origin, Content-Type, Accept, Authorization",
		AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
	}))

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "ok",
			"message": "MyArea API is running",
		})
	})

	// API routes
	api := app.Group("/api/v1")

	// Auth routes
	auth := api.Group("/auth")
	auth.Post("/register", handlers.Register)
	auth.Post("/login", handlers.Login)
	auth.Get("/me", middleware.AuthRequired, handlers.GetProfile)
	auth.Put("/me", middleware.AuthRequired, handlers.UpdateProfile)

	// Location routes
	locations := api.Group("/locations")
	locations.Get("/", middleware.OptionalAuth, handlers.GetLocations)
	locations.Get("/:id", middleware.OptionalAuth, handlers.GetLocation)
	locations.Post("/", middleware.AuthRequired, handlers.CreateLocation)
	locations.Put("/:id", middleware.AuthRequired, handlers.UpdateLocation)
	locations.Delete("/:id", middleware.AuthRequired, handlers.DeleteLocation)

	// User routes
	users := api.Group("/users")
	users.Get("/:username/locations", middleware.OptionalAuth, handlers.GetUserLocations)

	// Get port from environment or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
