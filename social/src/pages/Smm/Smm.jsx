import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CardActions, Button, Avatar, Divider } from '@material-ui/core';

const SmmPage = () => {
  const [smms, setSmms] = useState([]);
  const [selectedSmm, setSelectedSmm] = useState(null);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const handleSelect = async (smmId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/smms/select/${smmId}`, {
        method: 'PUT',
        headers: {
          'Authorization': token,
        },
      });
      
      if (!response.ok) {
        throw new Error('There was a problem selecting the SMM');
      }
  
      setSelectedSmm(smmId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRevoke = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/smms/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': token,
        },
      });
  
      if (!response.ok) {
        throw new Error('There was a problem revoking the SMM');
      }
  
      setSelectedSmm(null);
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/smms`, {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setSmms(data);
      })
      .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, [selectedSmm]);

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom>
        Choose your SMM
      </Typography>
      <Divider style={{ backgroundColor: 'black', marginBottom: '20px' }} />
      {smms.map((smm) => (
        <Card key={smm._id}>
          <CardContent>
            <Avatar alt="SMM Profile" src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${smm.img}`} />
            <Typography variant="subtitle1" component="div">
              <b>Nome:</b> {smm.name.first}
            </Typography>
            <Typography variant="subtitle1" component="div">
              <b>Cognome:</b> {smm.name.last}
            </Typography>
          </CardContent>
          <CardActions>
          {smm.client.includes(localStorage.getItem('userId')) ? (
            <Button variant="contained" color="secondary" onClick={handleRevoke}>
              REVOCA SMM
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={() => handleSelect(smm._id)}>
              Scegli SMM
            </Button>
          )}
        </CardActions>
        </Card>
      ))}
    </div>
  );
};

export default SmmPage;