// index.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Default route (homepage)
app.get("/", (req, res) => {
  res.json({ success: true, message: "API is working 🚀" });
});

// Example route: Cards API
app.get("/api/cards", (req, res) => {
  const cards = [
    { id: 1, name: "Ace of Spades" },
    { id: 2, name: "King of Hearts" },
    { id: 3, name: "Queen of Diamonds" },
    { id: 4, name: "Jack of Clubs" }
  ];
  res.json(cards);
});

// Example POST route
app.post("/api/cards", (req, res) => {
  const { id, name } = req.body;
  res.json({ success: true, card: { id, name } });
});

// Handle 404 - route not found
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
