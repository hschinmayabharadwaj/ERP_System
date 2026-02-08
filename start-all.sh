#!/bin/bash

# ERP System - Start All Services Script
# This script starts the Node.js backend, Python backend, and Frontend

echo "🚀 Starting ERP System Services..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# check_port checks whether the TCP port given as $1 is in LISTEN state and returns 0 if the port is in use, 1 otherwise.
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check if MongoDB is running
echo "📦 Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB not found. Please ensure MongoDB is installed and running.${NC}"
else
    echo -e "${GREEN}✅ MongoDB found${NC}"
fi

# Start Node.js Backend
echo ""
echo "🟢 Starting Node.js Backend (Port 5000)..."
cd "$SCRIPT_DIR/backend"
if check_port 5000; then
    echo -e "${YELLOW}⚠️  Port 5000 is already in use${NC}"
else
    npm run dev &
    NODE_PID=$!
    echo -e "${GREEN}✅ Node.js Backend started (PID: $NODE_PID)${NC}"
fi

# Start Python Backend
echo ""
echo "🐍 Starting Python Backend (Port 8000)..."
cd "$SCRIPT_DIR/python-backend"
if check_port 8000; then
    echo -e "${YELLOW}⚠️  Port 8000 is already in use${NC}"
else
    if [ -d "venv" ]; then
        source venv/bin/activate
    fi
    uvicorn main:app --reload --port 8000 &
    PYTHON_PID=$!
    echo -e "${GREEN}✅ Python Backend started (PID: $PYTHON_PID)${NC}"
fi

# Start Frontend
echo ""
echo "⚛️  Starting Frontend (Port 3000)..."
cd "$SCRIPT_DIR/frontend"
if check_port 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use${NC}"
else
    npm run dev &
    FRONTEND_PID=$!
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 All services started!${NC}"
echo ""
echo "📡 Services running at:"
echo "   • Frontend:        http://localhost:3000"
echo "   • Node.js API:     http://localhost:5000/api"
echo "   • Python API:      http://localhost:8000/api/py"
echo "   • Python Docs:     http://localhost:8000/api/py/docs"
echo ""
echo "🔑 Login with: admin@erpsystem.com / password123"
echo ""
echo "Press Ctrl+C to stop all services..."
echo "=========================================="

# Wait for all background processes
wait