import React, { useState, useEffect, useRef } from 'react';
import '../styles/VoirAnnonce.css'; 
import { ReactComponent as StarIcon } from '../images/star.svg'; 
import { ReactComponent as LikeIcon } from '../images/like.svg'; 
import { ReactComponent as ShareIcon } from '../images/share.svg'; 
import { ReactComponent as EmailIcon } from '../images/email.svg'; 
import { ReactComponent as CheckIcon } from '../images/check.svg'; 
import { ReactComponent as MoreOptionsIcon } from '../images/more-options.svg'; 
import CreerMessagerie from './CreerMessagerie'; 

function VoirAnnonce({ annonce, user }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [showMoreOptions, setShowMoreOptions] = useState(false);
    const [showCreerMessagerie, setShowCreerMessagerie] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [favoriteMessage, setFavoriteMessage] = useState('');
    const [likeMessage, setLikeMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const moreOptionsRef = useRef(null);
    const shareMenuRef = useRef(null);
    const favoriteTimeoutRef = useRef(null);
    const likeTimeoutRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
                setShowMoreOptions(false);
            }
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShowShareMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        if (!isFavorite) {
            setFavoriteMessage('Ok :-) Publication enregistrée dans vos favoris');
            favoriteTimeoutRef.current = setTimeout(() => {
                setFavoriteMessage('');
            }, 3000);
        } else {
            setFavoriteMessage('Publication supprimée de vos favoris');
            favoriteTimeoutRef.current = setTimeout(() => {
                setFavoriteMessage('');
            }, 3000);
        }
    };

    const toggleLike = () => {
        setIsLiked(!isLiked);
        if (!isLiked) {
            setLikeCount(likeCount + 1);
            setLikeMessage('Ok :-) Vous aimez');
            likeTimeoutRef.current = setTimeout(() => {
                setLikeMessage('');
            }, 3000);
        } else {
            setLikeCount(likeCount - 1);
            setLikeMessage('Vous n\'aimez plus');
            likeTimeoutRef.current = setTimeout(() => {
                setLikeMessage('');
            }, 3000);
        }
    };

    const handleShareClick = () => {
        setShowShareMenu(!showShareMenu);
    };

    const handleEmailClick = () => {
        setShowCreerMessagerie(true);
    };

    const handleCloseCreerMessagerie = () => {
        setShowCreerMessagerie(false);
    };

    const handleCommentSubmit = () => {
        if (comment.trim() !== '') {
            setComments([...comments, { text: comment.trim(), id: Date.now() }]);
            setComment('');
        }
    };

    const handleDeleteComment = (id) => {
        setComments(comments.filter(comment => comment.id !== id));
        alert('Commentaire supprimé.');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="annonce-container">
            <div className="publish-button-container">
                <input
                    type="text"
                    placeholder="Rechercher par lieu ou catégorie"
                    className="search-bar"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button className="publish-button">Publier</button>
            </div>

            <div className="annonce">
                <div className="annonce-header">
                    <div className="user-info">
                        <img src={user.profileImage} alt="User Icon" className="user-icon" />
                        <div>
                            <div className="user-name">{user.name}</div>
                            <div className="annonce-details">Plus d'1 mois - Montréal, à 1.3 km.</div>
                        </div>
                    </div>
                    <div className="more-options-container" ref={moreOptionsRef}>
                        <MoreOptionsIcon className="more-options-icon" onClick={() => setShowMoreOptions(!showMoreOptions)} />
                        {showMoreOptions && (
                            <div className="more-options-menu">
                                <button className="more-options-item">Signaler</button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="annonce-category">
                    {annonce.category}
                </div>

                <div className="annonce-title" onClick={() => alert('Navigating to Annonce Detail Page')}>
                    {annonce.title}
                </div>

                <div className="annonce-description">
                    {annonce.description}
                </div>

                <div className="annonce-image" onClick={() => alert('Navigating to Annonce Detail Page')}>
                    <img src={annonce.image} alt={annonce.title} />
                </div>

                <div className="annonce-actions">
                    <div className="action-container" title="Favoris">
                        <StarIcon className={`action-icon star-icon ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite} />
                    </div>
                    <div className="action-container" title="Like">
                        <LikeIcon className={`action-icon like-icon ${isLiked ? 'active' : ''}`} onClick={toggleLike} />
                        {likeCount > 0 && <span className="like-count">{likeCount}</span>}
                    </div>
                    <div className="action-container" title="Partager">
                        <ShareIcon className="action-icon share-icon" onClick={handleShareClick} />
                    </div>
                    <div className="action-container" title="Contacter">
                        <EmailIcon className="action-icon email-icon" onClick={handleEmailClick} />
                    </div>

                    {/* Share Menu */}
                    {showShareMenu && (
                        <div className="share-menu" ref={shareMenuRef}>
                            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
                            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">Twitter</a>
                            <a href="https://plus.google.com/" target="_blank" rel="noopener noreferrer">Google +</a>
                        </div>
                    )}
                </div>

                {favoriteMessage && <div className="message">{favoriteMessage}</div>}
                {likeMessage && <div className="message">{likeMessage}</div>}

                <div className="annonce-comment">
                    <input
                        type="text"
                        placeholder="Laisser un commentaire"
                        className="comment-input"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <CheckIcon className="comment-submit-icon" onClick={handleCommentSubmit} />
                </div>

                {comments.length > 0 && (
                    <div className="comments-section">
                        {comments.map(comment => (
                            <div key={comment.id} className="comment">
                                {comment.text}
                                <button className="delete-comment-button" onClick={() => handleDeleteComment(comment.id)}>Supprimer</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showCreerMessagerie && <CreerMessagerie onClose={handleCloseCreerMessagerie} />}
        </div>
    );
}

export default VoirAnnonce;

