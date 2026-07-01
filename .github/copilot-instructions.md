# CompanyVoice - Full-Stack Employee Feedback Platform

## Project Overview

This is a complete full-stack web application built with:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript + MySQL + Sequelize
- **Authentication**: JWT with httpOnly cookies
- **Gamification**: XP rewards system with tier progression

## Key Features Implemented

✅ User authentication (register, login, logout)
✅ Post creation with anonymity controls
✅ Voting system with XP rewards
✅ Comments with optional anonymity
✅ Gamified XP system with tier progression
✅ Leaderboard (contributors and solvers)
✅ Admin dashboard with analytics
✅ Platform settings management
✅ CSV export of all posts
✅ Input validation with Zod
✅ Rate limiting on auth and voting
✅ Responsive UI design
✅ Database seeding with sample data

## Development Setup

### Quick Start
```bash
# 1. Configure environment
cp .env.example .env
# Edit .env with your MySQL credentials

# 2. Install dependencies
npm install
npm --prefix server install
npm --prefix client install

# 3. Create database
mysql -u root -p -e "CREATE DATABASE companyvoice;"

# 4. Seed database with sample data
npm --prefix server run seed

# 5. Start development servers
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

### Demo Credentials
- **Admin**: admin@companyvoice.com / AdminPassword123
- **Employee**: john@company.com / Pass123456

## Technology Decisions

### Database
- **MySQL with Sequelize ORM** chosen for:
  - ACID compliance
  - Strong consistency
  - Excellent TypeScript support
  - Easy relationship management
  - Migration capabilities

### Authentication
- **JWT with httpOnly Cookies**:
  - Access tokens: 15 minutes
  - Refresh tokens: 7 days
  - Secure flag enabled (production)
  - SameSite=Strict for CSRF protection

### XP System
- Server-side enforcement to prevent cheating
- Tier thresholds: 0, 100, 300, 700
- Multiple reward scenarios for engagement
- Automatic tier updates on XP changes

### Anonymity Logic
- Per-post toggle with platform-wide override
- Admin always sees true author regardless of setting
- Null user_id for globally anonymous posts
- "Anonymous" label in employee view

## API Architecture

All endpoints follow REST principles with:
- Consistent error handling
- Input validation before processing
- Role-based access control
- Rate limiting on sensitive operations
- Pagination for list endpoints

Key route groups:
- `/api/auth/*` - Authentication
- `/api/posts/*` - Post management
- `/api/leaderboard/*` - Rankings
- `/api/admin/*` - Admin functions

## Security Implementation

✅ Passwords hashed with bcrypt (12 rounds)
✅ Parameterized queries (Sequelize)
✅ CORS configured for frontend only
✅ Input validation (Zod schemas)
✅ Rate limiting (express-rate-limit)
✅ SQL injection prevention
✅ XSS prevention (React by default)
✅ CSRF protection (httpOnly cookies)

## Database Models

- **User**: Authentication, XP, tier tracking
- **Post**: Content, anonymity flag, vote counts
- **PostTag**: Tag associations
- **Vote**: User voting history
- **Comment**: Discussion threads
- **SolutionLink**: Challenge-solution relationships
- **Setting**: Platform configuration

## File Organization

```
server/
  ├── src/
  │   ├── index.ts          # Server entry point
  │   ├── config/           # DB & JWT config
  │   ├── models/           # Sequelize models
  │   ├── routes/           # API route definitions
  │   ├── controllers/      # Request handlers
  │   ├── middleware/       # Auth, rate limit, error handling
  │   ├── validators/       # Zod schemas
  │   └── services/         # Business logic (XP, admin)
  └── seeds/                # Database seeding

client/
  ├── src/
  │   ├── main.tsx          # React entry point
  │   ├── App.tsx           # Router setup
  │   ├── pages/            # Page components
  │   ├── components/       # Reusable components
  │   ├── services/         # API & auth services
  │   └── utils/            # Helper functions
  └── index.html            # HTML template
```

## Key Design Patterns

1. **Separation of Concerns**: Controllers, services, models
2. **Middleware Chain**: Auth → Validation → Handler → Error
3. **Composable Components**: PostCard, TierBadge, Avatar
4. **Context API**: Global auth state
5. **Custom Hooks**: useAuth for authentication

## Performance Considerations

- Sequelize query optimization with eager loading
- Database indexes on frequently queried columns
- Pagination (20 posts per page)
- Connection pooling (Sequelize pool settings)
- Frontend route code-splitting ready
- API response compression (gzip)

## Testing Recommendations

### Backend Unit Tests
- Controller logic with mock data
- Service functions (XP calculations)
- Validator schemas

### Integration Tests
- Full POST/GET flows
- Vote/comment transactions
- Admin operations

### Frontend Tests
- Component rendering
- Form validation
- Navigation flows

## Deployment Checklist

- [ ] Update JWT secrets in production
- [ ] Configure MySQL backups
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS only
- [ ] Configure CORS for production domain
- [ ] Set up database migrations
- [ ] Configure rate limiting per environment
- [ ] Set up error logging
- [ ] Configure database replication
- [ ] Test full backup/restore procedure

## Common Development Tasks

### Add new endpoint
1. Create route in `server/src/routes/`
2. Add controller in `server/src/controllers/`
3. Add validation in `server/src/validators/schemas.ts`
4. Add middleware if needed

### Add new page
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.tsx`
3. Add navigation in `client/src/components/Layout.tsx`

### Modify database schema
1. Update model in `server/src/models/index.ts`
2. Sequelize will auto-migrate (in development)
3. Write migration for production

## Documentation Files

- **README.md** - Full project documentation
- **QUICK_START.md** - Quick setup guide
- **DATABASE_SCHEMA.sql** - Database schema reference
- **.env.example** - Environment variables template

## Environment Variables

Required for local development:
```
DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
PORT, NODE_ENV
JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN
VITE_API_BASE_URL
```

## Known Limitations & Future Enhancements

### Current Limitations
- Single-server deployment (no load balancing)
- In-memory vote tracking (no distributed cache)
- Simple pagination (no cursor-based)

### Potential Enhancements
- Real-time notifications (WebSocket)
- Full-text search on posts
- Post categories/subcategories
- User reputation system
- Email notifications
- Social features (follow users)
- Advanced analytics dashboard
- Post scheduling
- Solution approval workflow
