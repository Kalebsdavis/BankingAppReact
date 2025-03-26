import './App.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { UserContext } from './context/userContext';
import { useContext } from 'react';

const BankAccountPage =() =>{
    const [containers, setContainers] = useState([]);
    const { user, setUser } = useContext(UserContext);
    useEffect(() => {
        // Fetch container data from backend
        axios.get(`http://localhost:3030/api/containers/${user.username}`)
          .then(response => {
            console.log("Response data:", JSON.stringify(response.data, null, 2));
            setContainers(response.data.accounts); // Update state with fetched data
          })
          .catch(error => {
            console.error("Error fetching containers:", error);
          });
      }, []);
    return(
        <div className="main-container">
        {containers.length === 0 ? (
          <div className="account-container">
            <h1>No accounts found</h1>
          </div>
        ) : (
          containers.map((container) => ( 
            <div className="account-container" key={container.id}>
              <div className="container-banner">
                {container.account_type_id ==1 ? (
                <h2 className="account-lbl">Checkings</h2>
                ) : ( 
                    <h2 className="account-lbl">Savings</h2>    
                )}
                <div className="balance">
                <h1 className="balance-txt">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(container.balance)}
                </h1>

                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
}
export default BankAccountPage;
