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
import Channel from '../Channel/Channel';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import './sidebar.css';
const Sidebar = () => {
  const [allChannels, setAllChannels] = useState([]);
  const [myChannels, setMyChannels] = useState([]);
  const [isChannelModalOpen, setChannelModalOpen] = useState(false);
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);
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


  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  };

  const minimizeSidebar = () => {
    console.log('minimizeSidebar was called' + isSidebarMinimized);
    setSidebarMinimized(!isSidebarMinimized);
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
              </h6>
            </CDBSidebarHeader>
    
            <CDBSidebarContent className="sidebar-content" style={{ display: 'flex', flexDirection: 'column' }}>
            <CDBSidebarMenu>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                  <span style={{ marginLeft: '20px' }}>EXPLORE</span>
                </Typography>
                {allChannels.map(channel => (
                  <CDBSidebarMenuItem 
                    key={channel.id}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#72B2F4'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                  >
                    {channel.name}
                  </CDBSidebarMenuItem>
                ))}
                {loggedIn ? (
                  <>
                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                      <span style={{ marginLeft: '20px' }}>MY CHANNELS</span>
                    </Typography>
                      {myChannels.length > 0 ? (
                        myChannels.map(channel => (
                          <CDBSidebarMenuItem 
                            key={channel.id}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#72B2F4'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                          >
                            {channel.name}
                          </CDBSidebarMenuItem>
                        ))
                      ) : (
                        <Typography variant="body1">You have not created any channels yet</Typography>
                      )}
                  </>
                ) : <p></p>}
              </CDBSidebarMenu>      
              <div style={{ flexGrow: 1 }}></div>     
              {loggedIn && ( // Render the button only if the user is logged in
                <div style={buttonContainerStyle}>
                  <Button 
                    className='button' 
                    onClick={() => setChannelModalOpen(true)} 
                    style={{ 
                      ...buttonStyle, 
                      display: shouldHideButton ? 'none' : 'block' 
                    }}
                  >
                    NEW CHANNEL
                  </Button>
                </div>
              )}
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
