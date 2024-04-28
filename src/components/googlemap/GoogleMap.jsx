"use client"

import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import axios from 'axios';

import MapHandler from './map-handler';
import { PlaceAutocompleteClassic } from './GoogleSeach';

// const API_KEY = "AIzaSyD-Lw8rPOFQaODCy2s4IN8aOa923JX6TsY";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Используйте apiKey в вашем коде для доступа к ключу API

const App = ({ selectedPlace, setSelectedPlace }) => {

    const handleMapClick = async (event) => {
        const { lat, lng } = event.detail.latLng;


        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
            );
            console
            if (response.data.results.length > 0) {
                const placeInfo = response.data.results[0];
                setSelectedPlace({
                    latLng: { lat, lng },
                    address: placeInfo.formatted_address,
                    // Другие данные о месте, которые вы хотите отобразить
                });
            }
        } catch (error) {
            console.error('Error fetching place information:', error);
        }
    };

    useEffect(() => {
        if (selectedPlace && selectedPlace.geometry) {
            const { geometry, formatted_address } = selectedPlace;
            const { location } = geometry;
            const latLng = { latitude: location.lat(), longitude: location.lng() };

            setSelectedPlace({ latLng, address: formatted_address });
        }
    }, [selectedPlace]);


    const handleMarkerClick = () => {
        setSelectedPlace(null); // Удаляем маркер
    };

    return (
        <APIProvider apiKey={API_KEY}>
            <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
            <Map
                // style={{ width: '500px', height: '500px' }}
                className='w-full h-[450px]'
                defaultCenter={{ lat: 22.54992, lng: 0 }}
                defaultZoom={3}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                onClick={handleMapClick}
                language="en"

            >
                {selectedPlace && (
                    <Marker
                        position={selectedPlace.latLng}
                        title={selectedPlace.name}
                        onClick={handleMarkerClick} // Обработчик клика по маркеру
                    />
                )}
                {selectedPlace && (
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'white', padding: 10 }}>
                        <p>{selectedPlace.address}</p>
                        {/* Другие данные о месте, которые вы хотите отобразить */}
                    </div>
                )}
            </Map>


            <MapHandler place={selectedPlace} />
        </APIProvider>
    );
};

export default App;
