import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import './header.css'

export default function ButtonAppBar() {
  return (
    <div id="header">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SQUEALER
          </Typography>
          <Link to='../../login' class="link">
            <Button variant="light">LOGIN</Button>
          </Link>
        </Toolbar>
    </div>
  );
}