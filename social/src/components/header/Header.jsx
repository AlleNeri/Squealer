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
          <Link to="/" className="Link">
            <Button >HOME</Button>
          </Link>
          <Typography className="Typography">
            SQUEALER
          </Typography>
          <Link to='../../register' className="Link">
            <Button>REGISTER</Button>
          </Link>
          <Link to='../../login' className="Link">
            <Button >LOGIN</Button>
          </Link>
        </Toolbar>
    </div>
  );
}