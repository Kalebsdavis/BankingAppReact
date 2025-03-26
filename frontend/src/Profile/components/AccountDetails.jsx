import '../styles/AccountDetails.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
const AccountDetails =()=>{
    const { user, setUser } = useContext(UserContext);
    console.log(`user: ${user}`)
    if (!user) {
        return <p>Loading user data...</p>; // Handle undefined user
      }
    return(
        <div className='AccountDetails-container'>
        <div className='AccountDetails-Header'>
                        <h1 className='Header-txt'>Account Details</h1>
                    </div>
        <div className='detail-group'>
            
            <div className='details'>
                <p className='name'>{user?.firstname} {user?.lastname}</p>
                </div>
            <div className='details'>
                <p className='email'>{user?.email}</p>
                </div>
            <div className='password-ctn'>
                <div className='password'>
                <p className='password-txt'>********** </p>
                </div>
                <div className='changepassword-btn'>
                <Button className='changePassword'>Change Password?</Button>
                </div>

                </div>
            
        </div>
        </div>
    )
}

export default AccountDetails;