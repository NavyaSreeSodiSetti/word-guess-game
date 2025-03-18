import React, { useState, useEffect } from "react";
import "./index.css";
const App = () => {
  const [word, setWord] = useState(null);
  const [guessed, setGuessed] = useState([]);
  const [tries, setTries] = useState(6);
  const [message, setMessage] = useState("");
  const [hints, setHints] = useState(3);

  useEffect(() => {
    fetch("http://localhost:5000/api/word")  
      .then((res) => res.json())
      .then((data) => setWord(data || { word: "", hint: "" }))
      .catch((err) => console.error("Error fetching word:", err));
  }, []);

  useEffect(() => {
    if (word && tries === 0) {
      setMessage(`Game Over! The word was: ${word.word}`);
    } else if (word && word.word.split("").every((letter) => guessed.includes(letter))) {
      setMessage("You won! Great job!");
    }
  }, [tries, guessed, word]);

  const clickLetter = (letter) => {
    if (!guessed.includes(letter) && word) {
      setGuessed([...guessed, letter]);
      if (!word.word.includes(letter)) {
        setTries(tries - 1);
      }
    }
  };

  const useHint = () => {
    if (hints > 0 && word) {
      const notGuessed = word.word.split("").filter((letter) => !guessed.includes(letter));
      if (notGuessed.length > 0) {
        const hint = notGuessed[Math.floor(Math.random() * notGuessed.length)];
        setGuessed([...guessed, hint]);
        setHints(hints - 1);
      }
    } else {
      alert("No more hints left!");
    }
  };

  const restart = () => {
    fetch("http://localhost:5000/api/word")  
      .then((res) => res.json())
      .then((data) => {
        setWord(data || { word: "", hint: "" });
        setGuessed([]);
        setTries(6);
        setMessage("");
        setHints(3);
      })
      .catch((err) => console.error("Error fetching new word:", err));
  };

  return (
    <div className="container">
      <h1>Word Game</h1>
      {word && word.word ? (
        <>
          <div className="word-display">
            {word.word.split("").map((letter, i) => (
              <span key={i} className="letter">
                {guessed.includes(letter) ? letter : "_"}
              </span>
            ))}
          </div>
          <p>{word.hint}</p>
          <p>Tries left: {tries}</p>
          <p>Hints left: {hints}</p>
          {message && <p>{message}</p>}
          <div className="buttons">
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
              <button
                key={letter}
                onClick={() => clickLetter(letter)}
                disabled={guessed.includes(letter)} >
                {letter}
              </button>
            ))}
          </div>
          <button onClick={useHint}>Use Hint</button>
          <button onClick={restart}>New Game</button>
        </>
      ) : (
        <p>Loading word...</p>
      )}
    </div>
  );
};

export default App;

