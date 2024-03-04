import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Grid, TextField, Button, Typography, Divider, Dialog, DialogActions,
        DialogContent, DialogContentText, DialogTitle, Paper, IconButton } from '@material-ui/core';

import Alert from '@mui/material/Alert';
import CloseIcon from '@material-ui/icons/Close';
import { LoginContext } from "../../context/LoginContext/LoginContext";

function Settings() {
    const { setLoggedIn } = useContext(LoginContext);
    const [open, setOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
          setIsChangePasswordOpen(false);
        };
    }, []);

    const isPasswordValid = (password) => {
        // La password deve avere almeno 8 caratteri, una lettera maiuscola, una lettera minuscola e un numero
        const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return regex.test(password);
    };

    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmNewPassword) {
            setError('New password and confirm new password do not match');
            return;
        }

        if (!isPasswordValid(newPassword)) {
            setError('Password must have at least 8 characters, one uppercase letter, one lowercase letter, and one number');
            return;
        }

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
            setSuccess('Password changed successfully');
            setTimeout(() => setSuccess(''), 5000);
            setIsChangePasswordOpen(false);
        } else {
            setError('Error changing password: make sure the old password is correct');
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
    setOpen(false);
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
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            
            // Update the loggedIn state
            setLoggedIn(false);
            // Redirect to the login page
            navigate('/login');
        } else {
            alert('Error deleting account');
        }

        setOpen(false);
    };

    const handleOpenChangePassword = () => {
        setIsChangePasswordOpen(true);
    };
    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" gutterBottom align="center" style={{ fontWeight: 'bold' }}>
                    SETTINGS
                </Typography>

                <Grid container direction="column" alignItems="center" style={{marginTop: '20px'}}>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleOpenChangePassword} fullWidth>
                            Change Password
                        </Button>
                    </Grid>

                    {isChangePasswordOpen && (
                        <Paper style={{ width:'350px', padding: '20px', marginTop: '20px', position: 'relative' }}>
                            <IconButton 
                                style={{ position: 'absolute', right: 0, top: 0 }} 
                                onClick={() => setIsChangePasswordOpen(false)}
                                >
                                <CloseIcon />
                            </IconButton>
                            <form onSubmit={handleChangePassword}>
                            <Grid container spacing={3} alignItems="center" direction="column">
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Old Password"
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        style={{ marginTop: '20px', whiteSpace: 'nowrap' }}
                                    />
                                </Grid>
                        
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        style={{ marginTop: '20px', whiteSpace: 'nowrap' }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    type="password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    style={{ marginTop: '20px', whiteSpace: 'nowrap' }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Button variant="contained" color="primary" type="submit">
                                        Submit
                                    </Button>
                                </Grid>
                                {error && <Alert severity="error">{error}</Alert>}
                            </Grid>
                            </form>
                        </Paper>
                    )}

                    {success && <Alert severity="success" style={{marginTop:'10px'}}>{success}</Alert>}
                    <Divider style={{ margin: '20px 0', width: '100%' , backgroundColor: 'black'}} />

                    <Grid item>
                        <Box mt={2}>
                        <Button variant="contained" color="secondary" onClick={handleClickOpen} fullWidth>
                            Delete Account
                        </Button>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">{"Delete Account"}</DialogTitle>
                            <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                Are you sure you want to delete your account?
                            </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteAccount} color="primary" autoFocus>
                                Delete
                            </Button>
                            </DialogActions>
                        </Dialog>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
      );
}

export default Settings;