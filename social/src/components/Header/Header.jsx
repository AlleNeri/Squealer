import React, {useState, useContext, useEffect} from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from 'react-bootstrap/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import LoginIcon from '@mui/icons-material/Login';
import Tooltip from '@material-ui/core/Tooltip';
import CreateIcon from '@mui/icons-material/Create';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../../../assets/logo.png'
import './header.css';
import { LoginContext } from "../../context/LoginContext/LoginContext";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SidebarContext } from '../../context/SidebarContext/SidebarContext';

export default function ButtonAppBar({setModalOpen}) {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn } = useContext(LoginContext);
  const {isSidebarMinimized, setSidebarMinimized} = useContext(SidebarContext);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const location = useLocation();

  const headerStyle = {
    paddingLeft: isSidebarMinimized ? '80px' : '270px', // Adjust this value as needed
    height: isSidebarMinimized ? '66.5px' : '76px',
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
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
    navigate(`/Profile/${localStorage.getItem('userId')}`);
    setIsProfileClicked(true);
  };

  useEffect(() => {
    if (location.pathname === '/HomePage') {
      setIsProfileClicked(false);
    }
  }, [location]);
  return (
    
    <div className="header" style={headerStyle}>
        <Toolbar className="Toolbar">
          
          <div>
          <Link to='/HomePage' className="Link">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip title="Homepage">
                  <HomeIcon/>
                </Tooltip>
                <span style={{ fontSize: '0.8rem' }}>Home</span>
              </div>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />
            <Typography className="Typography" fontWeight="fontWeightBold">
              SQUEALER
            </Typography>
          </div>

          {!loggedIn &&
          <div className='regLog'>
            <Link to='/Register' className="Link">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip title="Register">
                  <AppRegistrationIcon />
                </Tooltip>
                <span style={{ fontSize: '0.8rem' }}>Register</span>
              </div>
            </Link>
            
            <Link to='/Login' className="Link">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip title="Login">
                  <LoginIcon />
                </Tooltip>
                <span style={{ fontSize: '0.8rem' }}>Login</span>
              </div>
            </Link>
          </div>
          
          }
          {loggedIn && 
          <div className='newLog'>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="New squeal">
                <CreateIcon style={{ cursor:"pointer" }} onClick={handleNewPostClick} />
              </Tooltip>
              <span style={{ fontSize: '0.8rem' }}>New squeal</span> {/* Adjust as needed */}
            </div>

            <Link to='/Login' className="Link">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip title="Logout">
                  <LogoutIcon onClick={handleLogout}/>
                </Tooltip>
                <span style={{ fontSize: '0.8rem' }}>Logout</span>
              </div>
            </Link>

            <Link to={`/Profile/${localStorage.getItem('userId')}`} className='Link'>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip title="Profile">
                  <AccountCircleIcon onClick={handleProfileClick} />
                </Tooltip>
                <span style={{ fontSize: '0.8rem' }}>Profile</span>
              </div>
            </Link>
            
          </div>}
          
        </Toolbar>
        
    </div>

  );
}