import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Link, Outlet } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DropDown from './Dropdown.jsx';
import Button from 'react-bootstrap/Button';
import './header.css'

export default function ButtonAppBar() {
  return (
    <div id="header">
        <Toolbar>
          <DropDown />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SQUEALER
          </Typography>
          <Link to='../../login' class="link">
            <Button variant="light">LOGIN</Button>
          </Link>
        </Toolbar>
      <Outlet />
    </div>
  );
}