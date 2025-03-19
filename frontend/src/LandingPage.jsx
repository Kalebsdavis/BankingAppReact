import './App.css';
import axios from 'axios';

const LandingPage =() =>{
    return(
    <div className='main-container'>
        
        <div className='account-container'>
            <div className='container-banner'>
                <h2 className='account-lbl'>account name</h2>  
            <div className='balance'><h1 className='balance-txt'>$100</h1>
            </div>
            </div>
        </div>
        
    </div>
    )
}
export default LandingPage;