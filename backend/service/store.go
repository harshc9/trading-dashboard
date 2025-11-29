package service

import (
	"sync"
	"trading-dashboard-backend/models"
)

// Store holds the in-memory state of the application.
type Store struct {
	Stocks map[string]*models.Stock
	Orders []*models.Order
	mu     sync.RWMutex
}

// NewStore initializes a new Store.
func NewStore() *Store {
	return &Store{
		Stocks: make(map[string]*models.Stock),
		Orders: make([]*models.Order, 0),
	}
}

// GetStocks returns a copy of the current stocks.
func (s *Store) GetStocks() []models.Stock {
	s.mu.RLock()
	defer s.mu.RUnlock()

	stocks := make([]models.Stock, 0, len(s.Stocks))
	for _, stock := range s.Stocks {
		stocks = append(stocks, *stock)
	}
	return stocks
}

// AddOrder adds a new order to the store.
func (s *Store) AddOrder(order models.Order) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.Orders = append(s.Orders, &order)
}

// GetOrders returns a copy of the current orders.
func (s *Store) GetOrders() []models.Order {
	s.mu.RLock()
	defer s.mu.RUnlock()

	orders := make([]models.Order, len(s.Orders))
	for i, order := range s.Orders {
		orders[i] = *order
	}
	return orders
}

// UpdateStockPrice updates the price of a stock safely.
func (s *Store) UpdateStockPrice(symbol string, newPrice float64) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if stock, exists := s.Stocks[symbol]; exists {
		// Calculate percentage change
		if stock.Price != 0 {
			stock.LastChange = ((newPrice - stock.Price) / stock.Price) * 100
		}
		stock.Price = newPrice
	} else {
		// Initialize if not exists (though simulation should probably init them first)
		s.Stocks[symbol] = &models.Stock{
			Symbol: symbol,
			Price:  newPrice,
		}
	}
}
