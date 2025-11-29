# House of EdTech - Real-Time Trading Dashboard

Welcome to the **House of EdTech** Real-Time Trading Dashboard. This project is a full-stack application designed to simulate a trading environment with real-time data updates and a modern, glassmorphism-inspired user interface.

## Project Overview

The system consists of two main components:
1.  **Backend (Golang)**: Handles WebSocket connections, REST APIs, and integrates with Finnhub.io for real-time stock data.
2.  **Frontend (React)**: A responsive, high-performance dashboard built with Vite and Tailwind CSS.

## Quick Links

-   [**Backend Documentation**](./backend/README.md): Setup, API endpoints, and configuration.
-   [**Frontend Documentation**](./frontend/README.md): Installation, build instructions, and UI features.

## Tech Stack

### Backend
-   **Language**: Golang
-   **Framework**: Gin
-   **Real-Time**: Gorilla WebSocket
-   **Data Source**: Finnhub.io (with internal simulation fallback)

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: Tailwind CSS
-   **Design**: Glassmorphism, Custom Gradients

## Getting Started

To run the entire system locally:

1.  **Start the Backend**:
    ```bash
    cd backend
    go run main.go
    ```
    *(Optional: Set `FINNHUB_API_KEY` env var for live data)*

2.  **Start the Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```

3.  Open your browser and navigate to `http://localhost:5173`.

## License
This project is part of the House of EdTech assignment.
