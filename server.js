const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());

mongoose .connect("mongodb://127.0.0.1:27017/wordgame", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
const wordSchema = new mongoose.Schema({
  word: String,
  hint: String,
});
const Word = mongoose.model("Word", wordSchema);

app.get("/api/word", async (req, res) => {
  const words = await Word.find();
  if (words.length === 0) {
    return res.json({ word: "No words found in the database!", hint: "" });
  }
  const randomWord = words[Math.floor(Math.random() * words.length)];
  res.json(randomWord);
});
app.get("/api/words", async (req, res) => {
  const words = await Word.find();
  res.json(words);
});

app.post("/api/words", async (req, res) => {
  const { word, hint } = req.body;
  if (!word || !hint) {
    return res.status(400).json({ error: "Both word and hint are required" });
  }
  const newWord = new Word({ word, hint });
  await newWord.save();
  res.json({ message: "Word added successfully!" });
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
