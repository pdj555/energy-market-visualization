# Energy Market Visualization

A real-time energy market data visualization application with WebSocket streaming, built with Spring Boot backend and React frontend.

## Features

- **Real-time Data Streaming**: Live energy price updates via WebSocket connection
- **Interactive Visualizations**: Dynamic charts showing energy prices across different types
- **Market Statistics**: Real-time market overview with volume and average price data
- **Responsive Design**: Modern UI that works on desktop and mobile devices
- **Multiple Energy Types**: Track prices for electricity, gas, coal, solar, wind, nuclear, and hydro

## Technology Stack

### Backend
- Java 22 with Spring Boot 3.5.3
- WebSocket support with STOMP protocol
- Maven for dependency management
- Real-time data simulation service

### Frontend
- React 19 with TypeScript
- Vite for fast development
- Chart.js for data visualization
- Tailwind CSS for styling
- WebSocket client with @stomp/stompjs

## Prerequisites

- Java 22 or higher
- Node.js 20 or higher
- npm 10 or higher
- Maven 3.8 or higher

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build the application:
   ```bash
   mvn clean install
   ```

3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## API Endpoints

- `GET /api/energy-market/prices` - Get current prices for all energy types
- `GET /api/energy-market/prices/{energyType}` - Get price for specific energy type
- `GET /api/energy-market/stats` - Get market statistics
- `GET /api/energy-market/energy-types` - Get all available energy types

## WebSocket Topics

- `/topic/energy-prices` - Real-time energy price updates
- `/topic/market-stats` - Real-time market statistics

## Configuration

Backend configuration can be modified in `backend/src/main/resources/application.yml`:
- Update interval for data streaming
- Base prices for different energy types
- Price volatility settings

## Development

### Running Tests

Backend:
```bash
cd backend
mvn test
```

Frontend:
```bash
cd frontend
npm test
```

### Code Quality

Backend uses Spotless for code formatting:
```bash
mvn spotless:apply
```

Frontend uses ESLint and Prettier:
```bash
npm run lint
npm run format
```

## Production Build

### Backend
```bash
cd backend
mvn clean package
java -jar target/energy-service-1.0.0.jar
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## License

This project is licensed under the MIT License.