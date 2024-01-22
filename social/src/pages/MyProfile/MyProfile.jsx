import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Avatar, Grid, Box } from '@material-ui/core';

const MyProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug: stampa il token
  
    const userId = id;
    console.log('User ID:', userId); // Debug: stampa l'ID dell'utente
  
    fetch(`http://localhost:8080/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Data:', data); // Debug: stampa i dati
        setUser(data);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" flexDirection="row" alignItems="flex-start">
            <Avatar src={user.image} alt={user.u_name} style={{ marginRight: '16px' }} />
            <Box display="flex" flexDirection="column">
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                Username:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                {user.u_name}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    First name:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {user.name.first}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    Last name:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {user.name.last}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    E-mail Address:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {user.email}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    Type:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {user.type}
                </Typography>
            </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    Creation date:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px' }}>
                    {new Date(user.creation_date).toLocaleDateString()}
                </Typography>
                </Box>
            <Box display="flex" alignItems="center">
                <Typography variant="subtitle1" component="span" style={{ fontWeight: 'bold' }}>
                    Message popularity:
                </Typography>
                <Typography variant="body2" component="span" style={{ marginLeft: '8px', color: 'green' }}>
                    {user.messagePopularity.positive}
                </Typography>
                <Typography variant="body2" component="span">
                    /
                </Typography>
                <Typography variant="body2" component="span" style={{ color: 'red' }}>
                    {user.messagePopularity.negative}
                </Typography>
                </Box>
            </Box>
        </Box>
        </CardContent>
    </Card>
  );
};

export default MyProfile;