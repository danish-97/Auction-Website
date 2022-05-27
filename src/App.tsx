import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from './components/Login';
import Register from "./components/Register";
import Auctions from "./components/Auctions";
import Profile from "./components/Profile";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import AuctionDetails from "./components/AuctionDetails";


function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/" element={<Auctions />}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/userProfile" element={<Profile/>}/>
                        <Route path="/editProfile" element={<EditProfile/>} />
                        <Route path="/changePassword" element={<ChangePassword/>}/>
                        <Route path="/auctionDetails/:auctionId" element={<AuctionDetails/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    )
}

export default App;