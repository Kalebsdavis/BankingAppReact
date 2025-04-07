import { Card } from "react-bootstrap";
import './App.css';
import Button from 'react-bootstrap/Button';
import signUp from './imgs/signUp.jpg'
import { useNavigate } from "react-router-dom";

const LandingPage = () =>{
    const navigate = useNavigate();
    const handleClick =() =>{
        navigate('/signup');
    }

    return(
        <div style={{display:'flex', flexDirection:'column', marginTop:'15vh' ,alignItems:'center',height: '100vh', width: '100vw'}}>
            <h1 style={{color:'rgb(59, 122, 91)', fontSize:'70px'}}>Fezcos Bank</h1>
            <div style={{height:'5px',  display:'flex', justifyContent:'center', alignItems:'center', width:'80vw', background: 'radial-gradient(ellipse at center, rgb(59, 122, 91) 60%, rgb(59, 122, 91) 100%)',borderRadius: '50px'}}/>
            <Card className="card">
                <Card.Img variant='top' src={signUp}/>
                <Card.Body>
                <Card.Title>Sign Up</Card.Title>
                <Card.Text>
                Sign Up for free today
                </Card.Text>
                <Button variant="primary" onClick={handleClick}>Sign Up</Button>
            </Card.Body>
            </Card>
        </div>
    )
}

export default LandingPage;