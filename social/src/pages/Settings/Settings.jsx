import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Grid, TextField, Button, Typography, Divider } from '@material-ui/core';
import { LoginContext } from "../../context/LoginContext/LoginContext";

function Settings() {
    const { loggedIn, setLoggedIn, justRegistered, setJustRegistered } = useContext(LoginContext);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${userId}/changePassword`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({oldPassword: oldPassword, newPassword: newPassword }),
        });

        const data = await response.json();

        if (data.success) {
            alert('Password changed successfully');
        } else {
            alert('Error changing password');
        }
    };

    const handleDeleteAccount = async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${userId}/delete`, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
            },
        });

        const data = await response.json();

        if (data.success) {
            alert('Account deleted successfully');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            
            // Update the loggedIn state
            setLoggedIn(false);

            // Redirect to the login page
            navigate('/login');
        } else {
            alert('Error deleting account');
        }
    };

    const handleOpenChangePassword = () => {
    setIsChangePasswordOpen(true);
    };
    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" gutterBottom align="center">
                    Settings
                </Typography>

                <Grid container direction="column" alignItems="center">
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleOpenChangePassword}>
                            Change Password
                        </Button>
                    </Grid>

                    {isChangePasswordOpen && (
                        <form onSubmit={handleChangePassword}>
                            <Grid container spacing={3} alignItems="center" direction="column">
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Old Password"
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    )}

                    <Divider style={{ margin: '20px 0', width: '100%' , backgroundColor: 'black'}} />

                    <Grid item>
                        <Box mt={2}>
                            <Button variant="contained" color="secondary" onClick={handleDeleteAccount}>
                                Delete Account
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
      );
}

export default Settings;