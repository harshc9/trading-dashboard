package service

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"trading-dashboard-backend/models"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all origins for simplicity
	},
}

// Hub maintains the set of active clients and broadcasts messages to them.
type Hub struct {
	clients    map[*websocket.Conn]bool
	broadcast  chan []models.Stock
	register   chan *websocket.Conn
	unregister chan *websocket.Conn
	mu         sync.Mutex
}

// NewHub creates a new Hub.
func NewHub(broadcastChan chan []models.Stock) *Hub {
	return &Hub{
		broadcast:  broadcastChan,
		register:   make(chan *websocket.Conn),
		unregister: make(chan *websocket.Conn),
		clients:    make(map[*websocket.Conn]bool),
	}
}

// Run starts the Hub's main loop.
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client] = true
			h.mu.Unlock()
		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				client.Close()
			}
			h.mu.Unlock()
		case messages := <-h.broadcast:
			h.mu.Lock()
			messageBytes, err := json.Marshal(messages)
			if err != nil {
				log.Printf("Error marshalling message: %v", err)
				h.mu.Unlock()
				continue
			}
			for client := range h.clients {
				err := client.WriteMessage(websocket.TextMessage, messageBytes)
				if err != nil {
					log.Printf("Error writing to client: %v", err)
					client.Close()
					delete(h.clients, client)
				}
			}
			h.mu.Unlock()
		}
	}
}

// HandleWebSocket handles incoming WebSocket requests.
func (h *Hub) HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading to websocket: %v", err)
		return
	}
	h.register <- conn
}
