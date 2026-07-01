# CompanyVoice - Gamified Employee Feedback Platform

CompanyVoice is a comprehensive gamified employee feedback platform designed to help organizations collect workplace challenges and solutions from their staff. With anonymity controls, XP-based gamification, and an admin dashboard, it creates an engaging environment for collaborative problem-solving.

## Features

- **Gamified Feedback**: Earn XP and climb tiers (Newcomer → Contributor → Champion → Innovator) by posting, voting, and commenting
- **Anonymous Posting**: Post challenges and solutions anonymously (with admin override capability)
- **XP Rewards System**:
  - Challenge post: +50 XP
  - Solution post: +80 XP
  - Challenge + Solution: +120 XP
  - Receive upvote: +20 XP
  - Marked as resolved: +150 XP
  - Comment: +30 XP
- **Leaderboards**: Top contributors by XP and top solvers by resolved solutions
- **Admin Dashboard**: Manage platform settings, view all posts, and export data as CSV
- **Solution Linking**: Link solutions to specific challenges for better tracking
- **Voting System**: Upvote and downvote posts with vote tracking
- **Comments**: Add comments (optionally anonymous) to engage in discussions

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MySQL** database
- **Sequelize** ORM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Zod** for schema validation
- **express-rate-limit** for rate limiting
- **json2csv** for CSV export

## Project Structure

```
CompanyVoice/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API and auth services
│   │   ├── utils/         # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                # Express backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Sequelize models
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── validators/    # Input validation
│   │   ├── services/      # Business logic
│   │   ├── config/        # Configuration files
│   │   └── index.ts       # Server entry point
│   ├── seeds/             # Database seeding
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── package.json           # Root package.json with dev scripts
└── .env.example
```

## Prerequisites

- Node.js 18+ and npm
- MySQL 8.0+

## Setup Instructions

### 1. Clone the Repository
```bash
cd CompanyVoice
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
npm --prefix server install

# Install frontend dependencies
npm --prefix client install
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env` in the root directory and update the values:

```bash
cp .env.example .env
```

Update `.env` with your MySQL credentials and secrets:

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=companyvoice
PORT=5000
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
```

### 4. Create MySQL Database

```sql
CREATE DATABASE companyvoice;
```

### 5. Seed Database with Sample Data

```bash
npm --prefix server run seed
```

This will:
- Create all tables
- Add 2 admin users
- Add 8 employee users with different departments
- Create 10 sample posts with votes, comments, and solution links
- Initialize platform settings

**Demo Admin Credentials:**
- Email: `admin@companyvoice.com`
- Password: `AdminPassword123`

### 6. Start Development Servers

```bash
npm run dev
```

This will start both the backend (port 5000) and frontend (port 5173) concurrently.

**Frontend**: http://localhost:5173
**Backend API**: http://localhost:5000/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Posts
- `GET /api/posts` - Get all posts (paginated, filterable)
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post with comments
- `PATCH /api/posts/:id/status` - Update post status (admin only)
- `DELETE /api/posts/:id` - Delete post (admin only)

### Votes
- `POST /api/posts/:id/vote` - Vote on post (up/down)

### Comments
- `GET /api/posts/:id/comments` - Get comments on post
- `POST /api/posts/:id/comments` - Add comment to post

### Leaderboard
- `GET /api/leaderboard/contributors` - Top contributors by XP
- `GET /api/leaderboard/solvers` - Top solvers by resolved count

### Admin
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/settings` - Get platform settings
- `PATCH /api/admin/settings` - Update platform settings
- `GET /api/admin/posts` - Get all posts (admin view)
- `GET /api/admin/export` - Export posts as CSV

## Frontend Pages

### `/login` and `/register`
User authentication pages with form validation

### `/feed`
Main feed displaying all posts with filtering options:
- Filter by type (Challenge, Solution, Both)
- Filter by department
- Pagination with 20 posts per page

### `/submit`
Create new post page with:
- Post type selection
- Title and description
- Department selection
- Tag input
- Anonymity toggle
- XP preview

### `/leaderboard`
View rankings with two tabs:
- Top contributors by XP
- Top solvers by resolved solution count

### `/admin`
Admin-only dashboard with:
- Platform statistics (total posts, challenges, solutions, active users)
- Platform settings (anonymity toggle)
- All posts table with author details
- CSV export functionality

## Security Features

- **Password Security**: Bcrypt hashing with 12 salt rounds
- **JWT Authentication**: Access tokens (15 min) + Refresh tokens (7 days)
- **HTTP-Only Cookies**: Secure token storage preventing XSS attacks
- **Rate Limiting**: 
  - Auth endpoints: 5 attempts per 15 minutes
  - Voting: 30 votes per minute per user
- **Input Validation**: Zod schema validation on all endpoints
- **CORS**: Configured for frontend origin only
- **Parameterized Queries**: Sequelize ORM prevents SQL injection

## Development

### Running Individual Services

```bash
# Backend only
npm run server

# Frontend only
npm run client
```

### Building for Production

```bash
npm run build
```

### Database Seeding

```bash
npm --prefix server run seed
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `PostCard.tsx`)
- **Pages**: PascalCase with "Page" suffix (e.g., `FeedPage.tsx`)
- **Services**: camelCase (e.g., `authService.ts`)
- **Utils**: camelCase (e.g., `tierUtils.ts`)

## Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Verify DB_HOST, DB_USER, DB_PASSWORD in `.env`
- Run `CREATE DATABASE companyvoice;`

### Port Already in Use
- Change PORT in `.env` for backend
- Backend will proxy frontend requests automatically

### CORS Errors
- Ensure frontend URL matches CORS origin in backend
- Check `VITE_API_BASE_URL` in frontend environment

### Authentication Issues
- Clear browser cookies and localStorage
- Restart the development servers
- Check JWT secrets in `.env`

## License

This project is part of the CompanyVoice initiative.
