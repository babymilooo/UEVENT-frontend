"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/MyCarousel"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { useRouter } from "next/navigation";
import axios from "axios";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Event = ({ org, eventData }) => {
    const [event, setEvent] = useState(eventData);
    const [organization, setOrganization] = useState(org);
    const [position, setPosition] = useState({ lat: parseFloat(organization.location.latitude), lng: parseFloat(organization.location.longitude) });
    const [address, setAddress] = useState("");
    const router = useRouter();

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const eventDate = new Date(event.date);
    const month = months[eventDate.getMonth()];
    const dayOfWeek = days[eventDate.getDay()];
    const dayOfMonth = eventDate.getDate();

    useEffect(() => {
        console.log(event);
        console.log(organization);
    }
        , [event, organization]);

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

    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col items-center overflow-x-hidden pt-14">
            <div className="relative flex h-[360px] w-full items-end bg-cover bg-center select-none overflow-hidden"
                style={{ backgroundImage: `url('${event.picture ? event.picture : "/gradient.jpeg"}` }}>
                <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                <p className="relative mb-[50px] ml-6 font-bold xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-xl text-white z-10">{event.name}</p>
            </div>
            <div className="relative w-full p-6 mt-[-35px] bg-background z-30 rounded-[40px]">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={organization.logo} alt="@avatar" className="w-[50px]" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="font-bold cursor-pointer"
                        onClick={() => (router.push(`/organizations/${organization._id}`))}>
                        {organization.name}
                    </div>
                    {organization.isVerified && <div className="hidden ipad:flex items-center none">
                        <Image src="/verified.svg" alt="verified" width={20} height={20} />
                        <div className="text-primary">Verified</div>
                    </div>}
                </div>
                <div className="mt-4">
                    <div className="font-bold text-xl">{address}</div>
                    <div className=" text-neutral-400">{dayOfWeek}, {month} {dayOfMonth}, {event.time}</div>
                </div>
                <div className='mt-14 flex flex-col'>
                    <p className="font-bold text-xl">Buy ticket</p>
                    <div className="flex flex-col ipad:flex-row  gap-7 mt-2">
                        {/* <Card className="xl:w-1/3 w-full">
                            <CardTitle className="font-bold text-lg p-1 pl-4 bg-neutral-200 rounded-t-md">VIP ticket</CardTitle>
                            <CardContent className="mt-4">
                                <p className="font-bold text-xl">Access to the VIP area</p>
                                <div className="flex items-center justify-end">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="font-bold text-lg">$100</div>
                                        <button className=" bg-lime-400 px-6 py-3 rounded-3xl font-bold text-xs mt-2">
                                            buy now
                                        </button>
                                    </div>
                                </div>
                                <p className="font-bold text-neutral-400">total ended: 34 </p>
                            </CardContent>
                        </Card>
                        <Card className="xl:w-1/3 w-full">
                            <CardTitle className="font-bold text-lg p-1 pl-4 bg-neutral-200 rounded-t-md">Default ticket</CardTitle>
                            <CardContent className="mt-4">
                                <p className="font-bold text-xl">Access to the common area</p>
                                <div className="flex items-center justify-end">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="font-bold text-lg">$50</div>
                                        <button className=" bg-lime-400 px-6 py-3 rounded-3xl font-bold text-xs mt-2">
                                            buy now
                                        </button>
                                    </div>
                                </div>
                                <p className="font-bold text-neutral-400">total ended: 156 </p>
                            </CardContent>
                        </Card> */}
                        {/* {event.tickets.map((ticket, index) => (
                            <div key={index}>
                                <div className='relative'>
                                    <img src="/ticket.png" alt="ticket" className='w-full h-[150px] rounded-lg' />
                                    <div className="absolute inset-0 bg-white ml-6 mr-7 my-6 rounded-md">
                                        <div className="rounded-lg grid grid-cols-3 gap-4 h-full">
                                            <div className='col-span-1 flex flex-col justify-between pb-2 pt-2 pl-2'>
                                                <h1 className="text-lg font-bold col-span-1 justify-center flex h-full items-center pb-2 ">Ticket {index + 1}</h1>
                                                <Input
                                                    className=''
                                                    onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                                                    placeholder={`quantity`} />
                                            </div>

                                            <div className='col-span-2 flex flex-col gap-2 pt-2 pr-2'>
                                                <Input onChange={(e) => handleTicketChange(index, 'name', e.target.value)} placeholder={`Enter name`} />
                                                <Input
                                                    onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                                                    placeholder={`Enter price $`} />

                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))} */}
                    </div>
                </div>
                <div className="flex flex-col mt-14">
                    <p className="font-bold text-xl mb-2">Who is performing</p>
                    <Carousel
                        plugins={[
                            Autoplay({
                                delay: 5000,
                                reset: 1000
                            }),
                        ]}
                        opts={{
                            align: "start",
                        }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {Array.from({ length: 20 }).map((_, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/6">
                                    <div className="p-1">
                                        <Card className="relative flex w-full items-start bg-cover bg-center select-none overflow-hidden h-[245px]"
                                            style={{
                                                backgroundImage: `url('/concert.webp')`,
                                            }}>
                                            <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                                            <p className="absolute bottom-0 mb-2 ml-6 font-bold text-xl text-white z-10">Playboi Carti</p>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>
        </div>
    );
};

export default Event;