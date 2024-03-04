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
  const addedChannel = localStorage.getItem('addedChannel');
  const { isSidebarMinimized, setSidebarMinimized } = useContext(SidebarContext);

  const useStyles = makeStyles({
    paper: {
      background: '#white',
    },
    channel: {
      '&:hover': {
        backgroundColor: 'gray',
      },
    },
    link: {
      textDecoration: 'none',
      color: 'inherit',
      marginLeft: '20px', 
      '&:hover': {
        color:'white',
      },
    },
  });

  const classes = useStyles();

  const minimizeSidebar = () => {
    setSidebarMinimized(prevState => !prevState);
  };

  useEffect(() => {
    setSidebarMinimized(true);
  }, []); // Removed setSidebarMinimized from the dependency array


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
  }, [token, allChannels.length, addedChannel]);

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
  }, [loggedIn, token, myChannels.length, addedChannel]);


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
            <MenuIcon onClick={minimizeSidebar} style={{color:'black', cursor:'pointer'}}>
              <ExpandMoreIcon />
            </MenuIcon>
            <ListItemText primary="CHANNELS" style={{color:'black'}}/>
            {loggedIn && (
              <Tooltip title="New channel" >
                <IconButton 
                  onClick={() => {
                    setChannelModalOpen(true);
                    
                    // Set the item in localStorage
                    localStorage.setItem('lastPath', 'NewChannel');
                  }} 
                  style={{color:'black'}}
                >
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
            )}
          </ListItem>
  
          <Divider />
          
          <ListItem button onClick={toggleTrending} className={classes.channel}>
          <ListItemText 
            primary="TRENDING" 
            style={{color:'black'}} 
            primaryTypographyProps={{ style: { fontWeight: 700, textDecoration: 'underline' } }}
          />
          {isTrending ? <ExpandMoreIcon style={{color:'black'}}/> : <ChevronRightIcon style={{color:'black'}}/>}
          </ListItem>
          <Collapse in={isTrending}>
              <NavLink className={classes.link} to={`/AllChannels/Controversial`}>
                <ListItem button onClick={() => setSidebarMinimized(true)}>
                  <ListItemText primary={`§CONTROVERSIAL`} style={{color:'black'}}/>
                </ListItem>
              </NavLink>

              <NavLink className={classes.link} to={`/AllChannels/Popular`}>
                <ListItem button onClick={() => setSidebarMinimized(true)}>
                  <ListItemText primary={`§POPULAR`} style={{color:'black'}}/>
                </ListItem>
              </NavLink>

              <NavLink className={classes.link} to={`/AllChannels/Unpopular`}>
                <ListItem button onClick={() => setSidebarMinimized(true)}>
                  <ListItemText primary={`§UNPOPULAR`} style={{color:'black'}}/>
                </ListItem>
              </NavLink>
          </Collapse>

          <ListItem button onClick={toggleExplore} className={classes.channel}>
          <ListItemText 
            primary="EXPLORE" 
            style={{color:'black'}} 
            primaryTypographyProps={{ style: { fontWeight: 700, textDecoration: 'underline' } }}
          />
          {isExplore ? <ExpandMoreIcon style={{color:'black'}}/> : <ChevronRightIcon style={{color:'black'}}/>}
          </ListItem>
          <Collapse in={isExplore}>
            {allChannels.map(channel => (
              <NavLink key={channel._id} className={classes.link} to={`/AllChannels/${channel._id}`} onClick={() => handleChannelClick(channel._id)}>
                <ListItem button>
                  <ListItemText primary={`§${channel.name}`} style={{color:'black'}}/>
                </ListItem>
              </NavLink>
            ))}
          </Collapse>
  
          {loggedIn && (
            <>
              <ListItem button onClick={toggleChannels} className={classes.channel}>
                <ListItemText 
                  primary="MY CHANNELS" 
                  style={{color:'black'}} 
                  primaryTypographyProps={{ style: { fontWeight: 700, textDecoration: 'underline' } }}
                />
                {isChannelsExpanded ? <ExpandMoreIcon style={{color:'black'}}/> : <ChevronRightIcon style={{color:'black'}}/>}
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
                          <ListItemText primary={`§${channel.name}`} style={{color:'black'}}/>
                        </ListItem>
                      </NavLink>
                    );
                  })
                ) : (
                  !isSidebarMinimized && (
                    <ListItem>
                      <ListItemText primary="You have not channels" style={{ color: 'black' }} />
                    </ListItem>
                  )
                )}
              </Collapse>
              <ListItem button onClick={toggleDirectMessages} className={classes.channel}>
                <ListItemText 
                  primary="DIRECT MESSAGES" 
                  style={{color:'black'}} 
                  primaryTypographyProps={{ style: { fontWeight: 700, textDecoration: 'underline' } }}
                />
                {isDirectMessagesExpanded ? <ExpandMoreIcon style={{color:'black'}}/> : <ChevronRightIcon style={{color:'black'}}/>}
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
                          <ListItemText primary={`§${channel.name}`} style={{color:'black'}}/>
                        </ListItem>
                      </NavLink>
                    );
                  })
                ) : (
                  !isSidebarMinimized && (
                    <ListItem>
                      <ListItemText primary="You have not direct messages" style={{ color: 'black' }} />
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
      onClose={() => {
        setSidebarMinimized(true);
        setChannelModalOpen(false);
      }}
    />
  )}
    </>
  );

}
export default Sidebar;
