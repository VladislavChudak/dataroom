# Dataroom Manager

A document management application built with React and TypeScript. Features Google Drive-inspired interface for organizing files and folders with authentication and local storage.

Live demo available at: https://dataroom-kappa.vercel.app/
## Overview

This is a frontend-focused project that demonstrates modern React patterns and clean architecture. It uses Firebase Authentication for user management and IndexedDB for client-side storage, making it fully functional without a backend server.

## Features

- Google OAuth authentication
- Create and manage multiple datarooms
- Nested folder structure with unlimited depth
- PDF file upload, viewing, and management
- Global search across all content
- Automatic handling of duplicate file names
- Cascade deletion of folders and their contents
- Responsive design with mobile support

## Tech Stack

**Core Technologies**

- React 19 with TypeScript 5.9
- Vite 7 for build tooling
- React Router 7 for navigation
- Firebase Authentication (Google OAuth)

**UI & Styling**

- Tailwind CSS v4
- shadcn/ui component library
- Lucide React icons

**State & Data**

- TanStack Query v5 for server state
- Dexie for IndexedDB operations
- Zod for validation

## Architecture

The application follows a repository pattern to abstract data access from UI components:

```
Components → Custom Hooks → Repository Interface → IndexedDB
```

This makes it easy to swap storage backends (e.g., REST API) by implementing a new repository class without changing any UI code.

**Project Structure**

```
src/
├── app/                    # App shell, routing, providers
├── features/               # Feature modules (auth, datarooms, explorer)
├── components/             # Shared UI components
├── repo/                   # Repository pattern implementation
├── lib/                    # Utility functions
└── hooks/                  # Shared custom hooks
```

Each feature is self-contained with its own components, hooks, and pages.

## Data Model

The application uses three main entities stored in IndexedDB:

- **Dataroom**: Top-level container with a root folder
- **Folder**: Hierarchical folder structure supporting unlimited nesting
- **File**: PDF documents with metadata and binary blob data

Key validations:

- Folder names must be unique within their parent
- Duplicate file names are automatically renamed (e.g., `file.pdf` → `file (1).pdf`)
- Only PDF files are supported
- Deleting a folder removes all nested contents

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase project with Google Authentication enabled

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Google Authentication in Authentication → Sign-in method
3. Register a web app and copy the configuration
4. Add authorized domains (localhost is pre-authorized)

### Installation

```bash
# Install dependencies
npm install

# Create .env.local file with Firebase config
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Start development server
npm run dev
```

## Building & Deployment

```bash
# Production build
npm run build
npm run preview

# Docker deployment
docker-compose up -d

# Vercel deployment
# Push to GitHub and import project to Vercel
# Add VITE_FIREBASE_* environment variables in Vercel settings
# Update Firebase authorized domains with your Vercel URL
```

## Development

```bash
# Development server
npm run dev

# Type checking
npm run build

# Linting
npm run lint

# Code formatting
npm run format
```

## Testing

This project uses **Vitest** and **React Testing Library** for comprehensive testing:

### Test Categories

- **Unit Tests**: Utility functions (validators, formatters)
- **Integration Tests**: Complex workflows (file uploads, batch operations)
- **Component Tests**: React components (SearchBar, buttons, dialogs)
- **Repository Tests**: Data access layer (IndexedDB operations)

### Running Tests

```bash
# Watch mode (recommended during development)
npm test

# Single run (CI/CD)
npm run test:run

# With interactive UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```
