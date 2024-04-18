"use client"

import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import axios from 'axios';
import GoogleSeach from './GoogleSeach';
import { getGeocode, getLatLng } from 'use-places-autocomplete';

const API_KEY = "AIzaSyD-Lw8rPOFQaODCy2s4IN8aOa923JX6TsY"; // Правильный ключ API Google Maps

const GoogleMap = ({ markerPosition, setMarkerPosition }) => {
    const [search, setSearch] = useState('');
    const [timer, setTimer] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    // useEffect(() => {
    //     if (timer) {
    //         clearTimeout(timer);
    //     }

    //     if (search.length === 0) {
    //         setArtists([]); // Очистить список артистов, если строка поиска пуста
    //     } else {
    //         setTimer(setTimeout(() => {
    //             if (search) {
    //                 handleSearch();
    //             }
    //         }, 500)); // Задержка в 500 мс
    //     }

    //     // Очистка таймера при размонтировании компонента
    //     return () => {
    //         if (timer) {
    //             clearTimeout(timer);
    //         }
    //     };
    // }, [search]);



    const handleMapClick = async (event) => {
        const { lat, lng } = event.detail.latLng;


        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
            );
            console
            if (response.data.results.length > 0) {
                console.log('Place information:', response.data);
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

    const handleMarkerClick = () => {
        setSelectedPlace(null); // Удаляем маркер
    };

    return (
        <APIProvider apiKey={API_KEY}>
            <Map
                style={{ width: '100%', height: '400px' }}
                defaultCenter={{ lat: 22.54992, lng: 0 }}
                defaultZoom={3}
                gestureHandling={'greedy'}
                disableDefaultUI={true}
                onClick={handleMapClick}
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
            <GoogleSeach search={search} setSearch={setSearch} />
            {/* <Input className="mt-2" onChange={(e) => setSearch(e.target.value)} /> */}
        </APIProvider>
    );
};

export default GoogleMap;
