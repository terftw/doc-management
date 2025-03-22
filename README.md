# Document Management System

A full-stack document management system built with Next.js and Express.js, featuring a web interface and backend API.

## Project Structure

This is a monorepo containing two main packages:

- `packages/document-management-client`: Next.js frontend application
- `packages/document-management-api`: Express.js backend API

## Features

### Frontend

- 📁 Folder and document management
- 🔐 Firebase Authentication
- 🎨 Modern Material-UI interface
- 🔄 Real-time updates
- 📱 Responsive design

### Backend

- 🔐 Firebase Authentication
- 📁 Hierarchical folder structure
- 📄 Document management with file type validation
- 🔍 Full-text search using Elasticsearch
- 🗑️ Soft delete functionality
- 📊 File type detection and validation
- 🔄 Real-time synchronization with Elasticsearch

## Tech Stack

### Frontend

- **Framework**: Next.js 15
- **UI Library**: Material-UI v6
- **State Management**: Zustand
- **Data Fetching**: React Query
- **HTTP Client**: Ky
- **Form Handling**: React Hook Form + Zod
- **Authentication**: Firebase
- **Testing**: Jest + React Testing Library
- **Type Safety**: TypeScript

### Backend

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Search Engine**: Elasticsearch
- **Authentication**: Firebase
- **Testing**: Jest with Supertest
- **Development**: ts-node-dev for hot reloading

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- PostgreSQL
- Elasticsearch
- Firebase project credentials

## Getting Started

1. Clone the repository:

```bash
git clone <https://github.com/terftw/doc-management>
cd doc-manager
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

   - Copy `.env.example` to `.env` in both frontend and backend packages
   - Fill in the required environment variables (see package-specific READMEs for details)

4. Set up the database and Elasticsearch:

   - Follow the instructions in the backend README for database setup
   - Set up Elasticsearch as described in the backend README

5. Start the development servers:

For frontend:

```bash
cd packages/document-management-client
# Follow the instructions in the folder's README
```

For backend:

```bash
cd packages/document-management-api
# Follow the instructions in the folder's README
```

## Development Scripts

### Root Level

- `npm run lint`: Run ESLint across all packages
- `npm run lint:fix`: Fix ESLint issues across all packages
- `npm run format`: Format code using Prettier
- `npm run test`: Run tests across all packages

## Project Structure

### Frontend

```
src/
├── api/             # React Query API hooks and mutations
├── app/             # Next.js app router pages
├── components/      # React components
├── contexts/        # React contexts
├── lib/             # Utility functions and configurations
├── models/          # TypeScript types and schemas
└── store/           # Zustand store
```

### Backend

```
src/
├── features/        # Routes, controllers and service for each feature
├── shared/          # Shared resources for features
├── app.ts           # Main Express application setup and configuration
├── server.ts        # Server Initialization
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Material-UI Documentation](https://mui.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Elasticsearch Documentation](https://www.elastic.co/guide/index.html)
