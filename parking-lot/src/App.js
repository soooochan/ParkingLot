import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Parkinglot from "./pages/Parkinglot";
import Prediction from "./pages/Prediction"
import Nav from "./components/Nav";
  


function App() {
  return (
    <div className="App">
        <BrowserRouter>
        <Nav />
        <div className="main-content">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/parkinglot" element={<Parkinglot />} />
            <Route path="/prediction" element={<Prediction />} />
          
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
