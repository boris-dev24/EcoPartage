import React from 'react';
import '../styles/VoirAnnonce.css';
// Sample ad data (replace with your actual data source)
const annonces = [
    {
        id: 1,
        username: 'Yasmine',
        date: 'Plus d\'1 mois',
        location: 'Montréal, à 1.3 km',
        title: 'Agrafeuse pour le bois',
        description: 'Bonjour, je cherche une agrafeuse de ce genre pour mon projet de jardin surélevé. J\'aimerais en emprunter une pour une journée. Quelqu\'un aurait ça en stock ? Merci',
        imageUrl: 'URL_de_l_image_de_l_agrafeuse.jpg', // Replace with actual image URL
    },
    // Add more ad objects here
];

function VoirAnnonce() {
    return (
        <div className="voir-annonce-container">
            <h1>Annonces disponibles</h1>
            <div className="annonces-list">
                {annonces.map((annonce) => (
                    <div className="annonce-card" key={annonce.id}>
                        <div className="annonce-header">
                            <div className="user-info">
                                <div className="user-avatar">
                                    <img src="URL_de_l_avatar_de_yasmine.jpg" alt="User Avatar" />
                                </div>
                                <div className="user-details">
                                    <span className="username">{annonce.username}</span>
                                    <span className="annonce-date">{annonce.date} - {annonce.location}</span>
                                </div>
                            </div>
                            <div className="annonce-actions">
                                {/* Add action icons/buttons here (e.g., report, etc.) */}
                                <button>Signaler</button>
                            </div>
                        </div>
                        <div className="annonce-content">
                            <h2>{annonce.title}</h2>
                            <p>{annonce.description}</p>
                            <img src={annonce.imageUrl} alt={annonce.title} className="annonce-image" />
                        </div>
                        <div className="annonce-footer">
                            {/* Add like, comment, share icons/buttons here */}
                            <span className="like-button">J'aime</span>
                            <span className="comment-button">Commenter</span>
                            <span className="share-button">Partager</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default VoirAnnonce;


