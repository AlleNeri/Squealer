import React, { useEffect, useRef, useContext, useState } from 'react';
import { Card, CardContent, Divider, Typography, IconButton, Grid } from '@material-ui/core';
import L, {Icon} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { SentimentVeryDissatisfied, SentimentDissatisfied, SentimentSatisfied, SentimentVerySatisfied } from '@material-ui/icons';
import { LoginContext } from '../../context/LoginContext/LoginContext';
import CountUp from 'react-countup';

export default function Post({post}) {
    const {title, content, keywords, reactions} = post;
    const mapRef = useRef(); // Assign useRef to a variable
    const token = localStorage.getItem('token');
    const { loggedIn } = useContext(LoginContext);
    const views = reactions.filter(reaction => reaction.value === 0).length;
    const [reactionCounts, setReactionCounts] = useState({
        veryDissatisfied: reactions.filter(reaction => reaction.value === -2).length,
        dissatisfied: reactions.filter(reaction => reaction.value === -1).length,
        satisfied: reactions.filter(reaction => reaction.value === 1).length,
        verySatisfied: reactions.filter(reaction => reaction.value === 2).length,
    });
    const userID = localStorage.getItem('userId');
    const userReaction = post.reactions.find(reaction => reaction.user_id === userID);
/*
    useEffect(() => {
        const visualizePost = async () => {
          try {
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
      
          } catch (error) {
            console.error(error);
          }
        };
      
        if (loggedIn) {
          visualizePost();
        }
    }, []);
    */
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
        try {
          const response = await fetch(`${import.meta.env.VITE_DEFAULT_URL}/posts/${post._id}/react`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            },
            body: JSON.stringify({ reaction })
          });
      
          if (!response.ok) {
            console.log(response);
            throw new Error('Error reacting to post');
          }
          setReactionCounts(prevCounts => ({
            ...prevCounts,
            [reaction]: prevCounts[reaction] + 1,
          }));
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error('Error reacting to post', error);
        }
      };

    return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Card style={{ margin: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px', width:'600px' }}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {title}
                </Typography>
                <Divider style={{ margin: '20px 0' }} />
                {content && content.text ?
                    <Typography variant="body2" component="p">
                        {content.text}
                    </Typography>
                    : <p></p>
                }
                {content && content.position && <div ref={mapRef} style={{ height: '500px', width: '100%', zIndex: 500 }}></div>}
                {content && content.img && <img src={`${import.meta.env.VITE_DEFAULT_URL}/media/image/${content.img}`} alt="description" width="100%" height="500px" />}
                <Divider style={{ margin: '20px 0' }} />
                <Typography variant="body2" component="p">
                    {keywords && keywords.join(', ')}
                </Typography>
                <Divider style={{ margin: '20px 0' }} />
                <Grid container justify="space-between">
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
                    {/*
                    <Grid item>
                        <Typography variant="body2" color="textSecondary">
                            Views: {views}
                        </Typography>
                    </Grid>
                    */}
                </Grid>
            </CardContent>
        </Card>
    </div>
    );
}