import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import AccountDetails from '../components/AccountDetails.jsx';
import '../styles/AccountDetails.css';

const ProfileView=()=>{

    return(
        <Container className='profile-container' fluid>
            <AccountDetails/>
        </Container>
    )

}
export default ProfileView;