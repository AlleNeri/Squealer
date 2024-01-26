import React, { useEffect, useRef, useContext } from 'react';
import { Card, CardContent, Divider, Typography, IconButton } from '@material-ui/core';
import L, {Icon} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { SentimentVeryDissatisfied, SentimentDissatisfied, SentimentSatisfied, SentimentVerySatisfied } from '@material-ui/icons';
import { LoginContext } from '../../context/LoginContext/LoginContext';

export default function Post({post}) {
    const {title, content, keywords} = post;
    const mapRef = useRef(); // Assign useRef to a variable
    const token = localStorage.getItem('token');
    const { loggedIn } = useContext(LoginContext);

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
                <IconButton onClick={() => handleReaction(-2)} disabled={!loggedIn}><SentimentVeryDissatisfied /></IconButton>
                <IconButton onClick={() => handleReaction(-1)} disabled={!loggedIn}><SentimentDissatisfied /></IconButton>
                <IconButton onClick={() => handleReaction(1)} disabled={!loggedIn}><SentimentSatisfied /></IconButton>
                <IconButton onClick={() => handleReaction(2)} disabled={!loggedIn}><SentimentVerySatisfied /></IconButton>
            </CardContent>
        </Card>
    </div>
    );
}