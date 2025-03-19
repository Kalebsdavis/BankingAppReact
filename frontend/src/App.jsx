import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import LandingPage from './LandingPage';
import LogIn from './Auth/Login/Login';
import NavBar from './NavBar';
import SignUp from './Auth/Signup/Signup';
import Profile from './Profile/Profile';
import{UserContextProvider, UserContext} from './context/userContext';
import {Toaster} from 'react-hot-toast';

function App() {
  return (

    <UserContextProvider>
    <Router>
      <NavBar/>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route index path='/login' element={<LogIn/>}/>
        <Route path='/landingpage' element={<LandingPage/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='accountdetails' element={<Profile/>}/>
      </Routes>
    </Router>
    </UserContextProvider>
  );
}

export default App;
