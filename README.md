# School Project - Authentication System with Music Discovery

A full-stack web application featuring user authentication and Spotify music discovery integration. Built with React, Node.js, Express, and MySQL.

## 🚀 Features

### Authentication System
- ✅ User registration with form validation
- ✅ Secure login system
- ✅ Password encryption with bcrypt
- ✅ JWT token-based authentication
- ✅ User session management

### Music Discovery (Spotify Integration)
- 🎵 Search for songs, artists, and albums
- 🎧 Preview track playback (30-second clips)
- 📊 Track popularity ratings
- ⏱️ Song duration display
- 🖼️ Album artwork display
- 🔍 Real-time search functionality

### UI/UX Features
- 🌙 Dark/Light theme toggle
- 📱 Responsive design
- 🔔 Toast notifications system
- ⚡ Loading states and animations
- 🎨 Modern, clean interface

## 🛠️ Tech Stack

### Frontend
- **React** 18+ with Hooks
- **CSS3** with custom properties
- **Vite** for build tooling
- **Spotify Web API** for music data

### Backend
- **Node.js** with Express
- **MySQL** database
- **bcrypt** for password hashing
- **CORS** for cross-origin requests
- **JSON** for data exchange

## 📁 Project Structure

```
School-Project-Auth-System/
├── src/
│   ├── App.jsx           # Main application component
│   ├── App.css           # Application styles
│   └── main.jsx          # React entry point
├── server/
│   ├── server.js         # Express server
│   ├── database.sql      # Database schema
│   └── package.json      # Server dependencies
├── public/
├── package.json          # Frontend dependencies
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- Spotify Developer Account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd School-Project-Auth-System
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE school_auth_system;
USE school_auth_system;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install express mysql2 bcrypt cors

# Update database connection in server.js
# Set your MySQL credentials

# Start the server
node server.js
```

### 4. Frontend Setup
```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Update Spotify credentials in App.jsx
# Replace CLIENT_ID and CLIENT_SECRET with your Spotify app credentials

# Start development server
npm run dev
```

### 5. Spotify API Setup
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Get your Client ID and Client Secret
4. Update the credentials in `App.jsx`:
```javascript
const CLIENT_ID = "your_actual_client_id";
const CLIENT_SECRET = "your_actual_client_secret";
```

## 🔧 Configuration

### Environment Variables (Recommended)
Create a `.env` file in the project root:
```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
VITE_API_URL=http://localhost:3002
```

### Database Configuration
Update the MySQL connection in `server/server.js`:
```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_mysql_username',
    password: 'your_mysql_password',
    database: 'school_auth_system'
});
```

## 🚀 Usage

### Authentication Flow
1. **Registration**: New users can create an account with username, email, first name, last name, and password
2. **Login**: Existing users can log in with username and password
3. **Dashboard**: After login, users access the music discovery interface

### Music Discovery
1. **Search**: Use the search bar to find songs, artists, or albums
2. **Preview**: Click the play button on any track to hear a 30-second preview
3. **Details**: View track information including duration, popularity, and album art

## 📡 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Request/Response Examples

#### Registration
```javascript
// POST /api/register
{
    "username": "johndoe",
    "email": "john@example.com",
    "nom": "Doe",
    "prenom": "John",
    "password": "securepassword123"
}

// Response
{
    "message": "Utilisateur créé avec succès",
    "user": { "id": 1, "username": "johndoe", ... }
}
```

#### Login
```javascript
// POST /api/login
{
    "username": "johndoe",
    "password": "securepassword123"
}

// Response
{
    "message": "Connexion réussie",
    "user": { "id": 1, "username": "johndoe", ... }
}
```

## 🎨 Styling & Themes

The application supports both dark and light themes with CSS custom properties:

```css
[data-theme="dark"] {
    --bg-primary: #1a1a1a;
    --text-primary: #ffffff;
    --accent: #1db954;
}

[data-theme="light"] {
    --bg-primary: #ffffff;
    --text-primary: #000000;
    --accent: #1db954;
}
```

## 🐛 Troubleshooting

### Common Issues

#### Server Connection Error
- **Problem**: "Serveur non disponible"
- **Solution**: Ensure the backend server is running on port 3002
```bash
cd server && node server.js
```

#### MySQL Connection Error
- **Problem**: Database connection failed
- **Solutions**:
  - Check MySQL service is running
  - Verify database credentials
  - Ensure database exists

#### Spotify API Error
- **Problem**: Music search not working
- **Solutions**:
  - Check Spotify credentials are correct
  - Ensure Client Credentials flow is enabled in Spotify app settings
  - Verify internet connection

#### CORS Issues
- **Problem**: Cross-origin request blocked
- **Solution**: Ensure CORS is properly configured in server.js

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- SQL injection prevention with parameterized queries
- Input validation on both client and server
- CORS configuration for secure cross-origin requests

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of a school assignment.

## 👥 Authors

- Student Name - *Initial work*

## 🙏 Acknowledgments

- Spotify Web API for music data
- React community for excellent documentation
- Express.js for the robust backend framework
- MySQL for reliable data storage

---

**Note**: This is a school project for learning purposes. For production use, additional security measures and optimizations should