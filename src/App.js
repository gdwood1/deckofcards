import React, { useState, useEffect } from 'react';

const CardViewer = () => {
  const [deckId, setDeckId] = useState('');
  const [cards, setCards] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    async function fetchNewDeck() {
      try {
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/');
        const data = await response.json();
        setDeckId(data.deck_id);
        setRemaining(data.remaining);
      } catch (error) {
        console.error('Error fetching new deck:', error);
      }
    }

    fetchNewDeck();
  }, []);

  const drawCard = async () => {
    if (remaining === 0) {
      alert('Error: no cards remaining!');
      return;
    }

    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
      const data = await response.json();

      setCards([...cards, data.cards[0]]);
      setRemaining(data.remaining);
    } catch (error) {
      console.error('Error drawing card:', error);
    }
  };

  const shuffleDeck = async () => {
    if (isShuffling) {
      return;
    }

    setIsShuffling(true);
    setCards([]);
    try {
      const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
      const data = await response.json();

      setRemaining(data.remaining);
    } catch (error) {
      console.error('Error shuffling deck:', error);
    } finally {
      setIsShuffling(false);
    }
  };

  return (
    <div>
      <button onClick={drawCard} disabled={remaining === 0 || isShuffling}>
        Draw a Card
      </button>
      <button onClick={shuffleDeck} disabled={isShuffling}>
        Shuffle Deck
      </button>
      <div>
        {cards.map((card, index) => (
          <img key={index} src={card.image} alt={card.code} style={{position: 'absolute', top: '10%', left: '10%', transform: `rotate(${Math.ceil(Math.random() * 45) * (Math.round(Math.random()) ? 1 : -1)}deg)`}}/>
        ))}
      </div>
    </div>
  );
};

export default CardViewer;
