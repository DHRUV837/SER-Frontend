#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up Sales Reward Engine (MySQL Edition)..."

# 0. Check for MySQL
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL command not found! Please install MySQL and ensure it's in your PATH."
    exit 1
fi

# 1. Setup Database
echo "\n🗄️  Initializing Database..."
echo "Please enter your MySQL root password to create the 'sales_reward' database:"
mysql -u root -p < setup_db.sql
echo "✅ Database configured."

# Ask for password again or store it for the app? 
# Ideally we export it, but for simplicity let's ask the user to provide it to the app via env var or just rely on them setting it if it's empty.
# For this script, we'll ask for it to pass to the backend process if needed, 
# or just tell the user to set DB_PASSWORD.
echo "\n🔑 Note: The backend expects the MySQL password in the 'DB_PASSWORD' environment variable."
echo "   If your root password is empty, you can skip this."
read -s -p "Enter MySQL root password for the Backend Application: " DB_PASS
export DB_PASSWORD=$DB_PASS
echo "\n"

# 2. Setup Backend
echo "\n📦 Setting up Backend (Gradle)..."
cd SalesIncentiveSystem
if [ -f "gradlew" ]; then
    chmod +x gradlew
    echo "✅ Made gradlew executable."
else
    echo "❌ Error: gradlew not found in SalesIncentiveSystem!"
    exit 1
fi
cd ..

# 3. Setup Frontend
echo "\n🎨 Setting up Frontend (Vite)..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✅ Node modules already exist, skipping install."
fi
cd ..

echo "\n✅ Setup Complete!"
echo "\n---------------------------------------------------"
echo "To run the application, open two terminal tabs:"
echo "\nTab 1 (Backend):"
echo "  export DB_PASSWORD='YOUR_PASSWORD'"
echo "  cd SalesIncentiveSystem"
echo "  ./gradlew bootRun"
echo "\nTab 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo "\n---------------------------------------------------"
