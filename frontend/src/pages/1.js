import React, { useState } from 'react';
import '../styles/VoirEvenement.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faCalendarAlt, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

function VoirEv() {
  const [searchTerm, setSearchTerm] = useState('');

  
  const events = [
    {
      id: 1,
      date: '06-01-2021',
      title: 'Concours de sculpture de neige',
      location: 'Montréal',
      description: 'Partagez votre plaisir, vos merveilles et enchantement! :)',
    },
    {
      id: 2,
      date: '02-06-2018',
      title: '100 en 1 jour / 100 in 1 day - Montréal',
      location: 'Montréal Montréal',
      description:
        "C'EST QUOI 100 EN 1 JOUR? Imaginez des centaines de citoyens, à Montréal, au Canada et dans le monde, unis, chacun réalisant une action pour améliorer leur ville. Tout cela le même jour. C'est...",
    },
    {
      id: 3,
      date: '05-05-2018',
      title: 'Cultivons Rosemont-La Petite-Patrie: De la semence à la récolte!',
      location: '5679 Rue Fullum, 5679 Rue Fullum, H2G 2H6 Montréal',
      description:
        "La société de développement environnemental de Rosemont (SODER) vous invite le 5 mai prochain de 10h à 18h à sa Foire d'agriculture urbaine en collaboration avec Cultiver Montréal ! Un échange...",
    },
    {
      id: 4,
      date: '29-06-2017',
      title: 'Vente de Garage',
      location: 'Montréal Montréal',
      description: 'Une vente de garage demain soir jeudi 29 juin... un 5 @ 7 au Quai No 4 2800 rue Masson. Bienvenue à touts!',
    },
  ];

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

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <h1>Evenements</h1>
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

