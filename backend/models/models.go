package models

import "time"

// Stock represents a stock with its current price and change.
type Stock struct {
	Symbol     string  `json:"symbol"`
	Price      float64 `json:"price"`
	LastChange float64 `json:"last_change"` // Percentage change
}

// Order represents a buy or sell order.
type Order struct {
	ID        string    `json:"id"`
	Symbol    string    `json:"symbol"`
	Side      string    `json:"side"` // "buy" or "sell"
	Quantity  int       `json:"quantity"`
	Price     float64   `json:"price"`
	Timestamp time.Time `json:"timestamp"`
}
