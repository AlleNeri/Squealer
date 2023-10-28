import {React, useState, useContext} from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from 'react-bootstrap/Button';
import './header.css';
import { LoginContext } from "../../pages/LoginContext";
import { Link, redirect } from 'react-router-dom';

export default function ButtonAppBar() {
  const { loggedIn, setLoggedIn } = useContext(LoginContext);
  const [redirect, setRedirect] = useState(false);
  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
    setRedirect(true);
  }
  return (
    
    <div className="header">
        {redirect && <redirect to='../../login' />}
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
          {loggedIn && <Link to='#' className="Link">
            <Button className='button'>NEW POST</Button>
            <Button className='button' onClick={handleLogout}>LOGOUT</Button>
          </Link>}
        </Toolbar>
    </div>
  );
}