import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/Signup.css';
import { useNavigate,Link } from 'react-router-dom';
import { MdAlternateEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import axios from 'axios';
import { FaCircleUser } from "react-icons/fa6";
import {toast} from 'react-hot-toast';
import { useState } from 'react';


axios.defaults.baseURL='http://localhost:3030/api';
axios.defaults.withCredentials = true;

const RegisterForm =()=>{
  const navigate = useNavigate();
    //#region STATE VARIABLES
    const[data,setData] = useState({
        firstname: '',
        lastname: '',
        username:'',
        email: '',
        password:'',
        repassword:'',

    })
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async(e) =>{
      e.preventDefault()
      const {firstname,lastname, username, email,password,repassword} = data
      
      if(password !== repassword){
         toast.error("passwords dont match")
         return   
      }else{
          console.log('going to post now from Register.jsx');
          try{ 
              //send form to backend to be saved into db
           const{data} = await axios.post('/auth/register',
          {
              firstname,
              lastname,
              username,
              email,
              password 
              
          })
                  
          if(data.error){
              toast.error(data.error)
          }else{
              setData({})//reset form
              toast.success("Account created succesful. Welcome to Fezco Bank!")
              navigate('/login');//make user login 
          }
      } catch(error){
          console.log('error');
      }           
      }
  }
    return (
      <Form className='RegisterForm' onSubmit={handleSubmit}>
        
        <Form.Group className='header'><h2>Sign Up</h2></Form.Group>

        <Form.Group className="input" controlId="formBasicFirstName">
        <FaCircleUser className='icon'size={20}/>
          <Form.Control 
          type="input" 
          placeholder="First Name" 
          value={data.firstname}
          onChange={(e)=>setData({...data, firstname: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="input" controlId="formBasicLastName">
        <FaCircleUser className='icon'size={20}/>
          <Form.Control 
          type="input" 
          placeholder="Last Name" 
          value={data.lastname}
          onChange={(e)=>setData({...data, lastname: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="input" controlId="formBasicEmail">
        <MdAlternateEmail className='icon' size={20}/>
          <Form.Control 
          type="email" 
          placeholder="Enter email" 
          value={data.email}
          onChange={(e)=>setData({...data, email: e.target.value})}
          />
        </Form.Group>

        <Form.Group className="input" controlId="formBasicUsername">
        <FaCircleUser className='icon'size={20}/>
          <Form.Control 
          type="input" 
          placeholder="Enter username" 
          value={data.username}
          onChange={(e)=>setData({...data, username: e.target.value})}
          />
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

        <Form.Group className="password" controlId="formBasicREPassword">
          <TbPasswordUser className='icon' size={20}/>
          <Form.Control 
          type="password" 
          placeholder="Re-enter Password" 
          value={data.repassword}
          onChange={(e)=>setData({...data, repassword: e.target.value})}
          />
        </Form.Group>
        {errorMessage && <p className="errorMessage">{errorMessage}</p>}

        <Form.Group className="mb-3" controlId="formBasicHaveAccount">
          <p className='have-account-text'>Already Have Account? <Link to='/login' className='have-account'>Log In</Link></p>
        </Form.Group>
        <Button className='btn' type="submit">
          Sign Up
        </Button>
      </Form>
    );
  }
export default RegisterForm;