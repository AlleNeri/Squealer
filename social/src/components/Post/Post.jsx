import React, { useEffect, useRef } from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import L, {Icon} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"

export default function Post({post}) {
    const {title, content, keywords} = post;
    const mapRef = useRef();

    useEffect(() => {
        if(content.position){
            if (!mapRef.current) return;
            // If the map was already initialized, return early
            if (mapRef.current.leafletElement) return;
        
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
    }, [post]);

    return (
        <Card style={{ margin: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px', width:'500px' }}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {title}
                </Typography>
                {content.text &&
                    <Typography variant="body2" component="p">
                        {content.text}
                    </Typography>
                }
                {content.position && <div ref={mapRef} style={{ height: '500px', width: '100%', zIndex: 500 }}></div>}
                {content.img && <img src={`http://localhost:8080/media/${content.img}`} alt="description" width="100%" height="500px" />}
                <Typography variant="body2" component="p">
                    {keywords.join(', ')}
                </Typography>
            </CardContent>
        </Card>
    );
}