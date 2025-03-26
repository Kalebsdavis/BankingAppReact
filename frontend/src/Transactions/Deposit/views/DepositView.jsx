import { Container } from "react-bootstrap";
import DepositForm from "../components/DepositForm";


const DepositView = () =>{
    return(
        <Container className='deposit-container' fluid>
            <DepositForm/>
        </Container>
    )
}

export default DepositView;