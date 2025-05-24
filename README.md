# MyArea - Personalized Local Travel Guide

MyArea is a web application that allows locals to create personalized travel guides for their friends visiting their hometowns. Starting with the Bay Area, it provides an interactive map-based recommendation system for discovering local favorites.

## 🚀 Phase 1 Features

### ✅ Completed Features

- **User Authentication**: Register, login, and logout functionality
- **Interactive Map**: Visual representation of Bay Area locations with clickable markers
- **Location Management**: Create, view, edit, and delete location recommendations
- **Category Filtering**: Filter locations by type (restaurants, cafes, parks, etc.)
- **Responsive Design**: Mobile-first design that works on all devices
- **List/Map Toggle**: Switch between map and list views
- **Location Details**: Detailed information panel for selected locations

### 🛠 Tech Stack

**Frontend:**
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Query for data fetching
- React Hook Form with Zod validation

**Backend:**
- Go with Fiber framework
- PostgreSQL database
- GORM for database operations
- JWT authentication
- CORS middleware

## 📁 Project Structure

```
myarea/
├── frontend/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── layout/      # Layout components
│   │   │   ├── locations/   # Location-related components
│   │   │   ├── map/         # Map components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions and API client
│   │   └── types/           # TypeScript type definitions
│   └── package.json
├── backend/                 # Go backend API
│   ├── database/           # Database connection and migrations
│   ├── handlers/           # HTTP request handlers
│   ├── middleware/         # HTTP middleware
│   ├── models/             # Data models
│   ├── main.go             # Application entry point
│   └── go.mod
└── instructions/           # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Go 1.21+
- PostgreSQL database

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   go mod download
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/myarea
   JWT_SECRET=your-super-secure-jwt-secret-key-here
   PORT=8080
   ```

4. **Run the backend:**
   ```bash
   go run main.go
   ```

   The API will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Locations Table
```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  city VARCHAR(100) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  price_level INTEGER CHECK (price_level >= 1 AND price_level <= 4),
  tags TEXT[],
  image_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user profile
- `PUT /api/v1/auth/me` - Update user profile

### Locations
- `GET /api/v1/locations` - Get all locations (with optional city/category filters)
- `GET /api/v1/locations/:id` - Get specific location
- `POST /api/v1/locations` - Create new location (auth required)
- `PUT /api/v1/locations/:id` - Update location (owner only)
- `DELETE /api/v1/locations/:id` - Delete location (owner only)

### Users
- `GET /api/v1/users/:username/locations` - Get user's locations

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb) to Green (#16a34a) gradient
- **Background**: Warm light gray (#fafafa)
- **Text**: Dark gray (#333333)
- **Accent**: Primary colors for links and highlights

### Typography
- **Headings**: Inter (clean sans-serif)
- **Body**: Inter
- **UI Elements**: Inter

### Components
- **Buttons**: Rounded corners (8px), generous padding
- **Cards**: Soft shadows, 12px border radius
- **Form Inputs**: Clean borders, focus states with primary color

## 🗺 Location Categories

- Restaurant
- Cafe
- Bar
- Shopping
- Park
- Hike
- Museum
- Entertainment
- Beach
- Viewpoint
- Other

## 🔄 Development Workflow

1. **Start Backend**: `cd backend && go run main.go`
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Database**: Ensure PostgreSQL is running with the configured database
4. **Testing**: Visit `http://localhost:3000` to test the application

## 📝 Sample Data

The application includes sample Bay Area locations:
- Golden Gate Bridge (Viewpoint)
- Tartine Bakery (Cafe)
- Dolores Park (Park)
- Muir Woods (Hike)
- The Ferry Building (Shopping)

## 🚧 Known Limitations (Phase 1)

- Simple map implementation (will be enhanced with Mapbox in Phase 2)
- Basic authentication (password hashing implemented but simplified for MVP)
- Bay Area focus only (multi-city support in Phase 4)
- No image upload functionality yet (Phase 2)

## 🔮 Upcoming Features

### Phase 2: Enhanced UX
- Custom animated map markers with Mapbox
- Image upload functionality
- Improved form validation
- Enhanced mobile responsive design

### Phase 3: Social Features
- Public user profiles
- Guide creation and sharing
- Search and discovery features
- Performance optimizations

### Phase 4: Expansion
- Multi-city support
- Advanced sorting and filtering
- Analytics and insights
- SEO optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues, please open a GitHub issue or contact the development team.