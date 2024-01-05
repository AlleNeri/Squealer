import React, { useEffect, useRef } from 'react';

function MapComponent({ position }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (position && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: position.latitude, lng: position.longitude },
        zoom: 14,
      });

      new google.maps.Marker({
        position: { lat: position.latitude, lng: position.longitude },
        map,
      });
    }
  }, [position]);

  return <div ref={mapRef} style={{ height: "400px", width: "100%" }}></div>;
}

export default MapComponent;