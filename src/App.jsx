import { useState, useEffect } from "react"
import "./App.css"

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: "", email: "", nom: "", prenom: "", password: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [accessToken, setAccessToken] = useState("");
    const [currentTrack, setCurrentTrack] = useState(null);

    const CLIENT_ID = "your_client_id_here";
    const CLIENT_SECRET = "your_client_secret_here";

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

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
        document.documentElement.setAttribute("data-theme", !isDarkTheme ? "dark" : "light");
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", isDarkTheme ? "dark" : "light");
    }, [isDarkTheme]);

    useEffect(() => {
        const getToken = async () => {
            try {
                const response = await fetch("https://accounts.spotify.com/api/token", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}`
                    },
                    body: "grant_type=client_credentials"
                });

                const data = await response.json();
                if (response.ok) {
                    setAccessToken(data.access_token);
                }
            } catch (error) {
                console.error("Error getting Spotify token:", error);
            }
        };

        if (isLoggedIn) {
            getToken();
        }
    }, [isLoggedIn]);

    const searchMusic = async (query) => {
        if (!query.trim() || !accessToken) return;

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=20`,
                {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            );

            const data = await response.json();
            if (response.ok) {
                setSearchResults(data.tracks.items);
            } else {
                showNotification("Erreur lors de la recherche", "error");
            }
        } catch (error) {
            console.error("Search error:", error);
            showNotification("Erreur de connexion à Spotify", "error");
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        searchMusic(searchQuery);
    };

    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    const playPreview = (track) => {
        if (track.preview_url) {
            setCurrentTrack(track);
            const audio = new Audio(track.preview_url);
            audio.play();
        } else {
            showNotification("Aperçu non disponible pour cette chanson", "error");
        }
    };

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
                    }, 1500);
                } else {
                    setTimeout(() => {
                        setIsLogin(true);
                    }, 1500);
                }
                setFormData({ username: "", email: "", nom: "", prenom: "", password: "" });
            } else {
                showNotification(data.error, "error");
            }
        } catch (error) {
            console.error("Network error:", error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                showNotification("Serveur non disponible. Vérifiez que le serveur backend est démarré et que MySQL est configuré correctement.", "error");
            } else {
                showNotification("Erreur de connexion au serveur.", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserInfo(null);
        setSearchQuery("");
        setSearchResults([]);
        setCurrentTrack(null);
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
                
                <div className="music-section">
                    <div className="music-header">
                        <div className="user-welcome">
                            <h1>Découvrez la musique, {userInfo.prenom}!</h1>
                            <p>Recherchez et écoutez vos artistes favoris</p>
                        </div>
                        <button onClick={handleLogout} className="logout-button">
                            Se déconnecter
                        </button>
                    </div>

                    <div className="search-container">
                        <form onSubmit={handleSearchSubmit} className="search-form">
                            <div className="search-input-container">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher des chansons, artistes, albums..."
                                    className="search-input"
                                />
                                <button 
                                    type="submit" 
                                    className="search-button"
                                    disabled={isSearching || !searchQuery.trim()}
                                >
                                    {isSearching ? (
                                        <div className="loader-small"></div>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {searchResults.length > 0 && (
                        <div className="results-container">
                            <h2>Résultats de recherche ({searchResults.length})</h2>
                            <div className="tracks-grid">
                                {searchResults.map((track) => (
                                    <div key={track.id} className="track-card">
                                        <div className="track-image">
                                            <img 
                                                src={track.album.images[1]?.url || track.album.images[0]?.url} 
                                                alt={track.album.name}
                                            />
                                            <button 
                                                className="play-button"
                                                onClick={() => playPreview(track)}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <polygon points="5,3 19,12 5,21" fill="currentColor"/>
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="track-info">
                                            <h3 className="track-name">{track.name}</h3>
                                            <p className="track-artist">
                                                {track.artists.map(artist => artist.name).join(", ")}
                                            </p>
                                            <p className="track-album">{track.album.name}</p>
                                            <div className="track-details">
                                                <span className="track-duration">
                                                    {formatDuration(track.duration_ms)}
                                                </span>
                                                <span className="track-popularity">
                                                    ⭐ {track.popularity}/100
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchResults.length === 0 && searchQuery && !isSearching && (
                        <div className="no-results">
                            <h3>Aucun résultat trouvé</h3>
                            <p>Essayez avec d'autres mots-clés</p>
                        </div>
                    )}

                    {!searchQuery && (
                        <div className="welcome-music">
                            <h2>Commencez votre découverte musicale</h2>
                            <p>Utilisez la barre de recherche pour trouver vos chansons préférées</p>
                        </div>
                    )}
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
                        <p>{isLogin ? "Connectez-vous pour découvrir la musique" : "Créez votre compte pour accéder à la musique"}</p>
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
                                isLogin ? "Se connecter" : "S'inscrire"
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
                            {isLogin ? "S'inscrire" : "Se connecter"}
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