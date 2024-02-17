import React, {useState, useEffect, useContext} from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton, Tooltip, Typography, Collapse, Divider, makeStyles } from '@material-ui/core';
import { NavLink, useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChevronRightIcon from '@material-ui/icons/ChevronLeft';
import MenuIcon from '@material-ui/icons/Menu';
import Channel from '../Channel/Channel';
import { SidebarContext } from '../../context/SidebarContext/SidebarContext';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import './sidebar.css';

const Sidebar = () => {
  const [allChannels, setAllChannels] = useState([]);
  const [myChannels, setMyChannels] = useState([]);
  const [isChannelModalOpen, setChannelModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isChannelsExpanded, setChannelsExpanded] = useState(false);
  const [isDirectMessagesExpanded, setDirectMessagesExpanded] = useState(false);
  const [isExplore, setExplore] = useState(false);
  const [isTrending, setTrending] = useState(false);
  const { loggedIn } = useContext(LoginContext);
  const location = useLocation();
  const token = localStorage.getItem('token');
  const { isSidebarMinimized, setSidebarMinimized } = useContext(SidebarContext);

  const useStyles = makeStyles({
    paper: {
      background: '#333',
    },
    channel: {
      '&:hover': {
        backgroundColor: '#444',
      },
    },
    link: {
      textDecoration: 'none',
      color: 'inherit',
      marginLeft: '20px', 
    },
  });

  const classes = useStyles();

  const minimizeSidebar = () => {
    setSidebarMinimized(!isSidebarMinimized);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 445) { 
        setSidebarMinimized(true);
      } else {
        setSidebarMinimized(false);
      }
  };

    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Call the handler right away so the state gets updated with the initial window size
    handleResize();

    // Remove the event listener when the component is unmounted
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarMinimized]);

  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId);
    setSidebarMinimized(true);
    localStorage.setItem('selectedChannel', channelId); // Store the selected channel ID in local storage
  };
  
  const toggleChannels = () => {
    setChannelsExpanded(!isChannelsExpanded);
  };

  const toggleExplore = () => {
    setExplore(!isExplore);
  };

  const toggleTrending = () => {
    setTrending(!isTrending);
  };

  const toggleDirectMessages = () => {
    setDirectMessagesExpanded(!isDirectMessagesExpanded);
  };

  useEffect(() => {
    // Get the selected channel ID from local storage when the component mounts
    const storedSelectedChannel = localStorage.getItem('selectedChannel');
    if (storedSelectedChannel) {
      setSelectedChannel(storedSelectedChannel);
    }
  }, []);

  
useEffect(() => {
  // Deselect the channel when the page changes, unless it's the selected channel
  if (location.pathname !== `/AllChannels/${selectedChannel}`) {
    setSelectedChannel(null);
    localStorage.removeItem('selectedChannel'); // Remove the selected channel ID from local storage
  }
}, [location]);
  
  useEffect(() => {
    const fetchAllChannels = async () => {
      const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/all`, {
        method: 'GET',
        headers: {
          'Authorization': token,
        },
      });

      if (!response.ok) {
        console.error('Error fetching all channels');
        return;
      }

      const channels = await response.json();
      setAllChannels(channels);
    };

    fetchAllChannels();
  }, [token]);

  useEffect(() => {
    if (loggedIn) {
      const fetchMyChannels = async () => {
        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/my`, {
          method: 'GET',
          headers: {
            'Authorization': token,
          },
        });

        if (!response.ok) {
          console.error('Error fetching my channels');
          return;
        }

        const channels = await response.json();
        setMyChannels(channels);
      };

      fetchMyChannels();
    }
  }, [loggedIn, token]);


  return (
    <>
    <div style={{ display: 'flex' }}>
    <IconButton
      color="inherit"
      aria-label="open drawer"
      onClick={minimizeSidebar}
      edge="start"
    >

    </IconButton>

      <Drawer
      variant="persistent"
      open={!isSidebarMinimized}
      classes={{ paper: classes.paper }}
    >
        <List>
        <ListItem className={classes.channel}>
            <MenuIcon onClick={minimizeSidebar} style={{color:'white', cursor:'pointer'}}>
              <ExpandMoreIcon />
            </MenuIcon>
            <ListItemText primary="CHANNELS" style={{color:'white'}}/>
            {loggedIn && (
              <Tooltip title="New channel" >
                <IconButton onClick={() => setChannelModalOpen(true)} style={{color:'white'}}>
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
            )}
          </ListItem>
  
          <Divider />
          
          <ListItem button onClick={toggleTrending} className={classes.channel}>
          <ListItemText 
            primary="TRENDING" 
            style={{color:'white'}} 
            primaryTypographyProps={{ style: { fontWeight: 700, textDecoration: 'underline' } }}
          />
          {isTrending ? <ExpandMoreIcon style={{color:'white'}}/> : <ChevronRightIcon style={{color:'white'}}/>}
          </ListItem>
          <Collapse in={isTrending}>
              <NavLink className={classes.link} to={`/AllChannels/Controversial`}>
                <ListItem button>
                  <ListItemText primary={`§CONTROVERSIAL`} style={{color:'white'}}/>
                </ListItem>
              </NavLink>

              <NavLink className={classes.link} to={`/AllChannels/Popular`}>
                <ListItem button>
                  <ListItemText primary={`§POPULAR`} style={{color:'white'}}/>
                </ListItem>
              </NavLink>

              <NavLink className={classes.link} to={`/AllChannels/Unpopular`}>
                <ListItem button>
                  <ListItemText primary={`§UNPOPULAR`} style={{color:'white'}}/>
                </ListItem>
              </NavLink>
          </Collapse>

          <ListItem button onClick={toggleExplore} className={classes.channel}>
          <ListItemText 
            primary="EXPLORE" 
            style={{color:'white'}} 
            primaryTypographyProps={{ style: { fontWeight: 700, textDecoration: 'underline' } }}
          />
          {isExplore ? <ExpandMoreIcon style={{color:'white'}}/> : <ChevronRightIcon style={{color:'white'}}/>}
          </ListItem>
          <Collapse in={isExplore}>
            {allChannels.map(channel => (
              <NavLink key={channel._id} className={classes.link} to={`/AllChannels/${channel._id}`} onClick={() => handleChannelClick(channel._id)}>
                <ListItem button>
                  <ListItemText primary={`§${channel.name}`} style={{color:'white'}}/>
                </ListItem>
              </NavLink>
            ))}
          </Collapse>
  
          {loggedIn && (
            <>
              <ListItem button onClick={toggleChannels} className={classes.channel}>
                <ListItemText 
                  primary="MY CHANNELS" 
                  style={{color:'white'}} 
                  primaryTypographyProps={{ style: { fontWeight: 700, textDecoration: 'underline' } }}
                />
                {isChannelsExpanded ? <ExpandMoreIcon style={{color:'white'}}/> : <ChevronRightIcon style={{color:'white'}}/>}
              </ListItem>
              <Collapse in={isChannelsExpanded}>
                {myChannels.some(channel => !channel.name.startsWith('__direct__')) ? (
                  myChannels.map(channel => {
                    // Skip channels that start with "__direct__"
                    if (channel.name.startsWith('__direct__')) {
                      return null;
                    }

                    return (
                      <NavLink key={channel._id} className={classes.link} to={`/AllChannels/${channel._id}`} onClick={() => handleChannelClick(channel._id)}>
                        <ListItem button>
                          <ListItemText primary={`§${channel.name}`} style={{color:'white'}}/>
                        </ListItem>
                      </NavLink>
                    );
                  })
                ) : (
                  !isSidebarMinimized && (
                    <ListItem>
                      <ListItemText primary="You have not channels" style={{ color: '#fff' }} />
                    </ListItem>
                  )
                )}
              </Collapse>
              <ListItem button onClick={toggleDirectMessages} className={classes.channel}>
                <ListItemText 
                  primary="DIRECT MESSAGES" 
                  style={{color:'white'}} 
                  primaryTypographyProps={{ style: { fontWeight: 700, textDecoration: 'underline' } }}
                />
                {isDirectMessagesExpanded ? <ExpandMoreIcon style={{color:'white'}}/> : <ChevronRightIcon style={{color:'white'}}/>}
              </ListItem>
              <Collapse in={isDirectMessagesExpanded}>
                {myChannels.some(channel => channel.name.startsWith('__direct__')) ? (
                  myChannels.map(channel => {
                    // Only include channels that start with "__direct__"
                    if (!channel.name.startsWith('__direct__')) {
                      return null;
                    }

                    return (
                      <NavLink key={channel._id} className={classes.link} to={`/AllChannels/${channel._id}`} onClick={() => handleChannelClick(channel._id)}>
                        <ListItem button>
                          <ListItemText primary={`§${channel.name}`} style={{color:'white'}}/>
                        </ListItem>
                      </NavLink>
                    );
                  })
                ) : (
                  !isSidebarMinimized && (
                    <ListItem>
                      <ListItemText primary="You have not direct messages" style={{ color: '#fff' }} />
                    </ListItem>
                  )
                )}
              </Collapse>
            </>
          )}
        </List>
      </Drawer>
  </div>
      {isChannelModalOpen && (
        <Channel
          isOpen={isChannelModalOpen}
          onClose={() => setChannelModalOpen(false)}
        />
      )}
    </>
  );

}
export default Sidebar;
