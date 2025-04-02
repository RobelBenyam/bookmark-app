# Bookmark App

A full-stack bookmarking application built with Node.js, Express, TypeScript, React, and Prisma. This project was built as a technical challenge to demonstrate full-stack development skills.

## Features

### Core Features
- User authentication (register/login) with JWT
- Create, read, update, and delete bookmarks
- Add tags to bookmarks
- Search and filter bookmarks by title, URL, or tags
- Pagination for bookmark list
- Modern and responsive UI with Chakra UI
- TypeScript for type safety
- Docker support for easy deployment

### Bonus Features Implemented
- User Authentication with JWT
- Tag Management System
- Search and Filtering
- Pagination
- Edit Functionality
- Client-side Routing
- Improved UX with Loading States and Optimistic Updates
- Testing (Backend API tests with Jest & Supertest)
- Dockerization with Nginx for frontend

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM with SQLite (development) / PostgreSQL (production)
- JWT authentication
- Jest & Supertest for testing
- Zod for input validation

### Frontend
- React with TypeScript
- Vite for fast development
- Chakra UI for components
- React Router for navigation
- Axios for API calls
- Vitest for testing

## Project Structure
```
bookmark-app/
├── packages/
│   ├── client/     # React frontend
│   │   ├── src/    # Source code
│   │   └── nginx.conf  # Nginx configuration for production
│   └── server/     # Express backend
│       ├── src/    # Source code
│       └── prisma/ # Database schema and migrations
├── docker-compose.yml
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Docker and Docker Compose (optional)
- SQLite (included with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/RobelBenyam/bookmark-app.git
cd bookmark-app
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install client dependencies
cd packages/client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables:
```bash
# In packages/server/.env
DATABASE_URL="file:./dev.db"
PORT=3002
JWT_SECRET="bookmark-app-dev-secret-2024"  # For development only. Use a strong random secret in production.

# In packages/client/.env
VITE_API_URL="http://localhost:3002"
```

4. Start the development servers:
```bash
# Start the backend server
cd packages/server
npm run dev

# Start the frontend development server
cd ../client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3002

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Links
- `GET /api/links` - Get all links (paginated)
- `POST /api/links` - Create a new link
- `GET /api/links/:id` - Get a specific link
- `PUT /api/links/:id` - Update a link
- `DELETE /api/links/:id` - Delete a link
- `GET /api/links/search` - Search links

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create a new tag
- `PUT /api/tags/:id` - Update a tag
- `DELETE /api/tags/:id` - Delete a tag

## Testing

```bash
# Run backend tests
cd packages/server
npm test
npm run test:coverage  # For coverage report

# Run frontend tests
cd ../client
npm test
npm run test:coverage  # For coverage report
```

## Docker Deployment

1. Build and start the containers:
```bash
docker-compose up -d
```

2. Run database migrations:
```bash
docker-compose exec server npx prisma migrate deploy
```

The application will be available at:
- Frontend: http://localhost:80 (served by Nginx)
- Backend API: http://localhost:3000

Note: The Docker setup uses PostgreSQL for the database, while the development setup uses SQLite for simplicity.

## Technology Choices & Assumptions

1. **SQLite over PostgreSQL**: Chosen for development simplicity and zero-config setup. Can be easily switched to PostgreSQL for production.
2. **Chakra UI**: Selected for rapid development of a modern, responsive UI with built-in dark mode support.
3. **JWT Authentication**: Implemented for secure user authentication without session management complexity.
4. **Monorepo Structure**: Used for better code organization and shared dependencies between frontend and backend.
5. **Nginx in Production**: Used to serve the frontend static files and handle API proxying.

## Challenges Faced

1. **State Management**: Implemented a custom hook-based solution for managing global state without external libraries.
2. **Real-time Updates**: Added optimistic UI updates for better user experience.
3. **Type Safety**: Ensured end-to-end type safety between frontend and backend using TypeScript.
4. **Testing**: Set up comprehensive test suites for both frontend and backend with coverage reporting.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 