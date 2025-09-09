import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import "./App.css"
import Whiteboard from "./pages/Whiteboard";
import MainPage from "./pages/MainPage";
import { AuthProvider } from "./components/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage/>}/>
        <Route path="/ws/room" element={<Whiteboard/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
