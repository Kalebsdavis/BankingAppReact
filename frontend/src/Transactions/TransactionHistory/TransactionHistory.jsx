import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import TransactionView from "./views/TransactionView";

const TransactionHistory = () =>{
    return(
        <Container fluid>
            <Row className="g-0">
                <Col md={15} className="main-content">
                    <Routes>
                        <Route path="/" element={<TransactionView/>}/>
                    </Routes>
                </Col>
            </Row>
        </Container>
    )
}

export default TransactionHistory;