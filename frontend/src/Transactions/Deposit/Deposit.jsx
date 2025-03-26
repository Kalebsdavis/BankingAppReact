import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import DepositView from "./views/DepositView";

const Deposit = () =>{
    return(
        <Container fluid>
            <Row className="g-0">
                <Col md={15} className="main-content">
                    <Routes>
                        <Route path="/" element={<DepositView/>}/>
                    </Routes>
                </Col>
            </Row>
        </Container>
    )
}

export default Deposit;