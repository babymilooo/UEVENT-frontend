import React, { useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
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
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

import { APIProvider, Marker, Map } from '@vis.gl/react-google-maps';
import MapHandler from '@/components/googlemap/map-handler';
import { useRouter } from 'next/navigation';
const RightBar = ({ eventData, org }) => {

    const [position, setPosition] = useState({ lat: parseFloat(eventData.location.latitude), lng: parseFloat(eventData.location.longitude) });
    const router = useRouter();
    return (
        <ScrollArea className="h-full w-full rounded-md border lg:pb-12 z-50">
            <div className="relative flex h-[360px] w-full items-end bg-cover bg-center select-none rounded-t-md cursor-pointer" style={{
                backgroundImage: `url('${eventData.picture ? eventData.picture : "/gradient.jpeg"}')`
            }}
            onClick={() => (router.push(`/events/${eventData._id}`))}>
                <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                <p className="relative mb-[40px] ml-6 font-bold text-xl text-white z-10 hover:underline ">{eventData.name}</p>
            </div>
            <div className="relative w-full p-6 mt-[-35px] bg-background z-40 rounded-[40px]">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={org.logo ? org.logo : "/BigLogo.png"} alt="@avatar" className="w-[50px]" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="font-bold hover:underline cursor-pointer" onClick={() => (router.push(`/organizations/${org._id}`))}>
                        {org.name}
                    </div>

                    {org.isVerified && <div className="hidden ipad:flex items-center none">
                        <Image src="/verified.svg" alt="verified" width={20} height={20} />
                        <div className="text-primary">Verified</div>
                    </div>}
                </div>
                <div className="mt-4">
                    <p className="font-bold mt-4 text-sm">
                        About us
                    </p>
                    <p className=' text-muted-foreground text-sm'>
                        {eventData.description}
                    </p>
                    <div className="font-bold">{eventData.location.address}</div>
                    <div className="w-full">
                        <APIProvider apiKey={API_KEY}>
                            <Map className='w-full h-[350px]'
                                center={position}
                                defaultZoom={15}
                                gestureHandling={'greedy'}
                                disableDefaultUI={true}>
                                <Marker position={position} />
                            </Map>

                            <MapHandler place={eventData.location} />
                        </APIProvider>
                    </div>

                </div>
            </div>
        </ScrollArea>
    );
};

export default RightBar;