import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './components/Login';
import Register from "./components/Register";
import Auctions from "./components/Auctions";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";


function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/auctions" element={<Auctions/>}/>
                        <Route path="/userProfile" element={<Profile/>}/>
                        <Route path="/editProfile" element={<EditProfile/>} />
                    </Routes>
                </div>
            </Router>
        </div>
    )
}

export default App;