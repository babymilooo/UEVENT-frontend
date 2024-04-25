import React from "react";

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
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import MapHandler from '@/components/googlemap/map-handler';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export function RightBar({
    isVerified,
    selectedPlace,
    organization
}) {
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
                <div className="font-bold">
                    {organization.name}
                </div>

                {isVerified && <div className="hidden ipad:flex items-center none">
                    <Image src="/verified.svg" alt="verified" width={20} height={20} />
                    <div className="text-primary">Verified</div>
                </div>}
            </div>
            <div className="mt-4">
                <div className="font-bold text-lg">Hard Rock Stadium, Miami Gardens, US</div>
                <p className="font-bold mt-4 text-sm">
                    About us
                </p>
                <p className=' text-muted-foreground text-sm'>
                    {organization.description}
                </p>
                <div>
                    <APIProvider apiKey={API_KEY}>
                        <Map className='w-full h-[450px]' defaultCenter={{
                            lat: selectedPlace.latitude,
                            lng: selectedPlace.longitude
                        }} defaultZoom={1} gestureHandling={'greedy'} disableDefaultUI={true}>

                            {selectedPlace && <div style={{
                                position: 'absolute',
                                top: 10,
                                left: 10,
                                background: 'white',
                                padding: 10
                            }}>
                                <p>{selectedPlace.address}</p>
                            </div>}
                        </Map>

                        <MapHandler place={selectedPlace} />
                    </APIProvider>
                </div>
                <p className="font-bold mt-4 mb-2 text-sm">
                    Events
                </p>
                {Array.from({
                    length: 3
                }).map((_, index) => <Card key={index} className="relative flex w-full items-end bg-cover bg-center select-none overflow-hidden h-[80px] mb-1" style={{
                    backgroundImage: `url('/rolingLoud.webp')`
                }}>
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <CardContent className="flex items-center h-full w-full">
                        <div className="bg-neutral-800 w-[75px] rounded-md h-full flex ">
                            <div className="flex flex-col items-center justify-center w-full h-full z-10">
                                <p className="font-bold text-white">May</p>
                                <p className="text-4xl font-bold text-white">18</p>

                            </div>
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm font-bold ml-2 text-white z-10">Location</p>
                            <p className="text-sm font-bold ml-2 text-white z-10">Name</p>
                            <p className="text-sm font-bold ml-2 text-white z-10">Mon. 17:00</p>
                        </div>
                    </CardContent>
                </Card>)}
            </div>
        </div>
    </ScrollArea>;
}
