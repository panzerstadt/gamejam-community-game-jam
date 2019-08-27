import React from "react";
import logo from "./logo.svg";
import "./App.css";

import Game from "./components/Game";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>the game is liar!</h1>
        <Game />
        <br />
      </header>
    </div>
  );
}

export default App;
