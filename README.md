# Bookmark Manager

A full-stack bookmarking application built with TypeScript, React, and Node.js.

## Features

- Create, read, update, and delete bookmarks
- Modern and responsive UI with Chakra UI
- Type-safe API with Zod validation
- SQLite database with Prisma ORM
- RESTful API endpoints

## Tech Stack

### Backend
- Node.js with Express
- TypeScript
- Prisma ORM
- SQLite database
- Zod for validation

### Frontend
- React with TypeScript
- Vite
- Chakra UI
- Axios for API calls

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bookmark-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
cd packages/server
npx prisma generate
npx prisma migrate dev
```

4. Start the development servers:

In one terminal:
```bash
cd packages/server
npm run dev
```

In another terminal:
```bash
cd packages/client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

- `POST /api/links` - Create a new link
- `GET /api/links` - Get all links
- `GET /api/links/:id` - Get a single link
- `PUT /api/links/:id` - Update a link
- `DELETE /api/links/:id` - Delete a link

## Project Structure

```
bookmark-app/
├── packages/
│   ├── client/          # React frontend
│   └── server/          # Node.js backend
├── package.json         # Root package.json
└── README.md
```

## Development

- The project uses a monorepo structure with npm workspaces
- Frontend and backend are separate packages
- Shared types and utilities can be added in a shared package if needed

## License

ISC 