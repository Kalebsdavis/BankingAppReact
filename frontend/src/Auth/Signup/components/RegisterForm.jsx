import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/Signup.css';
import { Link } from 'react-router-dom';
import { MdAlternateEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import axios from 'axios';

const RegisterForm =()=>{
    return (
      <Form className='RegisterForm'>
        
        <Form.Group className='header'><h2>Sign Up</h2></Form.Group>

        <Form.Group className="input" controlId="formBasicFirstName">
        <MdAlternateEmail className='icon' size={20}/>
          <Form.Control type="input" placeholder="First Name" />
        </Form.Group>

        <Form.Group className="input" controlId="formBasicLastName">
        <MdAlternateEmail className='icon' size={20}/>
          <Form.Control type="input" placeholder="Last Name" />
        </Form.Group>

        <Form.Group className="input" controlId="formBasicEmail">
        <MdAlternateEmail className='icon' size={20}/>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
  
        <Form.Group className="password" controlId="formBasicPassword">
          <TbPasswordUser className='icon' size={20}/>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
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