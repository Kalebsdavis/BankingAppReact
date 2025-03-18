import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from './LandingPage';
import LogIn from './Auth/Login/Login';
import NavBar from './NavBar';
import SignUp from './Auth/Signup/Signup';

function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route index path='/login' element={<LogIn/>}/>
        <Route path='/landingpage' element={<LandingPage/>}/>
        <Route path='/signup' element={<SignUp/>}/>
      </Routes>
    </Router>
  );
}

export default App;
