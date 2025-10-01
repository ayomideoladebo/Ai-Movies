# AI-Powered Movie Discovery App

A complete, deployable movie discovery web application with AI-powered recommendations, weather-based suggestions, and modern Web3-inspired UI.

## 🚀 Features

- **AI-Powered Recommendations**: Gemini Flash 2.5 integration for personalized movie suggestions
- **Weather-Based Suggestions**: Location-aware recommendations based on current weather
- **Modern UI**: Glassmorphism design with Tailwind CSS and responsive layouts
- **Authentication**: JWT-based auth with user accounts and watchlists
- **Admin Panel**: Complete admin dashboard for content management
- **Payment Integration**: Paystack integration for premium subscriptions
- **Video Streaming**: VidFast embed integration for movie/TV playback
- **Search & Discovery**: Advanced search with filters and trending content

## 🏗️ Architecture

```
Frontend (React + Vite) → Backend (Node + Express) → External APIs
    ↓                        ↓                        ↓
- React Router           - Prisma + SQLite        - TMDB API
- Tailwind CSS           - JWT Authentication     - WeatherAPI
- SWR for caching        - Paystack Integration   - Gemini API
- Glassmorphism UI       - Rate Limiting          - VidFast Embeds
```

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

Copy the server environment file and update with your API keys:

```bash
cd server
cp env.example .env
```

**Required Environment Variables:**

```env
# Database
DATABASE_URL="file:./dev.db"

# API Keys (Use the provided keys)
TMDB_KEY=f5707e33d829c09755f8b9ca50da00bd
WEATHERAPI_KEY=5fa3acc7f5ed4f8b98c111244241710
GEMINI_API_KEY=AIzaSyDkYapPWNIZuYdt6F-OlG2ov7Zrd9bIZe8

# Paystack (Replace with your keys)
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key_here
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key_here

# JWT Secret (Generate a secure random string)
JWT_SECRET=your_jwt_secret_key_here

# Admin User
ADMIN_EMAIL=admin@movieapp.com
ADMIN_PASSWORD=admin123

# Server
PORT=3001
NODE_ENV=development
```

### 3. Database Setup

```bash
cd server

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with admin user
npm run db:seed
```

### 4. Start Development Servers

**Option 1: Start both servers simultaneously**
```bash
# From project root
npm run dev
```

**Option 2: Start servers separately**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Admin Login**: Use the credentials from your `.env` file

## 🔑 API Keys Setup

### Where to paste the provided keys:

1. **TMDB_KEY**: Already set in `.env.example` - used for movie/TV metadata
2. **WEATHERAPI_KEY**: Already set in `.env.example` - used for weather-based recommendations  
3. **GEMINI_API_KEY**: Already set in `.env.example` - used for AI chat and recommendations

### Additional Keys You Need:

4. **Paystack Keys**: Replace the placeholder values in `.env`:
   - Get your keys from [Paystack Dashboard](https://dashboard.paystack.com/)
   - Replace `PAYSTACK_SECRET_KEY` and `PAYSTACK_PUBLIC_KEY`

5. **JWT_SECRET**: Generate a secure random string:
   ```bash
   # Generate a secure JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

## 🧪 Testing

Run the test suite:

```bash
cd server
npm test
```

## 📦 Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `cd frontend && npm run build`
2. Deploy the `dist` folder to Vercel or Netlify
3. Set environment variable `VITE_API_URL` to your backend URL

### Backend (Render/Heroku)
1. Set up a PostgreSQL database (production)
2. Update `DATABASE_URL` in production environment
3. Deploy to Render or Heroku
4. Run migrations: `npx prisma migrate deploy`

## 🔧 API Endpoints

### TMDB Proxy
- `GET /api/tmdb/search?q=...` - Search movies/TV
- `GET /api/tmdb/movie/:id` - Movie details
- `GET /api/tmdb/tv/:id` - TV show details
- `GET /api/tmdb/trending` - Trending content
- `GET /api/tmdb/discover` - Discover with filters

### Weather API
- `GET /api/weather?lat=...&lon=...` - Weather by coordinates
- `GET /api/weather/city?city=...` - Weather by city

### Gemini AI
- `POST /api/gemini/chat` - Chat with AI assistant
- `POST /api/gemini/recommendations` - Get AI recommendations

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Payments
- `POST /api/paystack/init` - Initialize payment
- `GET /api/paystack/verify/:reference` - Verify payment
- `POST /api/paystack/webhook` - Paystack webhook

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/content` - Content overrides
- `GET /api/admin/logs` - Admin activity logs

## 🎨 Design System

- **Colors**: Dark theme with glassmorphism effects
- **Fonts**: Inter (body) + Space Grotesk (headings)
- **Components**: Glass cards, buttons, and inputs
- **Animations**: Subtle hover effects and transitions
- **Responsive**: Mobile-first design

## 🔒 Security Features

- JWT authentication with HTTP-only cookies
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- Admin role-based access control

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- Mobile-optimized video player
- Geolocation for weather features

## 🤖 AI Integration

### Gemini Chat Assistant
- Context-aware responses
- Movie recommendation engine
- Weather-based suggestions
- Conservative token usage (Flash 2.5)

### Sample Gemini Prompt Template:
```javascript
// Used in /api/gemini/chat
const systemPrompt = `You are a helpful movie recommendation assistant. Keep responses concise (max 2-3 sentences). 
Current context: ${JSON.stringify(context)}`;
```

## 🎬 Video Integration

- **VidFast Embed URLs**:
  - Movies: `https://vidfast.pro/movie/{tmdb_id}?autoPlay=true`
  - TV: `https://vidfast.pro/tv/{tmdb_id}/{season}/{episode}?autoPlay=true`

## 🐛 Troubleshooting

### Common Issues:

1. **Database connection errors**: Ensure SQLite file permissions
2. **API rate limits**: Check TMDB/WeatherAPI usage
3. **CORS errors**: Verify frontend URL in server CORS config
4. **Authentication issues**: Check JWT secret configuration

### Logs:
- Server logs: Check console output
- Database: Use `npx prisma studio` for database inspection
- API errors: Check browser network tab

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the API documentation
- Check server logs for errors
- Verify environment variable configuration

---

**Ready to deploy!** 🚀 Your AI-powered movie discovery app is now fully scaffolded and ready for development and production deployment.
