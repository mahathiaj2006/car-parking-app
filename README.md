# 🅿️ ParkHub — Luxury Parking Management

> **Premium parking reservation platform with instant booking, real-time availability, and seamless billing**

A sophisticated full-stack SaaS application for smart parking management. Reserve your spot in seconds with an intuitive interface, real-time availability tracking, and intelligent billing automation.

---

## ✨ Features

### 🎯 For Users
- **Instant Booking** — Find and reserve parking slots in under 10 seconds
- **Real-Time Availability** — Live updates on available, booked, and maintenance slots
- **Smart Search** — Browse by floor, location, and availability status
- **Auto Billing** — ₹50/hour transparent pricing with automatic calculations
- **Booking History** — Track all past and current reservations
- **Multiple Bookings** — Reserve multiple slots simultaneously
- **Quick Cancel** — Cancel anytime with instant confirmation

### 🛡️ For Administrators
- **Live Dashboard** — Real-time analytics and revenue metrics
- **Slot Management** — Update slot status across multiple floors
- **Booking Oversight** — Monitor all system bookings and user activity
- **Revenue Analytics** — Track earnings and occupancy rates
- **Role-Based Access** — Secure admin portal with permission controls

### 🎨 Design Excellence
- **Dark & Light Themes** — Seamless theme switching with persistent preferences
- **Luxury Aesthetic** — Premium gold accents, elegant typography (Cormorant Garamond)
- **Smooth Animations** — 60fps scroll reveals, hover effects, and micro-interactions
- **Custom Cursor** — Adaptive cursor with lerp-based smooth tracking
- **Responsive Design** — Mobile-first approach, works on all devices

### 🔐 Security & Auth
- **JWT Authentication** — Secure token-based session management
- **bcrypt Password Hashing** — Military-grade password protection
- **CORS Enabled** — Safe cross-origin API requests
- **Role-Based Access Control** — User and admin permission tiers

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Express.js v5+ — Fast, lightweight REST API
- SQLite3 — Lightweight relational database
- JWT Authentication — Stateless session management
- bcrypt — Secure password hashing
- CORS Middleware — Safe cross-origin requests

**Frontend:**
- Vanilla JavaScript — No framework dependencies
- HTML5 & CSS3 — Semantic markup with modern styling
- Fetch API — Promise-based HTTP requests
- localStorage API — Client-side theme persistence
- IntersectionObserver — Performance-optimized scroll animations

**Styling:**
- Custom CSS Variables — Dynamic theming system
- CSS Grid & Flexbox — Modern responsive layouts
- Linear & Radial Gradients — Premium visual effects
- CSS Animations — Smooth transitions and micro-interactions

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v14.0 or higher
- **npm** v6.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/car-parking-app.git
cd car-parking-app

# Backend setup
cd server
npm install

# Frontend is pre-configured (static files in /public)
```

### Running the Application

#### Start Backend Server
```bash
cd server

# Option 1: Basic
npm start

# Option 2: With auto-reload (recommended for development)
npm install -D nodemon
npx nodemon server.js
```

Server runs on **http://localhost:5000**

#### Access the App
Open your browser and navigate to:
- **http://localhost:5000** — Landing page with features
- **http://localhost:5000/slots.html** — Parking slots (login required)
- **http://localhost:5000/admin.html** — Admin dashboard (admin only)

---

## 📱 Pages & Routes

| Route | Description | Auth Required |
|-------|-------------|--|
| `/` | Landing page with features | ❌ |
| `/login.html` | User sign-in | ❌ |
| `/register.html` | New user registration | ❌ |
| `/slots.html` | Browse & book parking slots | ✅ |
| `/bookings.html` | Your reservation history | ✅ |
| `/admin.html` | Admin dashboard & analytics | ✅ Admin |

---

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "user@example.com",
  "password": "secure123",
  "phone": "1234567890"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure123"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { "id": 1, "email": "user@example.com", "username": "johndoe", "role": "user" }
}
```

### Parking Slots Endpoints

#### Get All Slots
```http
GET /api/slots
Authorization: Bearer {token}
```

#### Get Specific Slot
```http
GET /api/slots/:id
Authorization: Bearer {token}
```

#### Update Slot Status (Admin)
```http
PATCH /api/slots/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "available" | "booked" | "maintenance"
}
```

### Booking Endpoints

#### Create Booking
```http
POST /api/bookings
Authorization: Bearer {token}
Content-Type: application/json

{
  "slot_id": 5,
  "vehicle_number": "TN01AB1234"
}
```

#### Get My Bookings
```http
GET /api/bookings/my
Authorization: Bearer {token}
```

#### Get All Bookings (Admin)
```http
GET /api/bookings
Authorization: Bearer {token}
```

#### Cancel Booking
```http
DELETE /api/bookings/:id
Authorization: Bearer {token}
```

---

## 👤 Demo Credentials

Quick access for testing:

**Regular User:**
- Email: `user@example.com`
- Password: `password123`

**Administrator:**
- Email: `admin@example.com`
- Password: `admin123`

---

## 🎨 Theme System

ParkHub includes a sophisticated dual-theme system:

### Dark Theme (Default)
- **Background:** Deep navy (#05050a)
- **Text:** Almost white (#f9f9fb)
- **Accent:** Warm gold (#d4a574)
- **Perfect for:** Evening usage, reduced eye strain

### Light Theme
- **Background:** Warm cream (#fef9f4)
- **Text:** Dark warm (#2b2520)
- **Accent:** Muted gold (#c9a84c)
- **Perfect for:** Daytime usage, high contrast

**Toggle Theme:** Click the moon/sun icon (🌙/☀️) in the top navigation

---

## 📊 Project Structure

```
car-parking-app/
├── server/
│   ├── server.js              # Express server entry point
│   ├── package.json           # Backend dependencies
│   ├── db.js                  # SQLite database setup
│   ├── database.db            # SQLite database file
│   ├── .env                   # Environment variables
│   ├── config/
│   │   └── constants.js       # App configuration
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   ├── slots.js           # Slots endpoints
│   │   └── bookings.js        # Bookings endpoints
│   ├── controllers/           # Empty (reserved for future use)
│   ├── models/                # Empty (reserved for future use)
│   └── seed/
│       └── seed.js            # Database seeding script
│
├── public/                    # Frontend (static files)
│   ├── index.html            # Landing page
│   ├── login.html            # Login page
│   ├── register.html         # Registration page
│   ├── slots.html            # Slot booking page
│   ├── bookings.html         # Bookings history
│   ├── admin.html            # Admin dashboard
│   ├── style.css             # Global styles + theme system
│   └── api.js                # Frontend API utilities
│
└── README.md                 # This file
```

---

## 🛠️ Configuration

Edit `server/config/constants.js` to customize:

```javascript
export const PORT = 5000;
export const RATE_PER_HOUR = 50;        // Parking rate in rupees
export const DB_PATH = './database.db';
export const JWT_SECRET = 'your-secret-key';
export const JWT_EXPIRY = '1h';
```

---

## 📈 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK(role IN ('user', 'admin')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Slots Table
```sql
CREATE TABLE slots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slot_number INTEGER NOT NULL,
  floor INTEGER NOT NULL,
  type TEXT DEFAULT 'car',
  status TEXT CHECK(status IN ('available', 'booked', 'maintenance')) DEFAULT 'available',
  UNIQUE(slot_number, floor)
);
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  slot_id INTEGER NOT NULL,
  vehicle_number TEXT NOT NULL,
  start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_time DATETIME,
  amount REAL,
  status TEXT CHECK(status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(slot_id) REFERENCES slots(id)
);
```

---

## 🚀 Performance Optimizations

- **Smooth Cursor Tracking** — 12% lerp factor prevents jittery movement
- **Scroll Reveal Animations** — IntersectionObserver for performance
- **CSS Variables** — Instant theme switching without repaints
- **Minimal Dependencies** — Vanilla JS + HTML/CSS only
- **Lazy Loading** — Images and components load on-demand
- **Responsive Images** — Optimized for all screen sizes

---

## 🔒 Security Best Practices

✅ **JWT Token Management**
- Tokens stored in memory (secure against XSS)
- Automatic token invalidation on logout
- 7-day expiry window by default

✅ **Password Security**
- bcrypt with 10 salt rounds
- Never stored in plaintext
- Secure password reset flow

✅ **API Security**
- CORS whitelist configured
- Request validation
- SQL injection prevention via parameterized queries

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9    # macOS/Linux
netstat -ano | findstr :5000     # Windows
```

### Database Errors
```bash
# Reset database
rm parking.db
cd server && node seed/seed.js
```

### Theme Not Persisting
- Clear browser localStorage: `localStorage.clear()`
- Hard refresh: `Cmd+Shift+R` (macOS) or `Ctrl+Shift+R` (Windows)

---

## 📝 License

MIT License — Feel free to use for personal or commercial projects.

---

## 👨‍💻 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support

For issues, questions, or feature requests, please open a GitHub issue or contact the development team.

---

**Built with ❤️ for the modern parking experience**
- `POST /api/bookings/checkout/:id` - Checkout and settle bill
- `POST /api/bookings/cancel/:id` - Cancel booking

## Demo Credentials

### Regular User
Create your own account or use:
- Email: `demo@example.com`
- Password: `demo123`

### Admin User
- Email: `admin@example.com`
- Password: `admin123`

## Project Structure

```
car-parking-app/
├── server/
│   ├── config/
│   │   └── constants.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   └── slots.js
│   ├── db.js
│   ├── server.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── api/
    │   │   └── index.js
    │   ├── contexts/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── MyBookings.jsx
    │   │   ├── Register.jsx
    │   │   └── Slots.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Database Schema

### Users Table
```sql
id, username, email, password, phone, role, created_at
```

### Slots Table
```sql
id, slot_number, floor, type, status
```

### Bookings Table
```sql
id, user_id, slot_id, vehicle_number, start_time, end_time, amount, status
```

## Configuration

### Parking Rate
Edit `server/config/constants.js` to change the hourly rate:
```javascript
RATE_PER_HOUR: 50 // ₹50 per hour
```

### JWT Secret
**⚠️ Production:** Move to `.env` file
```javascript
JWT_SECRET: process.env.JWT_SECRET || "secretkey"
```

## Usage Flow

### For Regular Users
1. Register or Login
2. Browse Available Slots
3. Click on any green slot to book
4. Enter vehicle number and confirm
5. View bookings in "My Bookings"
6. Checkout to settle bill (amount calculated per hour)
7. Cancel anytime

### For Admin
1. Login with admin credentials
2. View Dashboard with statistics
3. See all bookings in the table
4. Manage slot status (available/booked/maintenance)
5. Monitor total revenue from completed bookings

## Parking Rates
- ₹50 per hour
- Billed when user checks out
- Duration calculated from check-in to check-out time

## Known Limitations
- SQLite is suitable for development/small deployments. Use PostgreSQL for production.
- JWT tokens valid for 1 hour. Can be adjusted in `server/config/constants.js`
- No email verification implemented
- Admin creation is manual via database

## Future Enhancements
- Email notifications for bookings
- Payment gateway integration
- Monthly passes/subscriptions
- QR code for slot access
- Mobile app
- Real-time WebSocket updates
- Advanced analytics and reporting

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in server.js
const PORT = 5001;
```

### CORS Errors
Ensure backend is running and check the API_BASE_URL in `public/api.js`

### Database Issues
```bash
# Reset database
rm server/database.db
# Restart server to regenerate schema
```
