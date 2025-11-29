# House of EdTech - Backend

The backend service for the House of EdTech Real-Time Trading Dashboard. Built with Golang, it provides REST APIs for order management and a WebSocket feed for real-time stock prices.

## Features
- **Real-Time Data**: Integrates with Finnhub.io WebSocket API.
- **Simulation Mode**: Fallback to internal price simulation if no API key is provided.
- **REST APIs**: Endpoints for fetching prices and managing orders.
- **WebSocket**: Broadcasts live price updates to connected clients.
- **Thread Safety**: Uses `sync.RWMutex` for safe concurrent data access.

## Prerequisites
- Go 1.18 or higher

## Installation

1.  Clone the repository and navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    go mod tidy
    ```

## Configuration

The application uses environment variables for configuration.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `FINNHUB_API_KEY` | API Key for Finnhub.io. If not set, the app runs in simulation mode. | `""` |
| `PORT` | Port to run the server on. | `8080` |

## Running the Application

### With Real-Time Data (Finnhub)
```bash
export FINNHUB_API_KEY="your_api_key_here"
go run main.go
```

### With Simulation Mode (Default)
```bash
go run main.go
```
The server will start at `http://localhost:8080`.

## API Endpoints

### HTTP
-   `GET /prices`: Get current stock prices.
-   `POST /orders`: Place a new order.
    -   Body: `{"symbol": "AAPL", "side": "buy", "quantity": 10, "price": 150.00}`
-   `GET /orders`: Get order history.

### WebSocket
-   `GET /ws`: Connect to the real-time price feed.

## Project Structure
-   `main.go`: Entry point.
-   `handlers/`: HTTP request handlers.
-   `models/`: Data structures.
-   `service/`: Business logic (Finnhub client, Price Generator, Store, Hub).
