package service

import (
	"encoding/json"
	"log"
	"os"
	"sync"
	"time"
	"trading-dashboard-backend/models"

	"github.com/gorilla/websocket"
)

const finnhubWSURL = "wss://ws.finnhub.io?token="

// FinnhubClient handles the connection to Finnhub WebSocket API.
type FinnhubClient struct {
	Store         *Store
	UpdateChannel chan []models.Stock
	APIKey        string
	Symbols       []string
	conn          *websocket.Conn
	mu            sync.Mutex
}

// NewFinnhubClient creates a new FinnhubClient.
func NewFinnhubClient(store *Store, updateChan chan []models.Stock, symbols []string) *FinnhubClient {
	apiKey := os.Getenv("FINNHUB_API_KEY")
	if apiKey == "" {
		log.Println("Warning: FINNHUB_API_KEY not set. Real-time data will not work.")
	}

	return &FinnhubClient{
		Store:         store,
		UpdateChannel: updateChan,
		APIKey:        apiKey,
		Symbols:       symbols,
	}
}

// Start connects to Finnhub and starts listening for updates.
func (fc *FinnhubClient) Start() {
	if fc.APIKey == "" {
		return
	}

	url := finnhubWSURL + fc.APIKey
	var err error
	fc.conn, _, err = websocket.DefaultDialer.Dial(url, nil)
	if err != nil {
		log.Printf("Error connecting to Finnhub: %v", err)
		return
	}
	defer fc.conn.Close()

	// Subscribe to symbols
	for _, symbol := range fc.Symbols {
		msg := map[string]interface{}{
			"type":   "subscribe",
			"symbol": symbol,
		}
		if err := fc.conn.WriteJSON(msg); err != nil {
			log.Printf("Error subscribing to %s: %v", symbol, err)
		}
	}

	log.Println("Connected to Finnhub WebSocket")

	// Listen for messages
	for {
		_, message, err := fc.conn.ReadMessage()
		if err != nil {
			log.Printf("Error reading from Finnhub: %v", err)
			// Reconnect logic could go here
			time.Sleep(5 * time.Second)
			fc.Start() // Simple reconnect
			return
		}

		fc.handleMessage(message)
	}
}

type FinnhubMessage struct {
	Type string `json:"type"`
	Data []struct {
		Symbol string  `json:"s"`
		Price  float64 `json:"p"`
		Time   int64   `json:"t"`
		Volume float64 `json:"v"`
	} `json:"data"`
}

func (fc *FinnhubClient) handleMessage(message []byte) {
	var msg FinnhubMessage
	if err := json.Unmarshal(message, &msg); err != nil {
		log.Printf("Error unmarshalling Finnhub message: %v", err)
		return
	}

	if msg.Type == "trade" {
		updatedStocks := make([]models.Stock, 0)
		
		for _, trade := range msg.Data {
			// Update store
			fc.Store.UpdateStockPrice(trade.Symbol, trade.Price)
			
			// Get updated stock object
			if stock, ok := fc.Store.Stocks[trade.Symbol]; ok {
				updatedStocks = append(updatedStocks, *stock)
			}
		}

		// Send full state to ensure frontend has all stocks
		allStocks := fc.Store.GetStocks()
		if len(allStocks) > 0 {
			fc.UpdateChannel <- allStocks
		}
	}
}
