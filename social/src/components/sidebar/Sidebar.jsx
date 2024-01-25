import React, {useState, useEffect, useContext} from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { Typography, Button, useMediaQuery } from '@material-ui/core'; // Import Typography from Material UI
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Channel from '../Channel/Channel';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import './sidebar.css';
const Sidebar = () => {
  const [allChannels, setAllChannels] = useState([]);
  const [myChannels, setMyChannels] = useState([]);
  const [isChannelModalOpen, setChannelModalOpen] = useState(false);
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [hoveredChannel, setHoveredChannel] = useState(null);
  const { loggedIn } = useContext(LoginContext);
  const token = localStorage.getItem('token');

  const matches = useMediaQuery('(max-width:710px)');
  const shouldHideButton = matches || isSidebarMinimized;
  const buttonStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    display: isSidebarMinimized ? 'none' : 'block', // Hide the button if the sidebar is minimized
    '&:hover': {
      backgroundColor: '#0062cc',
    },
  };


  const minimizeSidebar = () => {
    console.log('minimizeSidebar was called' + isSidebarMinimized);
    setSidebarMinimized(!isSidebarMinimized);
  };

  const handleChannelClick = (channelId) => {
    setSelectedChannel(channelId);
  };
  
  const handleMouseEnter = (channelId) => {
    setHoveredChannel(channelId);
  };
  
  const handleMouseLeave = () => {
    setHoveredChannel(null);
  };

  useEffect(() => {
    const fetchAllChannels = async () => {
      const response = await fetch('http://localhost:8080/channels/all', {
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
        const response = await fetch('http://localhost:8080/channels/my', {
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
      <div style={{ position: 'fixed', display: 'flex', justifyContent: 'flex-start', height: '100vh', marginTop:'64px' }}>
          <CDBSidebar textColor="#fff" backgroundColor="#333" >
            <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large" onClick={minimizeSidebar}></i> }>
              <h6 className="text-decoration-none" style={{ color: 'inherit' }}>
                CHANNELS
                {loggedIn && <AddCircleIcon style={{ marginLeft: '10px', cursor: 'pointer' }} onClick={() => setChannelModalOpen(true)} />}
              </h6>
            </CDBSidebarHeader>
    
            <CDBSidebarContent className="sidebar-content" style={{ display: 'flex', flexDirection: 'column' }}>
            <CDBSidebarMenu>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  <span style={{ marginLeft: '20px' }}>EXPLORE</span>
                </Typography>
                {allChannels.map(channel => (
                  <NavLink
                    key={channel.id}
                    to={`/AllChannels/${channel._id}`}
                    activeClassName="activeClicked"
                    onClick={() => handleChannelClick(channel._id)}
                    style={{ textDecoration: 'none' }}>
                    <CDBSidebarMenuItem 
                      key={channel._id}
                      onMouseEnter={() => handleMouseEnter(channel._id)}
                      onMouseLeave={handleMouseLeave}
                      style={{ backgroundColor: selectedChannel === channel._id || hoveredChannel === channel._id ? '#72B2F4' : 'transparent' }}
                    >
                      {channel.name}
                    </CDBSidebarMenuItem>
                  </NavLink>
                ))}
                {loggedIn ? (
                  <>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                      <span style={{ marginLeft: '20px' }}>MY CHANNELS</span>
                    </Typography>
                      {myChannels.length > 0 ? (
                        myChannels.map(channel => (
                          <NavLink
                          key={channel.id}
                          to={`/MyChannels/${channel._id}`}
                          activeClassName="activeClicked"
                          onClick={() => handleChannelClick(channel._id)}
                          style={{ textDecoration: 'none' }}>
                            <CDBSidebarMenuItem 
                              key={channel._id}
                              onMouseEnter={() => handleMouseEnter(channel._id)}
                              onMouseLeave={handleMouseLeave}
                              style={{ backgroundColor: selectedChannel === channel._id || hoveredChannel === channel._id ? '#72B2F4' : 'transparent' }}
                            >
                              {channel.name}
                            </CDBSidebarMenuItem>
                          </NavLink>
                        ))
                      ) : (
                        <Typography variant="body1">You have not created any channels yet</Typography>
                      )}
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
