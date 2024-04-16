import { APIProvider, Map } from '@vis.gl/react-google-maps';
import React from 'react';

const API_KEY = "AIzaSyD-Lw8rPOFQaODCy2s4IN8aOa923JX6TsY"; // Правильный ключ API Google Maps

const GoogleMap = () => {
    return (
        <APIProvider apiKey={API_KEY}>
            <Map
                style={{ width: '100%', height: '500px' }}
                defaultCenter={{ lat: 22.54992, lng: 0 }}
                defaultZoom={3}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
            />
        </APIProvider>
    );
};

export default GoogleMap;
