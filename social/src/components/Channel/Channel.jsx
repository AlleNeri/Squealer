import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Dialog, FormControlLabel, Checkbox } from '@mui/material';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    dialog: {
      marginLeft: theme.spacing(30), // Move the dialog to the left
    },
    form: {
      padding: theme.spacing(2), // Add some padding around the form
    },
    textField: {
      marginBottom: theme.spacing(2), // Add some margin below the text fields
    },
    button: {
      display: 'flex', // Center the button
      justifyContent: 'center',
    },
    typography: {
        margin: theme.spacing(2), // Add some margin
    },
}));

const Channel = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setPrivate] = useState(false);
    const token = localStorage.getItem('token');
    const classes = useStyles();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    channel: {
                        name,
                        description,
                        private: isPrivate,
                        owners: [],
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            onClose();
        } catch (error) {
            console.error('Error creating channel', error);
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Dialog 
            className={classes.dialog}
            open={isOpen} 
            onClose={onClose} 
            fullScreen={false} 
            maxWidth='lg'
            PaperProps={{ style: { width: '60%', maxHeight: '100vh' } }}
        >
            <div>
                <Box className={classes.typography}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        NEW CHANNEL
                    </Typography>
                </Box>

                <form onSubmit={handleSubmit} className={classes.form}>
                    <Box marginBottom={2} className={classes.textField}>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                        />
                    </Box>

                    <Box className={classes.textField}>
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                    </Box>

                    <FormControlLabel
                        control={
                        <Checkbox 
                            checked={isPrivate} 
                            onChange={(e) => setPrivate(e.target.checked)} 
                            color="primary" 
                        />
                        }
                        label="Private"
                    />

                    <Box>
                        <Button className={classes.button} type="submit" variant="contained" color="primary">
                            Create Channel
                        </Button>
                    </Box>
                </form>

                <div onClick={onClose}></div>
            </div>
        </Dialog>
    );
};

export default Channel;