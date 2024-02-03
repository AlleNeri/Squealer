import React, { useEffect, useRef, useContext, useState } from 'react';
import { Card, CardContent, Divider, Typography, IconButton, Grid, Avatar } from '@material-ui/core';
import L, {Icon} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { SentimentVeryDissatisfied, SentimentDissatisfied, SentimentSatisfied, SentimentVerySatisfied } from '@material-ui/icons';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CountUp from 'react-countup';
import {Link} from 'react-router-dom';

export default function Post({post}) {
    const {title, content, keywords, reactions, posted_by} = post;
    const [user, setUser] = useState(null);
    const mapRef = useRef(); // Assign useRef to a variable
    const token = localStorage.getItem('token');
    const { loggedIn } = useContext(LoginContext);
    const views = reactions.filter(reaction => [-2, -1, 0, 1, 2].includes(reaction.value)).length;
    const [reactionCounts, setReactionCounts] = useState({
        veryDissatisfied: reactions.filter(reaction => reaction.value === -2).length,
        dissatisfied: reactions.filter(reaction => reaction.value === -1).length,
        satisfied: reactions.filter(reaction => reaction.value === 1).length,
        verySatisfied: reactions.filter(reaction => reaction.value === 2).length,
    });
    const userID = localStorage.getItem('userId');
    const [userReaction, setUserReaction] = useState(post.reactions.find(reaction => reaction.user_id === userID));
    if(!loggedIn) { localStorage.removeItem('userId'); }
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => {
      const visualizePost = async () => {
        try {
          // Check if the user has already reacted to the post
          const userReaction = post.reactions.find(reaction => reaction.user_id === userID);
          if (!userReaction) {
            // Add a view to the post
            const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/posts/${post._id}/visualize`, {
              method: 'PATCH',
              headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
              },
            });
      
            if (!response.ok) {
              throw new Error('There was a problem visualizing the post');
            }
          }
  
        } catch (error) {
          console.error(error);
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

  function replaceMentionsWithLinks(text) {
    if(!text) return [];
    // Dividi il testo in parti utilizzando la menzione come separatore
    const parts = text.split(/(@\[[^\]]+\]\([^)]+\))/g);
  
    // Mappa ogni parte in un elemento React
    return parts.map((part, i) => {
      // Se la parte è una menzione, sostituiscila con un link
      const match = part.match(/@\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        return (
          <Link to={`/profile/${match[2]}`} key={i}>
            @{match[1]}
          </Link>
        );
      }
  
      // Altrimenti, restituisci la parte come testo
      return part;
    });
  }

  const replacedText = replaceMentionsWithLinks(content.text);
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
              const map = L.map(mapRef.current).setView([content.position.latitude, content.position.longitude], 13);
      
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

    return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card style={{ margin: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px', width: isMobile ? '100%' : '600px' }}>
            <CardContent>
                <div>
                <Grid container justifyContent="space-between">
                  <Avatar alt="Profile" src={user && user.img ? `${import.meta.env.VITE_DEFAULT_URL}/media/image/${user.img}` : undefined} >
                      {user?.u_name.charAt(0).toUpperCase()}
                  </Avatar>
                </Grid>
                <Link to={`/Profile/${posted_by}`}>{user && user.u_name}</Link>
                </div>
                <Divider style={{ margin: '20px 0' }} />
                <Typography variant="h5" component="h2">
                    {title}
                </Typography>
                <Divider style={{ margin: '20px 0' }} />
                {content && content.text ?
                    <Typography variant="body2" component="p">
                        {replacedText}
                    </Typography>
                    : <p></p>
                }
                {content && content.position && <div ref={mapRef} style={{ height: '500px', width: '100%', zIndex: 500 }}></div>}
                {content && content.img && <img src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${content.img}`} alt="description" width="100%" height="500px" />}
                <Divider style={{ margin: '20px 0' }} />
                <Typography variant="body2" component="p">
                    {keywords && renderKeywords(keywords)}
                </Typography>
                <Divider style={{ margin: '20px 0' }} />
                <Grid container justifyContent="space-between">
                    <Grid item>
                      <IconButton onClick={() => handleReaction(-2)} disabled={!loggedIn}>
                          <SentimentVeryDissatisfied style={{ color: userReaction && userReaction.value === -2 ? 'red' : 'grey' }} />
                          <CountUp end={reactionCounts.veryDissatisfied} />
                      </IconButton>
                      <IconButton onClick={() => handleReaction(-1)} disabled={!loggedIn}>
                          <SentimentDissatisfied style={{ color: userReaction && userReaction.value === -1 ? 'orange' : 'grey' }} />
                          <CountUp end={reactionCounts.dissatisfied} />
                      </IconButton>
                      <IconButton onClick={() => handleReaction(1)} disabled={!loggedIn}>
                          <SentimentSatisfied style={{ color: userReaction && userReaction.value === 1 ? 'lightgreen' : 'grey' }} />
                          <CountUp end={reactionCounts.satisfied} />
                      </IconButton>
                      <IconButton onClick={() => handleReaction(2)} disabled={!loggedIn}>
                          <SentimentVerySatisfied style={{ color: userReaction && userReaction.value === 2 ? 'green' : 'grey' }} />
                          <CountUp end={reactionCounts.verySatisfied} />
                      </IconButton> 
                    </Grid>
                    {
                    <Grid item>
                        <Typography variant="body2" color="textSecondary">
                            Views: {views || 0}
                        </Typography>
                    </Grid>
                    }
                </Grid>
            </CardContent>
        </Card>
    </div>
    );
}