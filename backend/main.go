package main

import (
	"log"
	"os"
	"trading-dashboard-backend/handlers"
	"trading-dashboard-backend/models"
	"trading-dashboard-backend/service"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize Store
	store := service.NewStore()

	// Initialize Channels
	broadcastChan := make(chan []models.Stock)

	// Initialize Hub
	hub := service.NewHub(broadcastChan)
	go hub.Run()

	// Check for Finnhub API Key
	if os.Getenv("FINNHUB_API_KEY") != "" {
		log.Println("Using Finnhub for real-time data")
		symbols := []string{"AAPL", "AMZN", "TSLA", "MSFT", "GOOGL", "BINANCE:BTCUSDT"}
		finnhubClient := service.NewFinnhubClient(store, broadcastChan, symbols)
		go finnhubClient.Start()
	} else {
		log.Println("Using internal simulation for price data (FINNHUB_API_KEY not set)")
		// Initialize Price Generator
		priceGen := service.NewPriceGenerator(store, broadcastChan)
		go priceGen.Start()
	}

	// Initialize Handlers
	h := handlers.NewHandler(store)

	// Setup Router
	r := gin.Default()

	// CORS Configuration
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	r.Use(cors.New(config))

	// Routes
	r.GET("/prices", h.GetPrices)
	r.POST("/orders", h.CreateOrder)
	r.GET("/orders", h.GetOrders)
	r.GET("/ws", func(c *gin.Context) {
		hub.HandleWebSocket(c.Writer, c.Request)
	})

	log.Println("Server starting on :8080")
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Server failed to start: ", err)
	}
}
