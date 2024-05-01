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

    const [position, setPosition] = useState({ lat: 37.7749, lng: -122.4194 });
    const [zoom, setZoom] = useState(3);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (selectedPlace && selectedPlace.latLng) {
            setPosition({ lat: parseFloat(selectedPlace.latLng?.lat), lng: parseFloat(selectedPlace.latLng?.lng) });
            setZoom(15);
        }
        setLoading(false);
    }
        , [selectedPlace]);

    const handleMapClick = async (event) => {
        const { lat, lng } = event.detail.latLng;
        let countryCode;
        let address;

        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
            );
            if (response.data.results.length > 0) {
                const placeInfo = response.data.results[0];
                for (let component of placeInfo.address_components) {
                    if (component.types.includes('country')) {
                        // Получение ISO-кода страны (например, "US" для США)
                        countryCode = component.short_name;
                        break;
                    }
                }
                const { city, country, route, street_number } = placeInfo.address_components.reduce(
                    (acc, component) => {
                        if (component.types.includes('locality')) acc.city = component.short_name;
                        if (component.types.includes('country')) acc.country = component.short_name;
                        if (component.types.includes('route')) acc.route = component.short_name;
                        if (component.types.includes('street_number')) acc.street_number = component.short_name;
                        return acc;
                    },
                    {}
                );

                if (route && street_number) {
                    address = `${route} ${street_number}, ${city}, ${country}`;
                } else if (route || street_number) {
                    address = `${route || street_number}, ${city}, ${country}`;
                } else {
                    address = `${city}, ${country}`;
                }
                setSelectedPlace({
                    latLng: { lat, lng },
                    address: address,
                    countryCode: countryCode,
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
            const latLng = { lat: location.lat(), lng: location.lng() };

            setSelectedPlace({ latLng, address: formatted_address });
        }
    }, [selectedPlace]);


    const handleMarkerClick = () => {
        setSelectedPlace(null); // Удаляем маркер
    };

    return (
        <>
            {
                loading ? <div>Loading...</div> :
                    <APIProvider apiKey={API_KEY}>
                        <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
                        <Map
                            // style={{ width: '500px', height: '500px' }}
                            className='w-full h-[450px]'
                            defaultCenter={position}
                            defaultZoom={zoom}
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
            }
        </>
    );
};

export default App;
