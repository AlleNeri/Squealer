import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Box, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Typography, List, ListItem, Avatar, IconButton } from '@material-ui/core';
import { Autocomplete } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Post from '../../components/Post/Post';
import { PostsContext } from '../../context/PostsContext/PostsContext';
import { LoginContext } from '../../context/LoginContext/LoginContext';

const AllChannels = () => {
  const { id } = useParams();
  const [channel, setChannel] = useState(null);
  const {posts, setPosts} = useContext(PostsContext);
  const { loggedIn } = useContext(LoginContext);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [users, setUsers] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [triggerRender, setTriggerRender] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [owners, setOwners] = useState([]);
  let reversedPosts = [...posts].reverse();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setChannel(data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [id, posts.length, triggerRender]);

  useEffect(() => {
    // Fetch posts
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${id}/posts`, {
      headers: {
        'Authorization': token,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPosts(data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [id, posts.length, triggerRender]);

  useEffect(() => {
    const fetchOwners = async () => {
      if (channel) {
        const ownerData = await Promise.all(
          channel.owners.map((ownerId) =>
            fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${ownerId}`, {
              headers: {
                'Authorization': token
              }
            }).then((res) => res.json())
          )
        );
        setOwners(ownerData);
      }
    };

    fetchOwners();
  }, [channel, triggerRender]);

  const handleOpen = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/mention`);

      if (!response.ok) {
        throw new Error('Error getting users');
      }

      let data = await response.json();

      if (Array.isArray(data)) {
        // Filter out users who are already owners of the channel
        data = data.filter(user => !channel.owners.includes(user.id));
        setUsers(data);
      } else {
        console.error('Data is not an array:', data);
      }

      setOpen(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/mention`);

        if (!response.ok) {
          throw new Error('Error getting users');
        }

        let data = await response.json();
        if (Array.isArray(data)) {
          // If the channel is a direct channel, find the other user
          if (channel?.name.startsWith('__direct__')) {
            const otherUserId = channel.owners.find(id => id !== userId);
            const otherUser = data.find(user => user.id === otherUserId);
            setOtherUser(otherUser?.u_name);
          }
        } else {
          console.error('Data is not an array:', data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [channel, userId]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen2 = () => {
    setOpen2(true);
  };
  
  const handleClose2 = () => {
    setOpen2(false);
  };
  
  const removeOwner = (userId) => {
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${channel._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': token },
      body: JSON.stringify({ channel: { owners: channel.owners.filter(owner => owner !== userId) } })
    })
      .then(response => response.json())
      .catch(error => console.error(error));

    setTriggerRender(!triggerRender);
  };

  const handleSubmit = () => {
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${channel._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': token},
      body: JSON.stringify({ channel: { owners: [...channel.owners, selectedUser.id] } })
    })
      .then(response => response.json())
      .then(data => {
        // Update the owners state with the new owner
        setSelectedUser(null); // Reset selectedUser state
        handleClose();
      })
      .catch(error => console.error(error));

    setTriggerRender(!triggerRender);
  };

  if (!channel) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <Card style={{ backgroundColor: '#f5f5f5', width:'100%' }}>
        <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            {channel.name.startsWith('__direct__') ? (
              <Typography variant="h5" component="h2" style={{ fontWeight: 'bold', marginTop:'20px'}}>
                @{otherUser}
              </Typography>
            ) : (
              <Typography variant="h5" component="h2" style={{ fontWeight: 'bold', marginTop:'20px'}}>
                §{channel.name}
              </Typography>
            )}
            <Typography variant="body2" component="p" style={{ textAlign: 'center' }}>
                {channel.description}
            </Typography>
            </Box>
            {channel.private && loggedIn && !channel.name.startsWith("__direct__") &&
              <>
                <IconButton onClick={handleOpen2}>
                    <PeopleAltIcon style={{ color: 'black' }} />
                </IconButton>
                <Dialog open={open2} onClose={handleClose2} maxWidth="md" fullWidth>
                  <List>
                    {owners.map((owner, index) =>
                      owner && owner.name ? (
                        <ListItem key={index}>
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            width="100%"
                          >
                            <Box display="flex" alignItems="center">
                              {owner.img ? (
                                  <Avatar src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${owner.img}`} />
                              ) : (
                                  <Avatar>{owner.u_name.charAt(0)}</Avatar>
                              )}
                              <Typography style={{ marginLeft: '10px' }}>
                                {owner.name.first} {owner.name.last}
                              </Typography>
                            </Box>
                            <IconButton onClick={() => owner && removeOwner(owner.id)}>
                              <PersonRemoveIcon color="error" />
                            </IconButton>
                          </Box>
                        </ListItem>
                      ) : null
                    )}
                  </List>
                </Dialog>
                <AddCircleIcon onClick={handleOpen} style={{cursor: 'pointer'}}/>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Add User to Channel</DialogTitle>
                  <DialogContent>
                    <Autocomplete
                      id="user"
                      options={users}
                      getOptionLabel={(option) => option ? option.u_name : ""}
                      value={selectedUser || null}
                      onChange={(event, newValue) => setSelectedUser(newValue)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      renderInput={(params) => <TextField {...params} label="User" />}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">Add</Button>
                  </DialogActions>
                </Dialog>
              </>
            }
        </CardContent>
    </Card>
    <div className="posts">
        {reversedPosts.map((post) => (
            <Post key={post._id} post={post} />
        ))}
    </div>
    </>
  );
};

export default AllChannels;