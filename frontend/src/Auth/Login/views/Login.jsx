import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import LogInForm from '../components/LoginForm';
import '../styles/Login.css';

const LogInView =()=>{

    return(
        <Container className='login-container' fluid>
            <LogInForm/>
        </Container>
    )

}
export default LogInView;