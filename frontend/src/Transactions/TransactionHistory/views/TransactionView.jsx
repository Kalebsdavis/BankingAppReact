import { Container } from "react-bootstrap";
import TransactionTable from '../components/TransactionTable'
import '../styles/TransactionView.css'

const TransactionView = () => {
    return(
        <Container className="Transaction-Container">
            <TransactionTable/>
        </Container>
    )
}

export default TransactionView;