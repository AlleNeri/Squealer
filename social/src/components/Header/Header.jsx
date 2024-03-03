import React, {useState, useContext, useEffect} from 'react';
import Toolbar from '@mui/material/Toolbar';
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
import logo from '../../../assets/logo.png';
import { format, isToday, isYesterday } from 'date-fns';
import './header.css';
import { LoginContext } from "../../context/LoginContext/LoginContext";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SidebarContext } from '../../context/SidebarContext/SidebarContext';
import { UserPostsContext } from '../../context/UserPostsContext/UserPostsContext';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { SearchContext } from '../../context/SearchContext/SearchContext';
import { Menu, MenuItem, IconButton, Typography, Popover, Avatar, Divider, Badge} from '@mui/material';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function ButtonAppBar() {
  const navigate = useNavigate();
  const { loggedIn, setLoggedIn, justRegistered, setJustRegistered } = useContext(LoginContext);
  const { setIsSearching } = useContext(SearchContext);
  const {isSidebarMinimized, setSidebarMinimized} = useContext(SidebarContext);
  const [searchValue, setSearchValue] = useState('');
  const { posts, setPosts } = useContext(PostsContext);
  const [channelPosts, setChannelPosts] = useState([]);
  const [notificationEl, setNotificationEl] = useState(null);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [myChannels, setMyChannels] = useState([]);
  const { userPosts, setUserPosts } = useContext(UserPostsContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isProfileClicked, setIsProfileClicked] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const [userImage, setUserImage] = useState('');
  const username = localStorage.getItem('username');
  let avatarContent = userImage ? <img src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${userImage}`} style={{width:'20px', height:'20px'}} alt="Profile" /> : username[0].toUpperCase();

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

  const handleNotificationClick = (event) => {
    if (totalNotifications > 0) {
      setNotificationEl(event.currentTarget);
    }
    setNotificationEl(event.currentTarget);
  };
  
  const handleNotificationClose = () => {
    setNotificationEl(null);
  };

  const open = Boolean(notificationEl);
  const id = open ? 'simple-popover' : undefined;

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

  useEffect(() => {
    if(loggedIn){
      const fetchMyChannels = async () => {
        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/my`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });
        const channels = await response.json();
  
        const filteredChannels = channels.filter(channel => channel.name.startsWith('__direct__'));
        setMyChannels(filteredChannels);
      };
  
      fetchMyChannels();
    }
  }, [loggedIn]);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = [];
      for (const channel of myChannels) {
        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${channel._id}/posts`);
        const data = await response.json();
        const filteredData = data.filter(post => post.posted_by !== userId);
        allPosts.push(...filteredData);
      }
      setChannelPosts(allPosts);
    };

    fetchPosts();
  }, [myChannels]);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      const allNotifications = [];
      for (const post of channelPosts) {
        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${post.posted_by}`);
        const user = await response.json();
        allNotifications.push({ ...post, img: user.img, u_name: user.u_name });
      }
      allNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
      setNotifications(allNotifications);
    };
  
    fetchNotifications();
  }, [channelPosts]);

  useEffect(() => {
    const fetchUserImage = async () => {
      const token = localStorage.getItem('token');

      const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${userId}`, {
        headers: {
          'Authorization': `${token}`,
        },
      });

      const user = await response.json();
      setUserImage(user.img);
    };
    fetchUserImage();
  }, [userId]);

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

  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.date);
    const key = isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'dd/MM/yyyy');
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(notification);
    return groups;
  }, {});

  useEffect(() => {
    const total = Object.values(groupedNotifications).reduce((total, notifications) => total + notifications.length, 0);
    setTotalNotifications(total);
  }, [groupedNotifications]);

  
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
            <div style={{ display: 'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link to='/HomePage' className="Link">
                  <Tooltip title="Homepage">
                    <HomeIcon style={{cursor:'pointer'}}/>
                  </Tooltip>
                </Link>
                <span style={{ fontSize: '0.8rem' }}>Home</span>
              </div>
            </div>
          }

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography className="Typography" fontWeight="fontWeightBold">
              SQUEALER
            </Typography>
          </div>

          {!loggedIn &&
            <div className='regLog'>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link to='/Register' className="Link">
                  <Tooltip title="Register">
                    <AppRegistrationIcon />
                  </Tooltip>
                </Link>
                <span style={{ fontSize: '0.8rem' }}>Register</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Link to='/Login' className="Link">
                  <Tooltip title="Login">
                    <LoginIcon />
                  </Tooltip>
                </Link>
                <span style={{ fontSize: '0.8rem' }}>Login</span>
              </div>
            </div>
          }

          {loggedIn && !matches &&
          <div className='newLog'>
            <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="Notifications" onClick={handleNotificationClick}>
                <NotificationsIcon style={{color: 'white', cursor:"pointer"}} />
              </Tooltip>
              <span style={{ fontSize: '0.8rem' }}>Notifications</span>
            </div>

              <Popover
                key={totalNotifications}
                id={id}
                open={open}
                anchorEl={notificationEl}
                onClose={handleNotificationClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                style={{ maxHeight: '300px', overflow: 'auto'}}
              >
                {totalNotifications > 0 ? (
                  <>
                  {
                  Object.entries(groupedNotifications).map(([date, notifications], index) => (
                    <div style={{margin:'10px'}} key={index}>
                      <Typography variant="body1" style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{date}</Typography>
                      {notifications.map((notification, index) => (
                        <Link to={`AllChannels/${notification.posted_on}`} style={{ textDecoration: 'none', color: 'inherit' }} key={index} onClick={handleNotificationClose}>
                          <div>
                            <Typography component="div" onMouseOver={(e) => e.target.style.color = 'blue'} onMouseOut={(e) => e.target.style.color = 'inherit'}>
                              {notification.img ? (
                                  <div>
                                    <img src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${notification.img}`} alt="Profile" style={{height:"20px", width:"20px", borderRadius: "50%"}} />
                                    <span style={{ marginLeft: '5px' }}>{notification.u_name} sent you a message!</span>
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <Avatar style={{height:"20px", width:"20px"}}>{notification.u_name.charAt(0)}</Avatar>
                                    <span style={{ marginLeft: '5px' }}>{notification.u_name} sent you a message!</span>
                                  </div>
                              )}
                            </Typography>
                            <Divider style={{ backgroundColor: 'black' }} /> 
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                  </>
                ) : (
                  <div style={{margin:'10px'}}><Typography>No notifications</Typography></div>
                )}
              </Popover>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="New squeal">
                <CreateIcon style={{ cursor:"pointer" }} onClick={handleNewPostClick} />
              </Tooltip>
              <span style={{ fontSize: '0.8rem' }}>New squeal</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="Logout">
                <LogoutIcon style={{ cursor:"pointer" }} onClick={handleLogout}/>
              </Tooltip>
              <span style={{ fontSize: '0.8rem' }}>Logout</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Tooltip title="Profile" onClick={handleMenuOpen}>
                <Avatar style={{ backgroundColor: 'white', color: 'black', width:'24px', height:'24px', marginTop:'2px', cursor:'pointer' }}>
                  {avatarContent}
                </Avatar>
              </Tooltip>
              <span style={{ fontSize: '0.8rem' }}>Profile</span>
            </div>

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
          </div>}
          
          {loggedIn && isSidebarMinimized && matches && 
            <div style={{display:'flex'}}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight:'10px'}}>
                <Tooltip title="Notifications" onClick={handleNotificationClick}>
                  <NotificationsIcon style={{color: 'white'}} />
                </Tooltip>
                <span style={{ fontSize: '0.8rem' }}>Notifications</span>
              </div>

              <Popover
                key={totalNotifications}
                id={id}
                open={open}
                anchorEl={notificationEl}
                onClose={handleNotificationClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                style={{ maxHeight: '300px', overflow: 'auto' }} // Aggiungi qui la proprietà border
              >
                {totalNotifications > 0 ? (
                  <>
                  {
                  Object.entries(groupedNotifications).map(([date, notifications], index) => (
                    <div key={index} style={{ margin:'10px' }}>
                      <Typography variant="body1" style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{date}</Typography>
                      {notifications.map((notification, index) => (
                        <Link to={`AllChannels/${notification.posted_on}`} style={{ textDecoration: 'none', color: 'inherit' }} key={index} onClick={handleNotificationClose}>
                          <div>
                            <Typography component="div" onMouseOver={(e) => e.target.style.color = 'blue'} onMouseOut={(e) => e.target.style.color = 'inherit'}>
                              {notification.img ? (
                                <div>
                                  <img src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${notification.img}`} alt="Profile" style={{height:"20px", width:"20px", borderRadius: "50%"}} />
                                  <span style={{ marginLeft: '5px' }}>{notification.u_name} sent you a message!</span>
                                </div>
                                ) : (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar style={{height:"20px", width:"20px"}}>{notification.u_name.charAt(0)}</Avatar>
                                  <span style={{ marginLeft: '5px' }}>{notification.u_name} sent you a message!</span>
                                </div>
                              )}
                            </Typography>
                            <Divider style={{ backgroundColor: 'black' }} /> 
                          </div>
                        </Link>
                      ))}
                    </div>
                  ))}
                  </>
                ) : (
                  <div style={{ margin:'10px' }}><Typography>No notifications</Typography></div>
                )}
              </Popover>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Tooltip title="Other" onClick={handleClick}>
                  <Avatar style={{ backgroundColor: 'white', color: 'black', width:'24px', height:'24px' }}>
                    {avatarContent}
                  </Avatar>
                </Tooltip>
                <span style={{ fontSize: '0.8rem' }}>Other</span>
              </div>
              
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