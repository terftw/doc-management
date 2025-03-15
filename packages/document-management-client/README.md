# Document Management System

A web application for managing documents and folders, built with Next.js and Material-UI.

## Features

- 📁 Folder and document management

## Tech Stack

- **Framework**: Next.js 15
- **UI Library**: Material-UI v6
- **State Management**: Zustand
- **Data Fetching**: React Query
- **HTTP Client**: Ky
- **Form Handling**: React Hook Form + Zod
- **Authentication**: Firebase
- **Testing**: Jest + React Testing Library
- **Type Safety**: TypeScript

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Firebase project credentials

## Environment Variables

Note: Ask Terence for credentials, but not encouraged

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

NEXT_PUBLIC_API_BASE_URL=
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing

Run the test suite:

```bash
npm run test
```

For watch mode:

```bash
npm run test:watch
```

## Project Structure

```
src/
├── api/                    # React Query API hooks and mutations
│   ├── documents/         # Document-related API calls
│   ├── folders/          # Folder-related API calls
│   └── fsentries/        # File system entry API calls
├── app/                   # Next.js app router pages
│   ├── (auth)/           # Authentication routes
│   ├── folders/          # Folder management pages
│   └── home/             # Dashboard and home pages
├── components/           # React components
│   ├── fsentries/       # File system entry components
│   ├── shared/          # Shared components
│   └── ui/              # Reusable UI components
├── contexts/            # React contexts
├── lib/                 # Utility functions and configurations
│   ├── api-client.ts    # API client configuration
│   ├── firebase.ts      # Firebase initialization
│   ├── react-query.ts   # React Query configuration
├── models/              # TypeScript types and schemas
│   ├── document.ts      # Document type definitions
│   ├── folder.ts        # Folder type definitions
│   └── fsentry.ts       # File system entry types
└── store/               # Zustand store
    └── form-store.ts    # Form state management
```

### Key Directories

- **`api/`**: Contains all API-related hooks and mutations using React Query
- **`app/`**: Next.js app router pages with route groups for better organization
- **`components/`**: React components organized by feature and reusability
- **`contexts/`**: React contexts for global state management
- **`lib/`**: Utility functions, configurations, and shared logic
- **`models/`**: TypeScript type definitions and Zod schemas
- **`store/`**: Zustand store for client-side state management

### Component Organization

- **`{FEATURE_NAME}/`**: Components for handling features in the application
- **`shared/`**: Components shared across multiple features
- **`ui/`**: Reusable UI components like forms, tables, and notifications

### State Management

- **`contexts/`**: For global UI state (e.g., user authentication)
- **`store/`**: For form state and other client-side state using Zustand

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
