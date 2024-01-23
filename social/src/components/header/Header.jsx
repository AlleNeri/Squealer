import React, {useState, useContext, useEffect} from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from 'react-bootstrap/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './header.css';
import { LoginContext } from "../../context/LoginContext/LoginContext";
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function ButtonAppBar({setModalOpen}) {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn } = useContext(LoginContext);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');

    // Update the loggedIn state
    setLoggedIn(false);

    // Redirect to the login page
    navigate('/login');
  }

  const handleNewPostClick = () => {
    setModalOpen(true);
    setIsProfileClicked(false);
  };

  const handleProfileClick = () => {
    navigate(`/MyProfile/${localStorage.getItem('userId')}`);
    setIsProfileClicked(true);
  };

  useEffect(() => {
    if (location.pathname === '/Home') {
      setIsProfileClicked(false);
    }
  }, [location]);
  return (
    
    <div className="header">
        <Toolbar className="Toolbar">
          
          {!loggedIn && <div>
            <Link to="/Home" className="Link">
              <Button className='button'>HOME</Button>
            </Link>
          </div>
          }
          <div>
            <Typography className="Typography">
              SQUEALER
            </Typography>
          </div>
          {!loggedIn &&
          <div className='regLog'>
            <Link to='../../register' className="Link">
              <Button className='button'>REGISTER</Button>
            </Link>
            
            <Link to='../../login' className="Link">
              <Button className='button'>LOGIN</Button>
            </Link>
          </div>
          
          }
          {loggedIn && 
          <div className='newLog'>

          {isProfileClicked ? (
              <Link to="/Home" className='Link'>
                <Button className='button'>HOME PAGE</Button>
              </Link>
            ) : (
              <Button className='button' onClick={handleNewPostClick}>NEW SQUEAL</Button>
            )}
          
          <Link to="../../login" className='Link'>
            <Button className='button' onClick={handleLogout}>LOGOUT</Button>
          </Link>

          <Link to={`/MyProfile/${localStorage.getItem('userId')}`} className='Link'>
            <AccountCircleIcon onClick={handleProfileClick} />
          </Link>
            
          </div>}
          
        </Toolbar>
        
    </div>

  );
}