# CompanyVoice - Quick Start Guide

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ running locally
- MySQL user with CREATE DATABASE permissions

### Step 1: Navigate to Project
```bash
cd CompanyVoice
```

### Step 2: Configure Environment
```bash
# Copy example environment variables
cp .env.example .env

# Edit .env with your MySQL credentials (replace placeholders)
# On Windows: notepad .env
# On macOS/Linux: nano .env
```

Update these in `.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root              # Your MySQL username
DB_PASSWORD=password      # Your MySQL password
DB_NAME=companyvoice
```

### Step 3: Create Database
```bash
# In MySQL or via command line
mysql -u root -p -e "CREATE DATABASE companyvoice;"
```

### Step 4: Install Dependencies
```bash
npm install
npm --prefix server install
npm --prefix client install
```

### Step 5: Seed Database
```bash
npm --prefix server run seed
```

**This creates:**
- ✅ All database tables
- ✅ 2 admin users
- ✅ 8 employee users
- ✅ 10 sample posts
- ✅ Votes and comments

### Step 6: Start Development
```bash
npm run dev
```

You'll see:
```
Frontend running on: http://localhost:5173
Backend running on: http://localhost:5000
```

### Step 7: Login
Open http://localhost:5173 in your browser

**Demo Admin Account:**
- Email: `admin@companyvoice.com`
- Password: `AdminPassword123`

**Demo Employee Account:**
- Email: `john@company.com`
- Password: `Pass123456`

---

## 🎮 Try It Out

1. **Create a Post** - Click "New Post" to submit a challenge or solution
2. **Earn XP** - See XP rewards appear in your profile
3. **Vote** - Upvote posts to earn and give others XP
4. **Comment** - Post anonymously or with your name
5. **View Leaderboard** - Check rankings and tier progress
6. **Admin Dashboard** - Toggle anonymity and export data

---

## 📚 Key Features

### XP System
- Challenge: +50 XP
- Solution: +80 XP
- Challenge + Solution: +120 XP
- Upvote: +20 XP
- Resolved: +150 XP
- Comment: +30 XP

### Tiers
- 🌱 Newcomer: 0-99 XP
- ⭐ Contributor: 100-299 XP
- 🏆 Champion: 300-699 XP
- 💡 Innovator: 700+ XP

### Departments
Engineering, HR, Marketing, Operations, Finance, Sales

---

## 🛠️ Available Commands

```bash
# Development
npm run dev              # Start both servers
npm run server          # Backend only
npm run client          # Frontend only

# Building
npm run build           # Build for production

# Database
npm --prefix server run seed   # Reset and seed database
```

---

## 🌐 API Base URL

Frontend requests proxy through Vite to: `http://localhost:5000/api`

All API calls include credentials for cookie-based authentication.

---

## 📁 Project Structure

```
CompanyVoice/
├── client/              # React + Vite frontend
│   ├── src/pages/      # Login, Register, Feed, Submit, Leaderboard, Admin
│   ├── src/components/ # UI components
│   └── src/services/   # API + Auth services
├── server/              # Express + TypeScript backend
│   ├── src/models/     # Sequelize database models
│   ├── src/routes/     # API endpoints
│   ├── src/controllers/ # Business logic
│   └── src/seeds/      # Database seeding
├── README.md           # Full documentation
└── .env.example        # Environment variables template
```

---

## ⚠️ Troubleshooting

### "Cannot connect to database"
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1;"

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### "Port 5000 already in use"
```bash
# Change PORT in .env
PORT=5001

# Or kill the process on port 5000
# On Windows: netstat -ano | findstr :5000
# On macOS/Linux: lsof -i :5000
```

### "CORS error"
Ensure backend is running and accessible at `http://localhost:5000`

### "Import errors in client"
```bash
# Clear node_modules and reinstall
rm -rf client/node_modules
npm --prefix client install
```

---

## 📖 Documentation

See **README.md** for:
- Complete feature list
- Detailed API documentation
- Security features
- Development guidelines
- File naming conventions

---

## 🎯 Next Steps

1. Customize the seed data in `server/src/seeds/seedDb.ts`
2. Modify Tailwind config in `client/tailwind.config.js`
3. Update company name and branding
4. Configure production environment variables
5. Deploy to your infrastructure

---

**Happy coding! 🚀**
