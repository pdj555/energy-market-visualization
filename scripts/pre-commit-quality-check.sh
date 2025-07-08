#!/bin/bash

# Energy Market Visualization - Pre-commit Quality Gates
# This script enforces code quality standards before commits

set -e

echo "🔍 Running pre-commit quality checks..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if directory exists and has changes
check_changes() {
    local dir=$1
    if [ -d "$dir" ] && git diff --cached --name-only | grep -q "^$dir/"; then
        return 0
    fi
    return 1
}

# Backend Quality Checks
if check_changes "backend"; then
    echo -e "${YELLOW}📦 Backend changes detected - running quality checks...${NC}"
    
    cd backend
    
    # Check Spotless formatting
    echo "🎨 Checking Java code formatting with Spotless..."
    if ! mvn spotless:check -q; then
        echo -e "${RED}❌ Code formatting issues found. Run 'mvn spotless:apply' to fix.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Java code formatting is clean${NC}"
    
    # Run tests
    echo "🧪 Running backend tests..."
    if ! mvn test -q; then
        echo -e "${RED}❌ Backend tests failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Backend tests passed${NC}"
    
    cd ..
else
    echo "⏭️  No backend changes detected, skipping backend checks"
fi

# Frontend Quality Checks
if check_changes "frontend"; then
    echo -e "${YELLOW}🎨 Frontend changes detected - running quality checks...${NC}"
    
    cd frontend
    
    # TypeScript type checking
    echo "🔧 Running TypeScript type checking..."
    if ! npm run type-check; then
        echo -e "${RED}❌ TypeScript type errors found${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ TypeScript types are clean${NC}"
    
    # Prettier formatting check
    echo "🎨 Checking code formatting with Prettier..."
    if ! npm run format:check; then
        echo -e "${RED}❌ Code formatting issues found. Run 'npm run format' to fix.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Code formatting is clean${NC}"
    
    # ESLint
    echo "🔍 Running ESLint checks..."
    if ! npm run lint; then
        echo -e "${RED}❌ ESLint errors found${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ ESLint checks passed${NC}"
    
    # Run tests
    echo "🧪 Running frontend tests..."
    if ! npm run test:ci; then
        echo -e "${RED}❌ Frontend tests failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Frontend tests passed${NC}"
    
    cd ..
else
    echo "⏭️  No frontend changes detected, skipping frontend checks"
fi

echo -e "${GREEN}🎉 All quality checks passed! Ready to commit.${NC}" 