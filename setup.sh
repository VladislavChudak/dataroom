#!/bin/bash

# Setup script for Dataroom Manager
# This script helps set up the development environment

echo "🚀 Setting up Dataroom Manager..."
echo ""

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18 or higher is required"
    echo "   Current version: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo ""
    echo "📝 Creating .env.local file..."
    cat > .env.local << 'EOF'
# Firebase Configuration
# Get these values from Firebase Console > Project Settings > Your apps > Web app config
# https://console.firebase.google.com

VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
EOF
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Firebase credentials"
else
    echo ""
    echo "ℹ️  .env.local already exists, skipping..."
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env.local with your Firebase config"
echo "  2. Run 'npm run dev' to start the development server"
echo "  3. Visit http://localhost:5173"
echo ""
echo "📚 See README.md for detailed Firebase setup instructions"
