import React from 'react';
import '../styles/CreerMessagerie.css';

function CreerMessagerie({ onClose }) {
    return (
        <div className="creer-messagerie-overlay">
            <div className="creer-messagerie">
                <h2>Envoyer un message à Sabrina</h2>
                <div className="form-group">
                    <label htmlFor="sujet">Sujet:</label>
                    <input type="text" id="sujet" placeholder="Sujet du message" />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message:</label>
                    <textarea id="message" rows="5" placeholder="Votre message"></textarea>
                </div>
                <div className="button-group">
                    <button className="cancel-button" onClick={onClose}>Annuler</button>
                    <button className="send-button">Envoyer</button>
                </div>
            </div>
        </div>
    );
}

export default CreerMessagerie;

