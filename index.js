const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());

let cards = [
  { id: 1, suit: 'Hearts', value: 'Ace' },
  { id: 2, suit: 'Spades', value: 'King' },
  { id: 3, suit: 'Diamonds', value: 'Queen' },
  { id: 4, suit: 'Clubs', value: 'Jack' }
];

let nextId = 5;

app.get('/cards', (req, res) => {
  res.json({
    success: true,
    count: cards.length,
    data: cards
  });
});

app.post('/cards', (req, res) => {
  const { suit, value } = req.body;
  
  if (!suit || !value) {
    return res.status(400).json({
      success: false,
      error: 'Both suit and value are required'
    });
  }
  
  const validSuits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  if (!validSuits.includes(suit)) {
    return res.status(400).json({
      success: false,
      error: 'Suit must be one of: Hearts, Diamonds, Clubs, Spades'
    });
  }
  
  const validValues = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
  if (!validValues.includes(value)) {
    return res.status(400).json({
      success: false,
      error: 'Value must be one of: Ace, 2-10, Jack, Queen, King'
    });
  }
  
  const newCard = {
    id: nextId++,
    suit,
    value
  };
  
  cards.push(newCard);
  
  res.status(201).json({
    success: true,
    data: newCard
  });
});

app.get('/cards/:id', (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid card ID. ID must be a valid number'
    });
  }
  
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid card ID. ID must be a positive integer'
    });
  }
  
  const card = cards.find(c => c.id === id);
  
  if (!card) {
    return res.status(404).json({
      success: false,
      error: 'Card not found'
    });
  }
  
  res.json({
    success: true,
    data: card
  });
});

app.delete('/cards/:id', (req, res) => {
  if (!/^\d+$/.test(req.params.id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid card ID. ID must be a valid number'
    });
  }
  
  const id = Number(req.params.id);
  
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid card ID. ID must be a positive integer'
    });
  }
  
  const cardIndex = cards.findIndex(c => c.id === id);
  
  if (cardIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Card not found'
    });
  }
  
  const deletedCard = cards.splice(cardIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Card deleted successfully',
    data: deletedCard
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Playing Card Collection API is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON format'
    });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Playing Card Collection API is running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  GET    /cards       - List all cards`);
  console.log(`  POST   /cards       - Add a new card`);
  console.log(`  GET    /cards/:id   - Get a specific card`);
  console.log(`  DELETE /cards/:id   - Delete a card`);
  console.log(`  GET    /health      - Health check`);
});
