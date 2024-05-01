import React, { useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Image from 'next/image';


const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

import { APIProvider, Marker, Map } from '@vis.gl/react-google-maps';
import MapHandler from '@/components/googlemap/map-handler';
import EditDialog from './edit';

const Main = ({ eventData, org, setEventData }) => {
    const [position, setPosition] = useState({ lat: parseFloat(eventData.location.latitude), lng: parseFloat(eventData.location.longitude) });

    return (
        <>
            <div className="relative flex h-[560px] w-full items-end bg-cover bg-center select-none overflow-hidden rounded-t-md"
                style={{ backgroundImage: `url('${eventData.picture ? eventData.picture : "/gradient.jpeg"}')` }}>
                <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                <div className="relative  ml-6  text-white w-full mr-5">
                    <div className='flex justify-between'>
                        <p className="font-bold xl:text-5xl lg:text-4xl ipad:text-3xl phone:text-xl mb-[20px]">Manage your event</p>
                        <div className="flex">
                            <EditDialog eventData={eventData} setEventData={setEventData} />
                            <Sheet className="">
                                <SheetTrigger className="text-white xl:hidden block">Open</SheetTrigger>
                                <SheetContent className="w-full">
                                    <div className="fixed h-full right-0 sm:max-w-sm w-full">
                                        <div className="bg-background h-full rounded-md">
                                            <ScrollArea className="h-full w-full rounded-md border lg:pb-12">
                                                <div className="relative flex h-[360px] w-full items-end bg-cover bg-center select-none rounded-t-md" style={{
                                                    backgroundImage: `url('${eventData.picture ? eventData.picture : "/gradient.jpeg"}')`
                                                }}>
                                                    <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                                                    <p className="relative mb-[40px] ml-6 font-bold xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-xl text-white z-10">{eventData.name}</p>
                                                </div>
                                                <div className="relative w-full p-6 mt-[-35px] bg-background z-30 rounded-[40px]">
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
                                                            About event
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
                                            </ScrollArea>;
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                </div>
            </div>


        </>

    );
};

export default Main;