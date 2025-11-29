package handlers

import (
	"net/http"
	"time"
	"trading-dashboard-backend/models"
	"trading-dashboard-backend/service"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// Handler holds dependencies for API handlers.
type Handler struct {
	Store *service.Store
}

// NewHandler creates a new Handler.
func NewHandler(store *service.Store) *Handler {
	return &Handler{Store: store}
}

// GetPrices returns the current list of stock prices.
func (h *Handler) GetPrices(c *gin.Context) {
	stocks := h.Store.GetStocks()
	c.JSON(http.StatusOK, stocks)
}

// CreateOrder handles the creation of a new order.
func (h *Handler) CreateOrder(c *gin.Context) {
	var order models.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validate order
	if order.Symbol == "" || (order.Side != "buy" && order.Side != "sell") || order.Quantity <= 0 || order.Price <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order details"})
		return
	}

	// Set ID and Timestamp
	order.ID = uuid.New().String()
	order.Timestamp = time.Now()

	h.Store.AddOrder(order)

	c.JSON(http.StatusCreated, order)
}

// GetOrders returns the list of all orders.
func (h *Handler) GetOrders(c *gin.Context) {
	orders := h.Store.GetOrders()
	c.JSON(http.StatusOK, orders)
}
