import { NavLink } from "react-router-dom"
import './App.css'
import { FaCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import AccountDetails from "./Profile/components/AccountDetails";


const NavBar = () =>{


    return (
        <div className="NavBar">
            <div className="Logo"></div>
            <div className="bankName">
                <h1 className="Bank-name-h1">Fezcos Bank</h1>
            </div>
            <div className='profile-icon'>
                <Link to='/accountdetails'><FaCircleUser size={40} color="white"/></Link>
            </div>
        </div>
    )
}

export default NavBar