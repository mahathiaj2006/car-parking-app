# Car Parking Slot Booking System

A full-stack web application for managing car parking slots and bookings.

## Features

✅ **User Authentication**
- Register & login with JWT tokens
- Role-based access (user/admin)
- Secure password hashing with bcrypt

✅ **Parking Slot Management**
- Browse available, booked, and maintenance slots
- Real-time slot status updates
- Organized by floor and slot number

✅ **Booking System**
- Book available slots with vehicle number
- Multiple bookings per user allowed
- Cancel bookings anytime
- Check-out and bill generation (₹50/hour)

✅ **Admin Dashboard**
- View all bookings and revenue statistics
- Manage slot status (available/booked/maintenance)
- Monitor system analytics

## Tech Stack

### Backend
- **Express.js** - REST API
- **SQLite3** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin support

### Frontend
- **React 19** - UI framework
- **React Router v7** - Navigation
- **Tailwind CSS** - Styling
- **Fetch API** - HTTP requests

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

#### 1. Backend Setup
```bash
cd server
npm install
```

#### 2. Frontend Setup
```bash
cd client
npm install
```

## Running the Application

### Start Backend (Terminal 1)
```bash
cd server
npm start
# Or with auto-reload:
npm install nodemon --save-dev
npx nodemon server.js
```

Server will run on **http://localhost:5000**

### Start Frontend (Terminal 2)
```bash
cd client
npm run dev
```

Frontend will run on **http://localhost:5173**

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Slots
- `GET /api/slots` - Get all slots
- `GET /api/slots/:id` - Get specific slot
- `PATCH /api/slots/:id` - Update slot (admin)
- `POST /api/slots` - Create slot (admin)

### Bookings
- `GET /api/bookings/my` - Get user's bookings
- `GET /api/bookings` - Get all bookings (admin)
- `GET /api/bookings/:id` - Get specific booking
- `POST /api/bookings` - Create booking
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
- JWT tokens valid for 1 hour. Can be adjusted in `server/routes/auth.js`
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
Ensure backend is running and check the API_BASE_URL in `client/src/api/index.js`

### Database Issues
```bash
# Reset database
rm server/database.db
# Restart server to regenerate schema
```

## License
MIT

## Support
For issues or questions, please create an issue in the repository.
