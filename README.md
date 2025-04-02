# Bookmark App

A full-stack bookmarking application built with Node.js, Express, TypeScript, React, and Prisma.

## Features

- User authentication (register/login)
- Create, read, update, and delete bookmarks
- Add tags to bookmarks
- Search and filter bookmarks by title, URL, or tags
- Pagination for bookmark list
- Modern and responsive UI with Chakra UI
- TypeScript for type safety
- Docker support for easy deployment

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- PostgreSQL database
- JWT authentication

### Frontend
- React with TypeScript
- Vite for fast development
- Chakra UI for components
- React Router for navigation
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- PostgreSQL (if not using Docker)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bookmark-app.git
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
DATABASE_URL="postgresql://user:password@localhost:5432/bookmark_app"
JWT_SECRET="your-secret-key"

# In packages/client/.env
VITE_API_URL="http://localhost:3000"
```

4. Start the development servers:
```bash
# Start the database (if using Docker)
docker-compose up -d

# Start the backend server
cd packages/server
npm run dev

# Start the frontend development server
cd ../client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Links
- GET /api/links - Get all links (paginated)
- POST /api/links - Create a new link
- GET /api/links/:id - Get a specific link
- PUT /api/links/:id - Update a link
- DELETE /api/links/:id - Delete a link
- GET /api/links/search - Search links

### Tags
- GET /api/tags - Get all tags
- POST /api/tags - Create a new tag
- PUT /api/tags/:id - Update a tag
- DELETE /api/tags/:id - Delete a tag

## Testing

```bash
# Run backend tests
cd packages/server
npm test

# Run frontend tests
cd ../client
npm test
```

## Deployment

1. Build the frontend:
```bash
cd packages/client
npm run build
```

2. Start the production servers:
```bash
# Start the database
docker-compose up -d

# Start the backend server
cd packages/server
npm start

# Serve the frontend (using a static file server)
cd ../client
npm run preview
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 