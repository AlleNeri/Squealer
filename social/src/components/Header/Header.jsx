import React, {useState, useContext, useEffect} from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LoginIcon from '@mui/icons-material/Login';
import Tooltip from '@material-ui/core/Tooltip';
import CreateIcon from '@mui/icons-material/Create';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchBar from "material-ui-search-bar";
import logo from '../../../assets/logo.png'
import './header.css';
import { LoginContext } from "../../context/LoginContext/LoginContext";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SidebarContext } from '../../context/SidebarContext/SidebarContext';
import { UserPostsContext } from '../../context/UserPostsContext/UserPostsContext';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { SearchContext } from '../../context/SearchContext/SearchContext';
import { Menu, MenuItem, IconButton, TextField} from '@mui/material';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function ButtonAppBar() {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn } = useContext(LoginContext);
  const { setIsSearching } = useContext(SearchContext);
  const {isSidebarMinimized, setSidebarMinimized} = useContext(SidebarContext);
  const [searchValue, setSearchValue] = useState('');
  const { posts, setPosts } = useContext(PostsContext);
  const { userPosts, setUserPosts } = useContext(UserPostsContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const location = useLocation();

  const headerStyle = {
    paddingLeft: isSidebarMinimized ? '0' : '200px',
  };

  const matches = useMediaQuery('(max-width:445px)');

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

    handleClose();
    // Redirect to the login page
    navigate('/login');
  }

  const handleNewPostClick = () => {
    navigate('/NewPost');
    handleClose();
    setIsProfileClicked(false);
  };

  const handleProfileClick = () => {
    navigate(`/Profile/${localStorage.getItem('userId')}`);
    handleClose();
    setIsProfileClicked(true);
  };

  const handleSettingsClick = () => {
    navigate(`/Settings/${localStorage.getItem('userId')}`);
    handleClose();
    setIsProfileClicked(false);
  };

  useEffect(() => {
    if (location.pathname === '/HomePage') {
      setIsProfileClicked(false);
    }
  }, [location]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Update searchValue whenever the input changes
  const handleInputChange = (newValue) => {
    setSearchValue(newValue);
  };

  const getChannelName = async (channelId) => {
    const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${channelId}`);
    const channel = await response.json();
    return channel.name;
  };

  const handleSearchChange = async () => {
    const trimmedQuery = searchValue.trim();
    setIsSearching(trimmedQuery !== '');

    if (trimmedQuery !== '') {
      let filteredPosts = [];

      // Combine posts and userPosts
      const allPostsMap = {};

      // Combine posts and userPosts and remove duplicates
      [...posts, ...userPosts].forEach(post => {
        allPostsMap[post._id] = post;
      });

      const allPosts = Object.values(allPostsMap);
      const lowerCaseQuery = trimmedQuery.toLowerCase();

      for (let post of allPosts) {
        const isPopular = post.popular && !post.unpopular && 'popular'.includes(lowerCaseQuery);
        const isUnpopular = !post.popular && post.unpopular && 'unpopular'.includes(lowerCaseQuery);
        const isControversial = post.popular && post.unpopular && 'controversial'.includes(lowerCaseQuery);

        if (isPopular || isUnpopular || isControversial) {
          filteredPosts.push(post);
        }
      }

      if (filteredPosts.length === 0) {
        for (let post of allPosts) {
          const channelName = await getChannelName(post.posted_on);

          if (post?.content.text?.toLowerCase().includes(lowerCaseQuery) || 
              post?.keywords?.some(kw => kw.toLowerCase().includes(lowerCaseQuery)) || 
              channelName.toLowerCase().includes(lowerCaseQuery)) {
            filteredPosts.push(post);
          }
        }
      }
      setPosts(filteredPosts);
      setUserPosts(filteredPosts);
    } else {
      setPosts(posts);
      setUserPosts(userPosts);
    }
  };

  useEffect(() => {
    handleSearchChange();
  }, [searchValue]);

  return (
    <div className="header" style={headerStyle}>
        <Toolbar className="Toolbar" style={{ flexDirection: 'column' }}>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          {isSidebarMinimized && 
            <div style={{ display: 'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip title="Channels">
                  <MenuIcon onClick={() => setSidebarMinimized(false)} style={{color: 'white', cursor:'pointer'}}/>
                </Tooltip>
                <span style={{ fontSize: '0.8rem' }}>Channels</span>
              </div>

              <div>
                <Link to='/HomePage' className="Link">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft:'10px' }}>
                    <Tooltip title="Homepage">
                      <HomeIcon/>
                    </Tooltip>
                    <span style={{ fontSize: '0.8rem' }}>Home</span>
                  </div>
                </Link>
              </div>
            </div>
          }

          {!isSidebarMinimized &&
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
          }

          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!matches && <img src={logo} alt="Logo" style={{ height: '50px', marginRight: '10px' }} />}
            <Typography className="Typography" fontWeight="fontWeightBold" style={{marginLeft:'10px'}}>
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

          {loggedIn && !matches &&
          <div className='newLog'>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="New squeal">
                <CreateIcon style={{ cursor:"pointer" }} onClick={handleNewPostClick} />
              </Tooltip>
              <span style={{ fontSize: '0.8rem' }}>New squeal</span>
            </div>

            <Link to='/Login' className="Link">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip title="Logout">
                  <LogoutIcon onClick={handleLogout}/>
                </Tooltip>
                <span style={{ fontSize: '0.8rem' }}>Logout</span>
              </div>
            </Link>

            <div>
              <IconButton style={{color: 'white'}}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Tooltip title="Profile">
                    <ManageAccountsIcon onClick={handleMenuOpen}/>
                  </Tooltip>
                  <span style={{ fontSize: '0.8rem' }}>Profile</span>
                </div>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleProfileClick}>
                  <AccountCircleIcon/>
                  My profile
                </MenuItem>
                <MenuItem onClick={handleSettingsClick}>
                  <ManageAccountsIcon />
                  Settings
                </MenuItem>
              </Menu>
            </div>
            
          </div>}
          
          {loggedIn && isSidebarMinimized && matches && 
            <div>
              <IconButton style={{color: 'white'}}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Tooltip title="Notifications">
                    <NotificationsIcon />
                  </Tooltip>
                  <span style={{ fontSize: '0.8rem' }}>Notifications</span>
                </div>
              </IconButton>

              <IconButton onClick={handleClick} style={{color: 'white'}}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Tooltip title="Other">
                    <AppsIcon />
                  </Tooltip>
                  <span style={{ fontSize: '0.8rem' }}>Other</span>
                </div>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleNewPostClick}>
                  <CreateIcon />
                  New Squeal
                </MenuItem>
                <MenuItem onClick={handleProfileClick}>
                  <AccountCircleIcon />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleSettingsClick}>
                  <ManageAccountsIcon/>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon />
                  Logout
                </MenuItem>
              </Menu>
            </div>
          }
        </div>
          <SearchBar
            value={searchValue}
            onChange={handleInputChange}
            style={{ width: '100%', height: '40px', marginTop: '10px', marginBottom: '10px' }}
          />
        </Toolbar>
        
    </div>

  );
}