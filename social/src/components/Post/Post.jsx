import React, { useEffect, useRef, useContext, useState } from 'react';
import { Card, CardContent, Typography, IconButton, Grid, Avatar, Tooltip, useMediaQuery, useTheme, Dialog,
         DialogContent, DialogTitle } from '@material-ui/core';
import L, {Icon} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { SentimentVeryDissatisfied, SentimentDissatisfied, SentimentSatisfied, SentimentVerySatisfied } from '@material-ui/icons';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AlarmIcon from '@mui/icons-material/Alarm';
import CloseIcon from '@mui/icons-material/Close';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import CountUp from 'react-countup';
import Linkify from 'react-linkify';
import {Link} from 'react-router-dom';

export default function Post({post}) {
  const {title, content, keywords, reactions, posted_by, posted_on, timed, popular, unpopular, date} = post;
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [channel, setChannel] = useState(null);
    const mapRef = useRef(); // Assign useRef to a variable
    const [open, setOpen] = useState(false);
    const token = localStorage.getItem('token');
    const { loggedIn } = useContext(LoginContext);
    const views = reactions?.filter(reaction => [-2, -1, 0, 1, 2].includes(reaction.value)).length;
    const [reactionCounts, setReactionCounts] = useState({
        veryDissatisfied: reactions?.filter(reaction => reaction.value === -2).length,
        dissatisfied: reactions?.filter(reaction => reaction.value === -1).length,
        satisfied: reactions?.filter(reaction => reaction.value === 1).length,
        verySatisfied: reactions?.filter(reaction => reaction.value === 2).length,
    });
    const userID = localStorage.getItem('userId');
    const [userReaction, setUserReaction] = useState(post?.reactions?.find(reaction => reaction.user_id === userID));
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isScreenLarge = useMediaQuery(theme.breakpoints.up('md'));
    if(!loggedIn) { localStorage.removeItem('userId'); }
    const postDate = new Date(date);
    const today = new Date();

    const isToday = 
      postDate.getDate() === today.getDate() &&
      postDate.getMonth() === today.getMonth() &&
      postDate.getFullYear() === today.getFullYear();

    const displayDate = isToday
      ? `Today at ${postDate.getHours()}:${postDate.getMinutes() < 10 ? '0' : ''}${postDate.getMinutes()}`
      : postDate.toLocaleString();

    useEffect(() => {
      // Fetch the channel when the component mounts
      fetch(`${import.meta.env.VITE_DEFAULT_URL}/channels/${posted_on}`)
        .then(response => response.json())
        .then(data => setChannel(data))
        .catch(error => console.error('Error:', error));
    }, [posted_on]);

    useEffect(() => {
      const visualizePost = async () => {
        try {
          // Check if the user has already reacted to the post
          const userReaction = post?.reactions?.find(reaction => reaction.user_id === userID);
          if (!userReaction) {
            // Add a view to the post
            const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/posts/${post._id}/visualize`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
              },
            });
            if (!response.ok) {
              const data = await response.json();
            }
          }
        } catch (error) {
          
        }
      };
    
      if (loggedIn) {
        visualizePost();
      }
  }, []);

  const renderKeywords = (keywords) => {
    return keywords.map((keyword, index) => (
      <span key={index}>
        <Link to={`/Keywords/${keyword}`}>
          #{keyword}
        </Link>
        {index < keywords.length - 1 ? ', ' : ''}
      </span>
    ));
  }

  const updateReactionCounts = (value, increment) => {
    setReactionCounts(prevCounts => {
      switch (value) {
        case -2:
          return { ...prevCounts, veryDissatisfied: prevCounts.veryDissatisfied + increment };
        case -1:
          return { ...prevCounts, dissatisfied: prevCounts.dissatisfied + increment };
        case 1:
          return { ...prevCounts, satisfied: prevCounts.satisfied + increment };
        case 2:
          return { ...prevCounts, verySatisfied: prevCounts.verySatisfied + increment };
        default:
          return prevCounts;
      }
    });
  };

  useEffect(() => {
    // Fai una richiesta al backend per ottenere le informazioni degli utenti
    fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/mention`)
    .then(response => response.json())
    .then(data => {
      setUsers(data);
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  }, []);

  function replaceMentionsWithLinks(text) {
    if(!text) return [];
    // Dividi il testo in parti utilizzando la menzione come separatore
    const parts = text.split(/(@\w+)/g);

    // Mappa ogni parte in un elemento React
    return parts.map((part, i) => {
      // Se la parte è una menzione, sostituiscila con un link
      const match = part.match(/@(\w+)/);
      if (match) {
        const user = users.find(user => user.u_name === match[1]);
        if (user) {
          return (
            <Link to={`/profile/${user.id}`} key={i}>
              @{user.u_name}
            </Link>
          );
        }
      }

      // Altrimenti, restituisci la parte come testo
      return part;
    });
  }

  const replacedText = replaceMentionsWithLinks(content?.text);
  useEffect(() => {
    const fetchUser = async () => {
        const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/users/${posted_by}`, {
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setUser(data);
    };

    fetchUser();
  }, [posted_by]);

  useEffect(() => {
      if(content && content.position){
          if (!mapRef.current) return;
          // If the map was already initialized, return early
          if (mapRef.current && mapRef.current.leafletElement) return;
      
          try {
              const map = L.map(mapRef.current, { scrollWheelZoom: false}).setView([content.position.latitude, content.position.longitude], 13);
      
              L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              }).addTo(map);
      
              L.marker([content.position.latitude, content.position.longitude], {icon: new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}).addTo(map);
      
              // Save the map instance to the ref
              mapRef.current.leafletElement = map;
          } catch (error) {
              console.error('Error creating map', error);
          }
      }
  }, [content]);

  const handleReaction = async (reaction) => {
      let previousValue = null;
      if (userReaction) {
        previousValue = userReaction.value;
        updateReactionCounts(previousValue, -1);
      }
    
      if (previousValue === reaction) {
        setUserReaction(null);
        // Send a request to remove the reaction
        await fetch(`${import.meta.env.VITE_DEFAULT_URL}/posts/${post?._id}/visualize`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ reaction: null }),
        });
      } else {
        setUserReaction({ user_id: userID, value: reaction });
        updateReactionCounts(reaction, 1);
        // Send a request to add the reaction
        await fetch(`${import.meta.env.VITE_DEFAULT_URL}/posts/${post?._id}/react`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ reaction }),
        });
      }
    };

    const handleClickOpen = () => {
      setOpen(true);
    }

    const handleClose = () => {
      setOpen(false);
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
      
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Card style={{ margin: '20px', padding: '20px', backgroundColor: '#fafeff' }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={2}>
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: isScreenLarge ? 'column' : 'row', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: isScreenLarge ? 'column' : 'row', 
                        alignItems: isScreenLarge ? 'center' : 'flex-start' 
                      }}>
                        <Avatar alt="Profile" src={user && user.img ? `${import.meta.env.VITE_DEFAULT_URL}/media/image/${user.img}` : undefined} >
                          {user?.u_name?.charAt(0).toUpperCase()}
                        </Avatar>
                        {user && user.u_name 
                          ? <Link to={`/Profile/${posted_by}`} style={{ color: 'inherit', marginLeft: isScreenLarge ? '0' : '10px' }}>@{user.u_name}</Link> 
                          : <Link to={`/UserLandingPage`} style={{ color: 'inherit', marginLeft: isScreenLarge ? '0' : '10px' }}>@deleted_user</Link>}
                      </div>
                      {timed && isSmallScreen &&
                        <div style={{ alignSelf: isScreenLarge ? 'flex-end' : 'initial' }}>
                          <Tooltip title="Timed squeal">
                            <AlarmIcon />
                          </Tooltip>
                        </div>
                      }
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: isSmallScreen ? 'column-reverse' : 'row', 
                        justifyContent: 'space-between', 
                        alignItems: 'left' 
                      }}>
                        <div>
                          {channel?.name && !channel.name.startsWith('__direct__') && (
                            <Link to={`/AllChannels/${channel?._id}`} style={{ textDecoration: 'none' }}>
                              <Typography variant="body1" display="inline" color="textPrimary" style={{ textDecoration: 'underline' }}>
                                {`§${channel?.name}`}
                              </Typography>
                            </Link>
                          )}
                          {channel?.name && !channel.name.startsWith('__direct__') && (popular || unpopular) && 
                            <Link to={`/AllChannels/${popular && unpopular ? 'Controversial' : popular ? 'Popular' : 'Unpopular'}`} style={{ textDecoration: 'none' }}>
                              <Typography variant="body1" display="inline" color="textPrimary" style={{ textDecoration: 'underline' }}>
                                {`, ${popular && unpopular ? '§CONTROVERSIAL' : popular ? '§POPULAR' : unpopular ? '§UNPOPULAR' : ''}`}
                              </Typography>
                            </Link>
                          }
                        </div>
                        {timed && !isSmallScreen &&
                          <div>
                            <Tooltip title="Timed squeal">
                              <AlarmIcon />
                            </Tooltip>
                          </div>
                        }
                      </div>
                      <Typography variant="h5" style={{ marginTop: '20px' }}>
                        {title}
                      </Typography>
                    </div>
                    {content && content.text ?
                      <Typography variant="body2" component="p">
                        <Linkify>
                          {replacedText}
                        </Linkify>
                      </Typography>
                      : <p></p>
                    }
                    {content && content.position && <div ref={mapRef} style={{ width: '100%', height: '300px', zIndex: 500 }}></div>}
                    {content && content.img && (
                      <div>
                        <img 
                          src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${content.img}`} 
                          alt="description" 
                          style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', objectPosition: 'center', cursor:'pointer' }} 
                          onClick={handleClickOpen}
                        />

                        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                          <DialogContent style={{ overflow: 'hidden' }}>
                            <img 
                              src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${content.img}`} 
                              alt="description" 
                              style={{ width: '100%', maxHeight: '600px', objectFit: 'cover', objectPosition: 'center' }} 
                            />
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                    <Typography variant="body2" component="p">
                      {keywords && renderKeywords(keywords)}
                    </Typography>
                    <Grid container justifyContent="space-between">
                      {channel?.name && !channel.name.startsWith('__direct__') && (
                        <Grid container justifyContent="space-between">
                          <Grid container spacing={1}>
                            <Grid item xs={3} sm={3}>
                              <IconButton onClick={() => handleReaction(-2)} disabled={!loggedIn}>
                                <SentimentVeryDissatisfied style={{ color: userReaction && userReaction.value === -2 ? 'red' : 'grey' }} />
                                <CountUp end={reactionCounts.veryDissatisfied} />
                              </IconButton>
                            </Grid>
                            <Grid item xs={3} sm={3}>
                              <IconButton onClick={() => handleReaction(-1)} disabled={!loggedIn}>
                                <SentimentDissatisfied style={{ color: userReaction && userReaction.value === -1 ? 'orange' : 'grey' }} />
                                <CountUp end={reactionCounts.dissatisfied} />
                              </IconButton>
                            </Grid>
                            <Grid item xs={3} sm={3}>
                              <IconButton onClick={() => handleReaction(1)} disabled={!loggedIn}>
                                <SentimentSatisfied style={{ color: userReaction && userReaction.value === 1 ? 'lightgreen' : 'grey' }} />
                                <CountUp end={reactionCounts.satisfied} />
                              </IconButton>
                            </Grid>
                            <Grid item xs={3} sm={3}>
                              <IconButton onClick={() => handleReaction(2)} disabled={!loggedIn}>
                                <SentimentVerySatisfied style={{ color: userReaction && userReaction.value === 2 ? 'green' : 'grey' }} />
                                <CountUp end={reactionCounts.verySatisfied} />
                              </IconButton> 
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                      <Grid container alignItems="flex-end" justifyContent="flex-end">
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="body2" color="textSecondary">
                            {channel?.name?.startsWith('__direct__') ? 'Sent' : 'Posted'} {displayDate}
                          </Typography>
                          {channel?.name && !channel.name.startsWith('__direct__') && (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <VisibilityIcon style={{ marginRight: '10px' }}/>
                              <Typography variant="body2" color="textSecondary">
                                {views || 0}
                              </Typography>
                            </div>
                          )}
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
)}