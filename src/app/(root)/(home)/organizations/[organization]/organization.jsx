"use client";

import React, { useEffect, useState } from 'react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    Card,
    CardContent,

} from "@/components/ui/card"


import Image from 'next/image';
import { useRouter } from 'next/navigation';
import fetchData from '@/lib/proccessEvents';
import positionOrg from '@/lib/positionOrg';

import { APIProvider, Marker, Map } from '@vis.gl/react-google-maps';
import MapHandler from '@/components/googlemap/map-handler';
const Render = ({ res, eventsData }) => {
    const [organization, setOrganization] = useState(res);
    const [events, setEvents] = useState(eventsData);
    const [loading, setLoading] = useState(true);
    const [position, setPosition] = useState({ lat: parseFloat(organization.location.latitude), lng: parseFloat(organization.location.longitude) });
    const [address, setAddress] = useState("");

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const isVerified = organization.isVerified;

    const router = useRouter();

    useEffect(() => {
        if (events.length > 0) {
            fetchData(events, setEvents);
        }
        setLoading(false);
    }
        , []);

    useEffect(() => {
        console.log(events);
        console.log(organization);

    }, [events, organization]);

    useEffect(() => {
        if (organization) {
            positionOrg(position, setAddress);
        }
    }, [position]);

    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col items-center overflow-x-hidden pt-14 select-none">
            <div className="relative flex h-[360px] w-full items-end bg-cover bg-center select-none overflow-hidden"
                style={{
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
                    <div className="font-bold">
                        {organization.name}
                    </div>

                    {isVerified && <div className="hidden ipad:flex items-center none">
                        <Image src="/verified.svg" alt="verified" width={20} height={20} />
                        <div className="text-primary">Verified</div>
                    </div>}
                </div>
                <div className='grid grid-cols-4'>
                    <div className='col-span-3 pr-8'>
                        <p className="font-bold mt-4 mb-2 text-sm">
                            Events
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                            {events.map((event, index) => (<Card key={index} className="relative flex w-full items-end bg-cover bg-center select-none overflow-hidden h-[80px] mb-1 cursor-pointer"
                                style={{ backgroundImage: `url('${event.picture ? event.picture : "/gradient.jpeg"}` }}
                                onClick={() => (router.push(`/events/${event._id}`))}
                            >
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
                    <div className="mt-4 col-span-1">
                        <div className="font-bold mb-4">{address}</div>
                        <div className="w-full">
                            <APIProvider apiKey={API_KEY}>
                                <Map className='w-full h-[350px]'
                                    center={position}
                                    defaultZoom={15}
                                    gestureHandling={'greedy'}
                                    disableDefaultUI={true}>
                                    <Marker position={position} />
                                </Map>

                                <MapHandler place={organization.location} />
                            </APIProvider>
                        </div>
                        <p className="font-bold mt-4 text-sm">
                            About us
                        </p>
                        <p className=' text-muted-foreground text-sm'>
                            {organization.description}
                        </p>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Render;