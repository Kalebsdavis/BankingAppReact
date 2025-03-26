import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/Login.css';
import { useNavigate, Link } from 'react-router-dom';
import { MdAlternateEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import axios from 'axios';
import {toast} from 'react-hot-toast';
import { useState } from 'react';
import {useContext} from 'react';
import {UserContext} from  '../../../context/userContext';

axios.defaults.baseURL='http://localhost:3030/api';
axios.defaults.withCredentials = true;

const LogInForm =()=>{
  const navigate = useNavigate();
  const{user, setUser} = useContext(UserContext)
  console.log("UserContext:", { user, setUser }); // Debugging
  const[data,setData] = useState({
    email: '',
    password:'',
})
const [errorMessage, setErrorMessage] = useState("");

//#region handle form submission
const loginUser  = async(e) => {
  e.preventDefault();
  const {username,password} = data
  try{
      const{data} = await axios.post('/auth/login',{
          username,
          password
      });
      if(data.error){
          toast.error(data.error);
      }else{
          setUser(data);//set user info 
          toast.success("Login successful!");
          setData({ username: '', password: '' })//reset form
          navigate('/bankAccountPage')//navigate to landing page
      }
  }
  catch(error){
      console.log(error);
  }
}
    return (
      <Form className='LoginForm' onSubmit={loginUser}>
        <Form.Group className='header'><h2>Log In</h2></Form.Group>
        <Form.Group className="Username" controlId="formBasicUsername">
        <MdAlternateEmail className='icon' size={20}/>
          <Form.Control 
          type="text" 
          placeholder="Enter Username" 
          value={data.username}
          onChange={(e)=>setData({...data, username: e.target.value})}/>
        </Form.Group>
  
        <Form.Group className="password" controlId="formBasicPassword">
          <TbPasswordUser className='icon' size={20}/>
          <Form.Control 
          type="password" 
          placeholder="Password" 
          value={data.password}
          onChange={(e)=>setData({...data, password: e.target.value})}
          />
        </Form.Group>
        {errorMessage && <p className="errorMessage">{errorMessage}</p>}
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <p className='no-account-text'>No Account? <Link to='/Signup' className='no-account'>Sign Up</Link></p>
        </Form.Group>
        <Button className='btn' type="submit">
          Submit
        </Button>
      </Form>
    );
  }
export default LogInForm;