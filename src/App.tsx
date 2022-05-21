import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './components/Login';
import Register from "./components/Register";
import Auctions from "./components/Auctions";


function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/auctions" element={<Auctions/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    )
}

export default App;