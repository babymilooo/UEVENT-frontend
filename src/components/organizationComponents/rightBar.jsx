import React, { use, useEffect, useState } from "react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Image from 'next/image';

import {
    Card,
    CardContent,

} from "@/components/ui/card"

import { ScrollArea } from '@/components/ui/scroll-area';
import { APIProvider, Marker, Map } from '@vis.gl/react-google-maps';
import MapHandler from '@/components/googlemap/map-handler';
import axios from "axios";
import { useRouter } from "next/navigation";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export function RightBar({
    isVerified,
    organization,
    events
}) {
    const [selectedPlace, setSelectedPlace] = useState(organization.location);
    const [position, setPosition] = useState({ lat: parseFloat(selectedPlace.latitude), lng: parseFloat(selectedPlace.longitude) });
    const [address, setAddress] = useState("");
    const router = useRouter();
    useEffect(() => {
        setSelectedPlace(organization.location);
    }, [organization]);

    useEffect(() => {
        // Обновляем position при изменении selectedPlace или organization
        setPosition({
            lat: parseFloat(selectedPlace.latitude),
            lng: parseFloat(selectedPlace.longitude)
        });
    }, [selectedPlace]);

    useEffect(() => {
        const fetchData = async () => {
            const { lat, lng } = position;
            let address = '';
            let city = '';
            let country = '';
            let street = '';
            let route = '';
            try {
                const response = await axios.get(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`
                );
                if (response.data.results.length > 0) {
                    const placeInfo = response.data.results[0];

                    placeInfo.address_components.forEach((component) => {
                        const types = component.types;
                        const shortName = component.short_name;

                        // Check types and assign short names accordingly
                        if (types.includes('locality')) {
                            city = shortName;
                        } else if (types.includes('country')) {
                            country = shortName;
                        } else if (types.includes('route')) {
                            route = shortName;
                        } else if (types.includes('street_number')) {
                            street = shortName;
                        }
                        // Add additional checks for other types if needed
                    });

                    address = `${route} ${street}, ${city}, ${country} `;

                    setAddress(address);
                }
            } catch (error) {
                console.error('Error fetching place information:', error);
            }
        };

        // Вызываем fetchData только при изменении organization
        if (organization) {
            fetchData();
        }
    }, [position]);

    return <ScrollArea className="h-full w-full rounded-md border lg:pb-12">
        <div className="relative flex h-[360px] w-full items-end bg-cover bg-center select-none rounded-t-md" style={{
            backgroundImage: `url('${organization.picture ? organization.picture : "/gradient.jpeg"}')`
        }}>
            <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
        </div>
        <div className="relative w-full p-6 mt-[-35px] bg-background z-30 rounded-[40px]">
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={organization.logo ? organization.logo : "/BigLogo.png"} alt="@avatar" className="w-[50px]" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="font-bold hover:underline cursor-pointer" onClick={() => (router.push(`/organizations/${organization._id}`))}>
                    {organization.name}
                </div>

                {isVerified && <div className="hidden ipad:flex items-center none">
                    <Image src="/verified.svg" alt="verified" width={20} height={20} />
                    <div className="text-primary">Verified</div>
                </div>}
            </div>
            <div className="mt-4">
                <p className="font-bold mt-4 text-sm">
                    About us
                </p>
                <p className=' text-muted-foreground text-sm'>
                    {organization.description}
                </p>
                <div className="font-bold">{address}</div>
                <div className="w-full">
                    <APIProvider apiKey={API_KEY}>
                        <Map className='w-full h-[350px]'
                            center={position}
                            defaultZoom={15}
                            gestureHandling={'greedy'}
                            disableDefaultUI={true}>
                            <Marker position={position} />
                        </Map>

                        <MapHandler place={selectedPlace} />
                    </APIProvider>
                </div>
                <p className="font-bold mt-4 mb-2 text-sm">
                    Events
                </p>
                {events.map((event, index) => (<Card key={index} className="relative flex w-full items-end bg-cover bg-center select-none overflow-hidden h-[80px] mb-1" style={{
                    backgroundImage: `url('${event.picture ? event.picture : "/gradient.jpeg"}`
                }}>
                    <div className="absolute inset-0 bg-black opacity-60"></div>
                    <CardContent className="flex items-center h-full w-full">
                        <div className="bg-neutral-800 w-[75px] rounded-md h-full flex ">
                            <div className="flex flex-col items-center justify-center w-full h-full z-10">
                                <p className="font-bold text-white">{event.month}</p>
                                <p className="text-4xl font-bold text-white">{event.dayOfMonth}</p>

                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[10px] font-bold ml-2 text-white z-10">{event.address}</p>
                            <p className="text-[12px] font-bold ml-2 text-white z-10">{event.name}</p>
                            <p className="text-[12px] font-bold ml-2 text-white z-10">{event.dayOfWeek} {event.time}</p>
                        </div>
                    </CardContent>
                </Card>))}
            </div>
        </div>
    </ScrollArea>;
}
