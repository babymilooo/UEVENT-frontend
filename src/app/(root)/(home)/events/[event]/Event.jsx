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
import ArtistService from "@/service/artistService";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const Event = ({ org, eventData }) => {
    const [event, setEvent] = useState(eventData);
    const [organization, setOrganization] = useState(org);
    // const [position, setPosition] = useState({ lat: parseFloat(event.location.latitude), lng: parseFloat(event.location.longitude) });
    const [address, setAddress] = useState(event.location.address);
    const router = useRouter();
    const [artistsInfo, setArtistsInfo] = useState([]);
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const eventDate = new Date(event.date);
    const month = months[eventDate.getMonth()];
    const dayOfWeek = days[eventDate.getDay()];
    const dayOfMonth = eventDate.getDate();


    useEffect(() => {
        const loadArtistsInfo = async () => {
            try {
                const response = await ArtistService.getArtists(event.artists);
                if (response.data.length > 0) {
                    setArtistsInfo(response.data.map((artist) => {
                        return {
                            artist: artist.name,
                            id: artist.id,
                            image: artist.images[1]?.url,
                        };
                    }));
                }

            } catch (error) {
                console.error("Ошибка при загрузке информации об исполнителях:", error);
                // Обработка ошибок
            }
        };

        if (event.artists.length > 0) {
            loadArtistsInfo();
        }

    }, [event]);


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
                {
                    event.ticketOptions && event.ticketOptions.length > 0 &&
                    <div className='mt-14 flex flex-col'>
                        <p className="font-bold text-xl">Buy ticket</p>
                        <div className="flex flex-row  gap-7 mt-2">
                            <div className="hidden ipad:flex flex-wrap items-center w-full">
                                {event.ticketOptions.map((ticket, index) => (
                                    <div key={index}>
                                        <div className='relative select-none'>
                                            <img src="/ticket.png" alt="ticket" className='w-[500px] h-[200px] rounded-lg' />
                                            <div className="absolute inset-0  ml-6 mr-36 my-6 rounded-md w-[350px] h-[150px]">
                                                <div className="rounded-lg grid grid-cols-2 gap-4 h-full bg-white">
                                                    <div className='col-span-1 flex flex-col pb-2 pt-2 pl-2 h-full items-center justify-center'>
                                                        <h1 className="text-3xl font-bold col-span-1 justify-center flexpb-2">{ticket.name}</h1>
                                                        <p className="text-muted-foreground">
                                                            tickets left: {ticket.quantity}
                                                        </p>
                                                    </div>

                                                    <div className='col-span-1 flex flex-col items-center justify-center'>
                                                        <p className="text-xl font-bold">{ticket.price / 100}$</p>
                                                        <button className="bg-lime-400 px-6 py-3 rounded-3xl font-bold text-xs mt-2" type="button" onClick={() => router.push(`/checkout/${ticket._id}`)}>
                                                            buy now
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="absolute top-12 right-[-140px] rounded-md px-3 py-1 -rotate-90 ">
                                                    <p className="text-5xl font-bold text-lime-700">ucode</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="ipad:hidden flex flex-wrap justify-center items-center w-full">
                                {event.ticketOptions.map((ticket, index) => (
                                    <div key={index} className="relative select-none w-[200px] h-[450px] col-span-1">
                                        <div className="absolute inset-0 flex items-center justify-center ">
                                            <img src="/ticket-rotated.png" alt="ticket" className='w-full h-full rounded-lg' />
                                        </div>
                                        <div className="absolute inset-0 ml-6 mr-36 my-6 rounded-md w-[153px] h-[300px]">
                                            <div className="rounded-lg flex flex-col justify-between py-4 h-full w-full bg-white">
                                                <div className="justify-center items-center flex flex-col w-full pb-2">
                                                    <h1 className="text-3xl font-bold">{ticket.name}</h1>
                                                    <p className="text-muted-foreground">
                                                        tickets left: {ticket.quantity}
                                                    </p>
                                                </div>
                                                <div className='col-span-1 flex flex-col items-center justify-center'>
                                                    <p className="text-xl font-bold">{ticket.price / 100}$</p>
                                                    <button className="bg-lime-400 px-6 py-3 rounded-3xl font-bold text-xs mt-2">
                                                        buy now
                                                    </button>
                                                </div>


                                            </div>

                                        </div>
                                        <div className="absolute bottom-8 ml-[15px] rounded-md px-3 py-1 ">
                                            <p className="text-5xl font-bold text-lime-700">ucode</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }
                {
                    artistsInfo.length > 0 &&
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
                                {artistsInfo.map((artist, index) => (
                                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/6">
                                        <div className="p-1">
                                            <Card className="relative flex w-full items-start bg-cover bg-center select-none overflow-hidden h-[245px] cursor-pointer"
                                                style={{
                                                    backgroundImage: `url('${artist.image ? artist.image : "/concert.webp"}')`,
                                                }}
                                                onClick={() => (router.push(`/artist/${artist.id}`))}>
                                                <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                                                <p className="absolute bottom-0 mb-2 ml-6 font-bold text-xl text-white z-10">{artist.artist}</p>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            {artistsInfo.length > 2 && (
                                <>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </>
                            )}
                        </Carousel>
                    </div>

                }
            </div>
        </div>
    );
};

export default Event;
