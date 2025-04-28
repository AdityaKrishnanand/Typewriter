import { useState } from "react";
import AuthPage from "./pages/AuthPage";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <AuthPage />
    </div>
  );
}

export default App;
