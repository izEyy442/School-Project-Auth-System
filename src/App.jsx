import { useState, useEffect } from "react"
import "./App.css"

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: "", email: "", nom: "", prenom: "", password: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const [popupData, setPopupData] = useState({ title: "", message: "", type: "" });
    const [notifications, setNotifications] = useState([]);

    const showNotification = (message, type = "error") => {
        const id = Date.now();
        const newNotification = { id, message, type };
        setNotifications(prev => [...prev, newNotification]);
        
        setTimeout(() => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupData({ title: "", message: "", type: "" });
    };

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
        document.documentElement.setAttribute("data-theme", !isDarkTheme ? "dark" : "light");
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
    }, [isDarkTheme]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const endpoint = isLogin ? "/api/login" : "/api/register";
        
        const submitData = isLogin 
            ? { username: formData.username, password: formData.password }
            : formData;
        
        try {
            const response = await fetch(`http://localhost:3002${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            const data = await response.json();

            if (response.ok) {
                showNotification(data.message, "success");
                if (isLogin) {
                    setTimeout(() => {
                        setIsLoggedIn(true);
                        setUserInfo(data.user);
                        closePopup();
                    }, 1500);
                } else {
                    setTimeout(() => {
                        setIsLogin(true);
                        closePopup();
                    }, 1500);
                }
                setFormData({ username: "", email: "", nom: "", prenom: "", password: "" });
            } else {
                showNotification(data.error, "error");
            }
        } catch (error) {
            console.error("Network error:", error);
            showNotification("Erreur de connexion au serveur. Vérifiez que le serveur est démarré.", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserInfo(null);
        showNotification("Déconnexion réussie", "success");
    };

    if (isLoggedIn && userInfo) {
        return (
            <div className="app">
                <div className="theme-toggle">
                    <button onClick={toggleTheme} className="theme-btn">
                        {isDarkTheme ? "🌙" : "☀️"}
                    </button>
                </div>
                
                <div className="dashboard-section">
                    <div className="dashboard-card">
                        <div className="dashboard-header">
                            <div className="welcome-section">
                                <h1>Bon retour parmi-nous, {userInfo.prenom} !</h1>
                                <p className="user-handle">@{userInfo.username}</p>
                                <p className="user-handle">{userInfo.email}</p>
                            </div>
                        </div>
                        
                        <div className="dashboard-content">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">📊</div>
                                    <div className="stat-info">
                                        <h3>Dashboard</h3>
                                        <p>Vue d"ensemble</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⚙️</div>
                                    <div className="stat-info">
                                        <h3>Paramètres</h3>
                                        <p>Configuration</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">👤</div>
                                    <div className="stat-info">
                                        <h3>Profil</h3>
                                        <p>Mes informations</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="dashboard-actions">
                            <button onClick={handleLogout} className="logout-button">
                                SE DÉCONNECTER
                            </button>
                        </div>
                    </div>
                </div>

                {notifications.length > 0 && (
                    <div className="notifications-container">
                        {notifications.map((notification) => (
                            <div key={notification.id} className={`notification ${notification.type}`}>
                                <div className="notification-content">
                                    <div className="notification-icon">
                                        {notification.type === "success" ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="notification-text">
                                        <div className="notification-title">
                                            {notification.type === "success" ? "Succès" : "Erreur"}
                                        </div>
                                        <div className="notification-message">{notification.message}</div>
                                    </div>
                                    <button 
                                        onClick={() => removeNotification(notification.id)}
                                        className="notification-close"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="notification-progress"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="app">
            <div className="theme-toggle">
                <button onClick={toggleTheme} className="theme-btn">
                    {isDarkTheme ? "🌙" : "☀️"}
                </button>
            </div>

            <div className="auth-section">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>{isLogin ? "Connexion" : "Inscription"}</h1>
                        <p>{isLogin ? "Connectez-vous à votre compte" : "Créez votre nouveau compte"}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <input
                                type="text"
                                name="username"
                                placeholder="Nom d'utilisateur"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            />
                        </div>

                        {!isLogin && (
                            <>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="nom"
                                        placeholder="Nom"
                                        value={formData.nom}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="prenom"
                                        placeholder="Prénom"
                                        value={formData.prenom}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </>
                        )}

                        <div className="form-group">
                            <input
                                type="password"
                                name="password"
                                placeholder="Mot de passe"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                minLength="6"
                                className="form-input"
                            />
                        </div>

                        <button type="submit" className={`submit-btn ${isLoading ? "loading" : ""}`} disabled={isLoading}>
                            {isLoading ? (
                                <div className="loader"></div>
                            ) : (
                                isLogin ? "Se connecter" : "S\"inscrire"
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>{isLogin ? "Pas encore de compte ?" : "Déjà inscrit ?"}</span>
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setFormData({ username: "", email: "", nom: "", prenom: "", password: "" });
                            }}
                            className="switch-btn"
                        >
                            {isLogin ? "S\"inscrire" : "Se connecter"}
                        </button>
                    </div>
                </div>
            </div>

            {notifications.length > 0 && (
                <div className="notifications-container">
                    {notifications.map((notification) => (
                        <div key={notification.id} className={`notification ${notification.type}`}>
                            <div className="notification-content">
                                <div className="notification-icon">
                                    {notification.type === "success" ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    )}
                                </div>
                                <div className="notification-text">
                                    <div className="notification-title">
                                        {notification.type === "success" ? "Succès" : "Erreur"}
                                    </div>
                                    <div className="notification-message">{notification.message}</div>
                                </div>
                                <button 
                                    onClick={() => removeNotification(notification.id)}
                                    className="notification-close"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="notification-progress"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App