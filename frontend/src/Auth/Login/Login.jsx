import LogInView from './views/Login';
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import './styles/Login.css';

const Login =() =>{


    return(
    <Container fluid>
        <Row className='g-0'>
            <Col md={15} className="main-content">
                <Routes>
                    <Route path='/' element={<LogInView/>}/>
                </Routes> 
            </Col>
        </Row>
    </Container>
    )
}

export default Login;