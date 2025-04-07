import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import AccountPage from './bankAccountPage';
import LogIn from './Auth/Login/Login';
import NavBar from './NavBar';
import SignUp from './Auth/Signup/Signup';
import Profile from './Profile/Profile';
import{UserContextProvider, UserContext} from './context/userContext';
import {Toaster} from 'react-hot-toast';
import ProtectedRoute from "./ProtectedRoutes";
import BankAccountPage from './bankAccountPage';
import Deposit from './Transactions/Deposit/Deposit';
import TransactionHistory from './Transactions/TransactionHistory/TransactionHistory';
import LandingPage from './LandingPage';

function App() {
  return (

    <UserContextProvider>
    <Router>
      <NavBar/>
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
      <Routes>
        <Route index path='/' element={<LandingPage/>}/>
        <Route index path='/login' element={<LogIn/>}/>
        <Route path='/signup' element={<SignUp/>}/>

        {/*protected routes */}
        <Route element={<ProtectedRoute/>}>
        <Route path='/bankAccountPage' element={<AccountPage/>}/>
        <Route path='/accountdetails' element={<Profile/>}/>
        <Route path='/deposit/*' element={<Deposit/>}/>
        <Route path='/transactionhistory/*' element={<TransactionHistory/>}/>
        </Route>
      </Routes>
    </Router>
    </UserContextProvider>
  );
}

export default App;
