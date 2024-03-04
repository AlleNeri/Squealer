import React from 'react';
import { Container, Typography, Button } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';

const UserBlockedLandingPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm" style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Oops!
            </Typography>
            <Typography variant="h6" gutterBottom>
                You cannot create a post because you're currently blocked. Please contact the admin for more information.
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

export default UserBlockedLandingPage;