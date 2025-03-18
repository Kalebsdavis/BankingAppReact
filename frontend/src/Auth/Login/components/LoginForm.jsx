import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import '../styles/Login.css';
import { Link } from 'react-router-dom';
import { MdAlternateEmail } from "react-icons/md";
import { TbPasswordUser } from "react-icons/tb";
import axios from 'axios';

const LogInForm =()=>{
    return (
      <Form className='LoginForm'>
        <Form.Group className='header'><h2>Log In</h2></Form.Group>
        <Form.Group className="email" controlId="formBasicEmail">
        <MdAlternateEmail className='icon' size={20}/>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
  
        <Form.Group className="password" controlId="formBasicPassword">
          <TbPasswordUser className='icon' size={20}/>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
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