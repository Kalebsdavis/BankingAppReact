import { Form } from "react-bootstrap"
import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import '../styles/DepositForm.css'
import { MdOutlineAttachMoney } from "react-icons/md";
import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../../../context/userContext";
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL='http://localhost:3030/api';
axios.defaults.withCredentials = true;

const DepositForm = () =>{

    const navigate = useNavigate();
    const { user, setUser } = useContext(UserContext);
    const [amount, setAmount] = useState('');
    const [accountType, setAccountType] = useState('');
    const [memo, setMemo] = useState('');
    const [transactionType, setTransactionType] = useState('');

    const handleDeposit = async(e) =>{

        e.preventDefault();
        console.log(`made it in function`);
        console.log(`amount: ${amount}\n`);
        const username = user.username;
        if(transactionType ==='1'){
    try{
        const response = await axios.post('/transactions/deposit', {amount, username, accountType,memo});
        console.log('back from axios trip lets check the if statement');
        const data = response.data;
        if(data.error){
            console.log('there is an error')
            toast.error(data.error);
        }else{
            console.log('ther was not error');
            setAmount('')//reset form
              toast.success("Deposit succesful!");
              navigate('/bankAccountPage');//return to account page
        }
    }
    catch(error){
        throw error;
    }
}else{
        try{
            const response = await axios.post('/transactions/withdraw', {amount, username, accountType,memo});
            console.log('back from axios trip lets check the if statement');
            const data = response.data;
            if(data.error){
                console.log('there is an error')
                toast.error(data.error);
            }else{
                console.log('ther was not error');
                setAmount('')//reset form
                  toast.success("Withdraw succesful!");
                  navigate('/bankAccountPage');//return to account page
            }
        }
        catch(error){
            throw error;
        }
    }
    }
    return(
        <Container  className='DepositForm-cntner'>
            <Form className="DepositForm-form" onSubmit={handleDeposit}>
                <Form.Group className="Header">
                    <h2>Transaction Tool</h2>
                </Form.Group>

                <Form.Group className="inputs">
                    <MdOutlineAttachMoney size={50} color="black"/>
                    <Form.Control  
                    type="input" 
                    placeholder="0.00"
                    value={amount}
                    onChange={(e)=>setAmount(e.target.value)}
                    />
                <Form.Group className='inputs'>
                    <Form.Select
                        className="select-account-li"
                        aria-label="Account Type"
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        required
                        >
                        <option value="">Select Account</option> {/* Default empty option */}
                        <option value="1">Checkings</option>
                        <option value="2">Savings</option>
                    </Form.Select>

                    <Form.Group className='inputs'>
                    <Form.Select
                        className="select-transactionType-li"
                        aria-label="Transaction Type"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                        required
                        >
                        <option value="">Select Transaction</option> {/* Default empty option */}
                        <option value="1">Deposit</option>
                        <option value="2">Withdraw</option>
                    </Form.Select>
                
                </Form.Group>
                </Form.Group>
                </Form.Group>
                <Form.Group className="memo-container">
                <Form.Control
                    as="textarea"  // Use 'textarea' instead of 'input'
                    className="memo"
                    placeholder="memo"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                />
            </Form.Group>
                <Button type="submit" className="deposit-btn">Complete Transaction</Button>
            </Form>
        </Container>
    )
}

export default DepositForm;