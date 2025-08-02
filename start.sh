#!/bin/bash

echo "Starting Energy Market Visualization Application..."
echo "================================================"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "Port $1 is already in use. Please stop the existing service."
        return 1
    fi
    return 0
}

# Check if ports are available
check_port 8080 || exit 1
check_port 5173 || exit 1

# Start backend
echo ""
echo "Starting backend server on port 8080..."
cd backend
if [ -f mvnw ]; then
    ./mvnw spring-boot:run &
elif command -v mvn &> /dev/null; then
    mvn spring-boot:run &
else
    echo "Maven not found. Please install Maven or use the Maven wrapper."
    exit 1
fi
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Start frontend
echo ""
echo "Starting frontend server on port 5173..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "================================================"
echo "Application started successfully!"
echo ""
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "================================================"

# Function to handle cleanup
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up trap to handle Ctrl+C
trap cleanup INT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID