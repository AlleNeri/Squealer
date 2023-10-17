import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './header.css';

export default function ButtonAppBar() {
  return (
    <div className="header">
        <Toolbar className="Toolbar">
          <div>
            <Link to="/" className="Link">
              <Button className='button'>HOME</Button>
            </Link>
          </div>
          <div>
            <Typography className="Typography">
              SQUEALER
            </Typography>
          </div>     
          <div className='regLog'>
            <Link to='../../register' className="Link">
              <Button className='button'>REGISTER</Button>
            </Link>
            <Link to='../../login' className="Link">
              <Button className='button'>LOGIN</Button>
            </Link>
          </div>
          
        </Toolbar>
    </div>
  );
}