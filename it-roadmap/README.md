# IT Roadmap Learning System

A comprehensive platform for creating and following IT learning roadmaps.

## Features

- User authentication (register, login, profile management)
- Create and manage roadmaps with visual node-based editor
- Track learning progress on various roadmaps
- Course catalog with resources
- Admin panel for managing skills and categories

## Tech Stack

### Backend

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication

### Frontend

- React
- React Router
- Tailwind CSS
- React Query
- React Flow (for roadmap visualization)

## Project Structure

```
DACS-main/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── context/      # Context providers
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities and helpers
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── App.jsx       # Main application component
│   └── package.json
├── server/               # Express backend
│   ├── controllers/      # MVC controllers
│   ├── db/               # Database related files
│   │   ├── prisma.js     # Prisma client
│   │   └── schema.prisma # Prisma schema
│   ├── middlewares/      # Express middlewares
│   ├── models/           # MVC models
│   ├── routes/           # API routes
│   ├── .env              # Environment variables
│   └── server.js         # Main server file
├── components/           # Shared components
├── hooks/                # Shared hooks
├── lib/                  # Shared utilities
└── setup.js              # Project setup script
```

## Getting Started

1. Clone the repository:

   ```
   git clone <repository-url>
   cd DACS-main
   ```

2. Run the setup script:

   ```
   node setup.js
   ```

3. Update the `.env` file in the server directory with your database credentials

4. Run database migrations:

   ```
   cd server
   npx prisma migrate dev --schema=./db/schema.prisma
   ```

5. Start the server:

   ```
   cd server
   npm run dev
   ```

6. Start the client:

   ```
   cd client
   npm start
   ```

7. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Roadmaps

- `GET /api/roadmaps` - Get all roadmaps
- `GET /api/roadmaps/:id` - Get roadmap by ID
- `POST /api/roadmaps` - Create new roadmap
- `PUT /api/roadmaps/:id` - Update roadmap
- `DELETE /api/roadmaps/:id` - Delete roadmap

## License

MIT
