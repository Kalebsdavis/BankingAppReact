import { NavLink } from "react-router-dom"
import './App.css'
import { FaCircleUser } from "react-icons/fa6";
import { useNavigate, Link } from "react-router-dom";
import AccountDetails from "./Profile/components/AccountDetails";
import { useState, useEffect } from "react";
import axios from "axios";
import {toast} from 'react-hot-toast';
import { useContext } from "react";
import { UserContext } from './context/userContext';


const NavBar = () =>{
    const{user, setUser} = useContext(UserContext) // to use the user on any page insert this above the return
    const navigate = useNavigate();

    const logOut =async(e) =>{
        e.preventDefault();
        try {
          await axios.post('/auth/logout'); // Call the backend
          localStorage.removeItem('token'); // Remove JWT from storage
          setUser(null); // Reset user state
          //setIsAdmin(false);//reset isAdmin
          toast.success('logged out succesful');
          navigate('/login'); // Redirect to login page
      } catch (error) {
          console.error("Logout failed", error);
      }
      }
  

    return (
        <div className="NavBar">
            <div className="Logo"></div>
            <div className="bankName">
                <h1 className="Bank-name-h1">Fezcos Bank</h1>
            </div>
            <div className='profile-icon'>
                <Link to='/accountdetails'><FaCircleUser size={40} color="white"/></Link>
            </div>
            {user && (
            <div className="navbaractions">
            <div className="navlinks">
                <Link to={'/bankAccountPage'} className="navlink">Accounts</Link>
                <Link to={'/deposit'} className="navlink">Deposit</Link>
                <Link to={'/transactionhistory'} className="navlink">Transaction History</Link>
            </div>
            
            <div className="logout-container">
                <button onClick={logOut} className='logout-btn'  name='logout'>Log Out</button>
            </div>
            </div>
        )}

        </div>
    )
}

export default NavBar