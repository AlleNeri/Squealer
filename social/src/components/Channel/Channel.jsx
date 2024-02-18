import React, { useState } from 'react';
import { Button, TextField, Typography, Dialog, FormControlLabel, Checkbox, Grid, Divider, Box} from '@mui/material';

const Channel = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setPrivate] = useState(false);
    const token = localStorage.getItem('token');

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
            open={isOpen} 
            onClose={onClose} 
            fullScreen={false} 
            maxWidth='md'
            PaperProps={{ style: { maxHeight: '100vh', width: '80%' } }}
        >
            <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                    <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
                        <Typography variant="h4" component="h2" gutterBottom>
                            NEW CHANNEL
                        </Typography>
                        <Divider style={{ width: '100%', backgroundColor: 'black' }} />
                    </Box>
                </Grid>

                <Grid item xs={12}>
                    <form onSubmit={handleSubmit}>
                        <Grid container direction="column" spacing={2}>
                            <Grid item xs={12} style={{ paddingLeft:'30px' }}>
                                <TextField
                                    label="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} style={{ paddingLeft: '30px' }}>
                                <TextField
                                    label="Description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12} style={{ paddingLeft: '30px' }}>
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
                            </Grid>

                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button type="submit" variant="contained" color="primary">
                                    Create Channel
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </Dialog>
    );
};

export default Channel;