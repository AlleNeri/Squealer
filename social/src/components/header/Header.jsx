import React, {useState, useContext} from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from 'react-bootstrap/Button';
import NewPost from '../NewPost/NewPost';
import './header.css';
import { LoginContext } from "../../context/LoginContext/LoginContext";
import { Link, useNavigate } from 'react-router-dom';

export default function ButtonAppBar({setModalOpen}) {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn } = useContext(LoginContext);
  const [redirect, setRedirect] = useState(false);

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
    setRedirect(true);
    navigate('/login');
  }

  const handleNewPostClick = () => {
    setModalOpen(true);
  };

  return (
    
    <div className="header">
        <Toolbar className="Toolbar">
          
          {!loggedIn && <div>
            <Link to="/" className="Link">
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

            <Button className='button' onClick={handleNewPostClick}>NEW SQUEAL</Button>
          
            <Link to="../../login" className='Link'>
              <Button className='button' onClick={handleLogout}>LOGOUT</Button>
            </Link>
          </div>}
          
        </Toolbar>
        
    </div>

  );
}