import React, {useState, useEffect, useContext} from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, useLocation } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Channel from '../Channel/Channel';
import { SidebarContext } from '../../context/SidebarContext/SidebarContext';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import './sidebar.css';
const Sidebar = () => {
  const [allChannels, setAllChannels] = useState([]);
  const [myChannels, setMyChannels] = useState([]);
  const [isChannelModalOpen, setChannelModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [hoveredChannel, setHoveredChannel] = useState(null);
  const { loggedIn } = useContext(LoginContext);
  const location = useLocation();
  const token = localStorage.getItem('token');
  const [openExplore, setOpenExplore] = useState(false);
  const [openMyChannels, setOpenMyChannels] = useState(false);
  const { isSidebarMinimized, setSidebarMinimized } = useContext(SidebarContext);

  const minimizeSidebar = () => {
    setSidebarMinimized(!isSidebarMinimized);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 719) { 
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
    localStorage.setItem('selectedChannel', channelId); // Store the selected channel ID in local storage
  };
  
  const handleMouseEnter = (channelId) => {
    setHoveredChannel(channelId);
  };
  
  const handleMouseLeave = () => {
    setHoveredChannel(null);
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
      <div style={{ position: 'fixed', display: 'flex', justifyContent: 'flex-start', height: '100vh', zIndex: '1001'}}>
          <CDBSidebar textColor="#fff" backgroundColor="#333" >
            <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large" onClick={minimizeSidebar}></i> }>
              <h6 className="text-decoration-none" style={{ color: 'inherit' }}>
                CHANNELS
                {loggedIn && <Tooltip title="New channel"><AddCircleIcon  style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={() => setChannelModalOpen(true)} /></Tooltip>}
              </h6>
            </CDBSidebarHeader>
    
            <CDBSidebarContent className="sidebar-content" style={{ display: 'flex', flexDirection: 'column' }}>
            <CDBSidebarMenu style={{ overflowY: 'auto' }}>
              {!isSidebarMinimized ? (
                <Typography variant="h6" style={{ fontWeight: 'bold' }} onClick={() => setOpenExplore(!openExplore)}>
                   <ExpandMoreIcon style={{ transform: openExplore ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.3s', cursor:'pointer' }}/>
                  <span style={{ marginLeft: '20px' }}>EXPLORE</span>
                </Typography>
              ): <p></p>}
              <Collapse in={openExplore}>
                {allChannels.map(channel => (
                  <NavLink
                    key={channel._id}
                    to={`/AllChannels/${channel._id}`}
                    activeclassname="activeClicked"
                    onClick={() => handleChannelClick(channel._id)}
                    style={{ textDecoration: 'none' }}>
                    <CDBSidebarMenuItem 
                      key={channel._id}
                      onMouseEnter={() => handleMouseEnter(channel._id)}
                      onMouseLeave={handleMouseLeave}
                      style={{ backgroundColor: (selectedChannel === channel._id || hoveredChannel === channel._id) && !isSidebarMinimized ? '#72B2F4' : 'transparent' }}
                    >
                      {channel.name}
                    </CDBSidebarMenuItem>
                  </NavLink>
                ))}
              </Collapse>
                {loggedIn ? (
                  <>
                  {!isSidebarMinimized ?(
                    <Typography variant="h6" style={{ fontWeight: 'bold' }} onClick={() => setOpenMyChannels(!openMyChannels)}>
                      <ExpandMoreIcon  style={{ transform: openMyChannels ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.3s', cursor:'pointer'}}/>
                      <span style={{ marginLeft: '20px' }}>MY CHANNELS</span>
                    </Typography>
                  ): <p></p>}
                  <Collapse in={openMyChannels}>
                    {
                      myChannels.length > 0 ? (
                        myChannels.map((channel) => (
                          <NavLink
                            key={channel._id}
                            to={`/AllChannels/${channel._id}`}
                            activeclassname="activeClicked"
                            style={{ textDecoration: 'none' }}
                            onClick={() => handleChannelClick(channel._id)}
                          >
                          <CDBSidebarMenuItem 
                            key={channel._id}
                            onMouseEnter={() => handleMouseEnter(channel._id)}
                            onMouseLeave={handleMouseLeave}
                            style={{ backgroundColor: (selectedChannel === channel._id || hoveredChannel === channel._id) && !isSidebarMinimized ? '#72B2F4' : 'transparent' }}
                          >
                            {channel.name}
                          </CDBSidebarMenuItem>
                          </NavLink>
                        ))
                      ) : (
                        !isSidebarMinimized && (
                          <Typography variant="body1"> <span style={{ marginLeft: '20px' }}>You have not channels</span></Typography>
                        )
                      )
                    }
                  </Collapse>
                  </>
                ) : <p></p>}
              </CDBSidebarMenu>      
            </CDBSidebarContent>
          </CDBSidebar>
        </div>

        {isChannelModalOpen && (
          <Channel
            isOpen={isChannelModalOpen}
            onClose={() => setChannelModalOpen(false)}
          />
        )}

      </>
      );
};

export default Sidebar;
