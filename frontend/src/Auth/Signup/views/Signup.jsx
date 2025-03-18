import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import RegisterForm from '../components/RegisterForm.jsx';
import '../styles/Signup.css';

const SignUpView =()=>{

    return(
        <Container className='register-container' fluid>
            <RegisterForm/>
        </Container>
    )

}
export default SignUpView;