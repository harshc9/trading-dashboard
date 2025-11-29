# House of EdTech - Frontend

The frontend for the House of EdTech Real-Time Trading Dashboard. Built with React, Vite, and Tailwind CSS, it offers a premium, glassmorphism-inspired UI for tracking stocks and placing orders.

## Features
- **Premium UI**: Modern design with glassmorphism, gradients, and animations.
- **Real-Time Updates**: Live stock prices updated via WebSocket.
- **Interactive Charts**: (Planned) Visual representation of price trends.
- **Order Management**:
    -   **Symbol Autocomplete**: Smart suggestions based on available stocks.
    -   **Price Auto-fill**: Automatically populates current price.
    -   **Order History**: View past trades in real-time.
- **Responsive Design**: Fully optimized for desktop and mobile.

## Prerequisites
- Node.js 16 or higher
- npm or yarn

## Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Running the Application

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Building for Production

Build the application for production:
```bash
npm run build
```
The output will be in the `dist` directory.

## Configuration
The frontend expects the backend to be running at `http://localhost:8080`.
To change this, update the WebSocket URL in `src/hooks/useWebSocket.js` and API URL in `src/services/api.js`.

## Tech Stack
-   **React**: UI Library
-   **Vite**: Build Tool
-   **Tailwind CSS**: Styling
-   **Glassmorphism**: Design Aesthetic
