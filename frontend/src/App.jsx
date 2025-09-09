import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import "./App.css"
import Whiteboard from "./pages/Whiteboard";
import MainPage from "./pages/MainPage";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/ws/room" element={<Whiteboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
