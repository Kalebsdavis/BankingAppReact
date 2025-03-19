import ProfileView from './views/ProfileView';
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import './styles/AccountDetails.css';

const Profile =() =>{


    return(
    <Container fluid>
        <Row className='g-0'>
            <Col md={15} className="main-content">
                <Routes>
                    <Route path='/' element={<ProfileView/>}/>
                </Routes> 
            </Col>
        </Row>
    </Container>
    )
}

export default Profile;