import axios from 'axios'
import {createContext, useState, useEffect} from 'react'

export const UserContext = createContext({})

export function UserContextProvider({children}){
  const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Function to fetch user session data
    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:3030/api/auth/logged_in', { withCredentials: true });
            if (response.data.loggedIn) {
                setUser(response.data.user); // Store user info from decoded JWT
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
            console.error("Error checking login status:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus(); // Check login state on page load
    }, []);

    return (
        <UserContext.Provider value={{user, setUser, isLoading, checkLoginStatus}}>
            {children}
        </UserContext.Provider>
    )
}