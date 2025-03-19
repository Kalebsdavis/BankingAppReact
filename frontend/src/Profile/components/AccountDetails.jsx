import '../styles/AccountDetails.css';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
const AccountDetails =()=>{

    return(
        <div className='AccountDetails-container'>
        <div className='AccountDetails-Header'>
                        <h1 className='Header-txt'>Account Details</h1>
                    </div>
        <div className='detail-group'>
            
            <div className='details'>
                <p className='name'>John Doe</p>
                </div>
            <div className='details'>
                <p className='email'>jdoe@gmail.com</p>
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