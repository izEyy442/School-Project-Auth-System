import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();
let PORT = 3002; 

const DB_CONFIG = {
    host: "localhost",
    user: "root",
    password: "your_password", // Change this to your MySQL root password
    port: 3306,
    authPlugins: {
        mysql_native_password: () => () => Buffer.alloc(0)
    }
};

const DB_NAME = "school_project_db";

app.use(cors());
app.use(express.json());

let db;

async function initializeDatabase() {
    try {
        const connection = await mysql.createConnection(DB_CONFIG);
        
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);
        console.log(`Database "${DB_NAME}" created or already exists`);
        
        await connection.end();
        
        db = await mysql.createConnection({
            ...DB_CONFIG,
            database: DB_NAME
        });
        
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                nom VARCHAR(100) NOT NULL,
                prenom VARCHAR(100) NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log("Users table created or already exists");
        console.log("Database initialized successfully!");
        
    } catch (error) {
        console.error("Database initialization error:", error);
        process.exit(1);
    }
}

app.post("/api/register", async (req, res) => {
    const { username, email, nom, prenom, password } = req.body;
    
    if (!username || !email || !nom || !prenom || !password) {
        return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.execute(
            "INSERT INTO users (username, email, nom, prenom, password) VALUES (?, ?, ?, ?, ?)",
            [username, email, nom, prenom, hashedPassword]
        );
        
        res.json({ message: "Compte créé avec succès" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Nom d\"utilisateur ou email déjà utilisé" });
        }
        console.error("Register error:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: "Nom d\"utilisateur et mot de passe requis" });
    }

    try {
        const [rows] = await db.execute(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );
        
        if (rows.length === 0) {
            return res.status(401).json({ error: "Nom d\"utilisateur ou mot de passe incorrect" });
        }

        const user = rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (isValidPassword) {
            res.json({ 
                message: "Connexion réussie", 
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    nom: user.nom,
                    prenom: user.prenom
                }
            });
        } else {
            res.status(401).json({ error: "Nom d\"utilisateur ou mot de passe incorrect" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

async function findAvailablePort(startPort) {
    return new Promise((resolve) => {
        const server = app.listen(startPort, () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        }).on("error", () => {
            findAvailablePort(startPort + 1).then(resolve);
        });
    });
}

async function startServer() {
    await initializeDatabase();
    
    PORT = await findAvailablePort(PORT);
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Backend API: http://localhost:${PORT}`);
        console.log(`MySQL database "${DB_NAME}" ready!`);
        console.log(`\nUpdate your frontend to use: http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);