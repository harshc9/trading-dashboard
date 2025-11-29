package service

import (
	"math/rand"
	"time"
	"trading-dashboard-backend/models"
)

// PriceGenerator handles the simulation of stock price changes.
type PriceGenerator struct {
	Store         *Store
	UpdateChannel chan []models.Stock
}

// NewPriceGenerator creates a new PriceGenerator.
func NewPriceGenerator(store *Store, updateChan chan []models.Stock) *PriceGenerator {
	return &PriceGenerator{
		Store:         store,
		UpdateChannel: updateChan,
	}
}

// Start begins the price simulation loop.
func (pg *PriceGenerator) Start() {
	// Initialize some dummy stocks if empty
	if len(pg.Store.Stocks) == 0 {
		pg.Store.UpdateStockPrice("AAPL", 150.00)
		pg.Store.UpdateStockPrice("GOOGL", 2800.00)
		pg.Store.UpdateStockPrice("AMZN", 3400.00)
		pg.Store.UpdateStockPrice("TSLA", 700.00)
		pg.Store.UpdateStockPrice("MSFT", 300.00)
	}

	ticker := time.NewTicker(2 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		pg.updatePrices()
	}
}

func (pg *PriceGenerator) updatePrices() {
	stocks := pg.Store.GetStocks()
	updatedStocks := make([]models.Stock, 0, len(stocks))

	for _, stock := range stocks {
		// Random fluctuation between -2% and +2%
		changePercent := (rand.Float64() * 4) - 2
		newPrice := stock.Price * (1 + changePercent/100)
		
		// Ensure price doesn't go below 0.01
		if newPrice < 0.01 {
			newPrice = 0.01
		}

		pg.Store.UpdateStockPrice(stock.Symbol, newPrice)
		
		// Get the updated stock object to send
		updatedStock := pg.Store.Stocks[stock.Symbol]
		updatedStocks = append(updatedStocks, *updatedStock)
	}

	// Send updates to the channel
	pg.UpdateChannel <- updatedStocks
}
