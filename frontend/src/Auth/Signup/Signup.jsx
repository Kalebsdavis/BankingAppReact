import SignUpView from './views/Signup';
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import './styles/Signup.css';

const SignUp =() =>{


    return(
    <Container fluid>
        <Row className='g-0'>
            <Col md={15} className="main-content">
                <Routes>
                    <Route path='/' element={<SignUpView/>}/>
                </Routes> 
            </Col>
        </Row>
    </Container>
    )
}

export default SignUp;