import React from 'react';
import { Container, Typography, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

const UserLandingPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Oops!
            </Typography>
            <Typography variant="h6" gutterBottom>
                The user you are looking for does not exist or is currently blocked.
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/HomePage')}
                style={{ marginTop: '2rem' }}
            >
                Go to Homepage
            </Button>
        </Container>
    );
};

export default UserLandingPage;