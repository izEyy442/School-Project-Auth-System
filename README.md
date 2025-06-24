# 🎓 School Project - Authentication System

[![React](https://img.shields.io/badge/React-19.1.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-purple.svg)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-orange.svg)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, secure authentication system built with **React** (Vite), **Node.js**, **Express**, and **MySQL/MariaDB**. Features include user registration, login, secure password hashing, and a responsive dashboard.

## ✨ Features

- 🔐 **Secure Authentication** - bcrypt password hashing
- 🎨 **Modern UI** - Responsive design with dark/light theme
- ⚡ **Fast Development** - Vite for lightning-fast HMR
- 🛡️ **Security First** - SQL injection protection, input validation
- 📱 **Mobile Friendly** - Fully responsive design
- 🔔 **Real-time Notifications** - Success/error feedback system
- 🌓 **Theme Toggle** - Dark and light mode support

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MySQL** or **MariaDB** ([MySQL](https://dev.mysql.com/downloads/) | [MariaDB](https://mariadb.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/school-project.git
   cd school-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Database setup**
   ```bash
   # Start your MySQL/MariaDB service
   # The application will automatically create the database and tables
   ```

4. **Configure database credentials**
   
   Edit `server.js` and update the database configuration:
   ```javascript
   const DB_CONFIG = {
       host: "localhost",
       user: "root",
       password: "your_password_here", // Change this to your MySQL password
       port: 3306
   };
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

🎉 **That's it!** Open http://localhost:5173 in your browser.

## 📁 Project Structure

```
school-project/
├── 📁 src/
│   ├── App.jsx          # Main React component
│   ├── App.css          # Component styles  
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── server.js            # Express backend server
├── package.json         # Dependencies & scripts
├── vite.config.js       # Vite configuration
├── .gitignore          # Git ignore rules
└── README.md           # Project documentation
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development (frontend + backend) |
| `npm run client` | Start only React frontend |
| `npm run server` | Start only Node.js backend |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔧 Configuration

### Database Configuration

Update the database settings in `server.js`:

```javascript
const DB_CONFIG = {
    host: "localhost",        // Your database host
    user: "root",            // Your database user
    password: "your_password", // Your database password
    port: 3306               // Your database port
};

const DB_NAME = "school_project_db"; // Database name (auto-created)
```

### API Configuration

The frontend is configured to use `http://localhost:3002` as the backend API URL. The backend server will automatically find an available port starting from 3002.

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | User registration |
| POST | `/api/login` | User authentication |

### Example Usage

**Registration:**
```javascript
POST /api/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "nom": "Doe",
  "prenom": "John",
  "password": "securePassword123"
}
```

**Login:**
```javascript
POST /api/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}
```

## 🗄️ Database Schema

The application automatically creates the required database and table:

```sql
CREATE DATABASE IF NOT EXISTS school_project_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ SQL injection protection (prepared statements)
- ✅ Input validation & sanitization
- ✅ CORS configuration
- ✅ Automatic port detection
- ✅ Secure session handling

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check if MySQL/MariaDB is running
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# Verify credentials
mysql -u root -p

# Update password in server.js
const DB_CONFIG = {
    // ...
    password: "your_correct_password"
};
```

**Port Already in Use**
```bash
# Kill process on port
npx kill-port 3002
npx kill-port 5173

# The server will automatically find an available port
```

**Dependencies Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 TODO

- [ ] JWT token implementation
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Admin dashboard
- [ ] User profile management
- [ ] Two-factor authentication
- [ ] API rate limiting
- [ ] Unit tests

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@iZeyy442](https://github.com/iZeyy442)

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the blazing fast development experience
- Express.js community
- MySQL team for the reliable database

---

⭐ **Star this repository if it helped you!**