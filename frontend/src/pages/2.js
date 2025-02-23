import React, { useState, useEffect } from 'react';
import '../styles/VoirEvenement.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCalendarAlt, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

function VoirEv() {
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('URL_API'); 
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des événements');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); 

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredEvents = events.filter((event) => {
    const searchStr = searchTerm.toLowerCase();
    return (
      event.title.toLowerCase().includes(searchStr) ||
      event.location.toLowerCase().includes(searchStr)
    );
  });

  if (loading) {
    return <div className="loading">Chargement des événements...</div>;
  }

  if (error) {
    return <div className="error">Erreur: {error}</div>;
  }

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <h1>Evenement</h1>
        <div className="header-actions">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="search"
              placeholder="Rechercher un événement"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button className="add-event-button">
            <FontAwesomeIcon icon={faPlus} />
            Ajouter un événement
          </button>
        </div>
      </div>

      <div className="filter-options">
        <label>
          <input type="radio" name="filter" value="tous" defaultChecked />
          Tous
        </label>
        <label>
          <input type="radio" name="filter" value="aujourdhui" />
          Aujourd'hui
        </label>
      </div>

      <div className="event-list">
        {filteredEvents.map((event) => (
          <div className="event-card" key={event.id}>
            <div className="event-date">
              <FontAwesomeIcon icon={faCalendarAlt} className="calendar-icon" />
              <span>{event.date}</span>
            </div>
            <h2 className="event-title">{event.title}</h2>
            <div className="event-location">{event.location}</div>
            <p className="event-description">{event.description}</p>
            <button className="event-details-button">
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VoirEv;

