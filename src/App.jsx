import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import bloodDrop from "./assets/blood-drop.png";


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="#" onClick={(e) => e.preventDefault()}>
         <img src={bloodDrop} alt="Blood drop" />
        </a>

        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Vite + React</h1>

      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
      </div>
    </>
  );
}

export default App;
