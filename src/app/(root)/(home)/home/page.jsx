"use client"
import React, { useContext, useEffect, useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/MyCarousel"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"


import { Card, CardContent } from "@/components/ui/card"
import Navbar from '@/components/navbar/Navbar';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import SideBar from '@/components/sidebar/SideBar';
import { Footer } from '@/components/footer/Footer';
import { useRouter } from 'next/navigation';
import { observer } from 'mobx-react-lite';
import { RootStoreContext } from '@/providers/rootStoreProvider';
import EventService from '@/service/eventService';
import { Skeleton } from "@/components/ui/skeleton"
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];

const page = observer(() => {
    const router = useRouter();
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [eventsArtists, setEventsArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUpcoming = async () => {
            const resp = await EventService.getUpcomingEvents();
            const updatedEvents = await Promise.all(
                resp.data.events.map(async (event) => {
                    const eventDate = new Date(event.date);
                    const month = months[eventDate.getMonth()];
                    const dayOfWeek = days[eventDate.getDay()];
                    const dayOfMonth = eventDate.getDate();

                    return {
                        ...event,
                        month,
                        dayOfWeek,
                        dayOfMonth,
                    };
                })
            );

            console.log(updatedEvents)
            setUpcomingEvents(updatedEvents);
        }
        const fetchEventsArtists = async () => {
            const resp = await EventService.getEventsArtists();
            const updatedEvents = await Promise.all(
                resp.data.map(async (event) => {
                    event.events = await Promise.all(
                        event.events.map(async (eventData) => {
                            const eventDate = new Date(eventData.date);
                            const month = months[eventDate.getMonth()];
                            const dayOfWeek = days[eventDate.getDay()];
                            const dayOfMonth = eventDate.getDate();
                            return {
                                ...eventData,
                                month,
                                dayOfWeek,
                                dayOfMonth,
                            };
                        })
                    );
                    return {
                        ...event,
                        events: event.events
                    };
                })
            );

            updatedEvents.sort((a, b) => {
                // Преобразуем даты в объекты Date для сравнения
                const dateA = new Date(a.events[0].date);
                const dateB = new Date(b.events[0].date);
                console.log(dateA, dateB);

                // Сравниваем даты
                if (dateA < dateB) {
                    return -1; // a идет перед b
                }
                if (dateA > dateB) {
                    return 1; // b идет перед a
                }
                return 0; // даты равны
            });

            setEventsArtists(updatedEvents);
            setLoading(false);
        }
        fetchEventsArtists();
        fetchUpcoming();
    }, [])

    useEffect(() => {
        console.log(eventsArtists)
    }
        , [eventsArtists])

    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex items-center overflow-x-hidden ">
            <div className="ipad:px-4 lg:px-8 w-full pt-16">
                <Carousel
                    plugins={[
                        Autoplay({
                            delay: 5000,
                            reset: 1000
                        }),
                    ]}>
                    <CarouselContent className="xl:h-[360px] lg:h-[260px] phone:h-[260px]">
                        <CarouselItem className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                            <div className="p-1 xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                <Card className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                    <CardContent className="flex p-6 h-full bg-cover bg-center rounded-md items-center select-none"
                                        style={{
                                            backgroundImage: `url('/carti.jpg')`,
                                        }}>
                                        <p className="font-bold xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-xl text-white">get tickets to the best <br /> concerts in the world</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                        <CarouselItem className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                            <div className="p-1 xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                <Card className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                    <CardContent className="flex p-6 h-full bg-cover bg-center rounded-md items-center select-none"
                                        style={{
                                            backgroundImage: `url('/artists.png')`,
                                        }}>
                                        <p className="font-bold xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-xl text-white">follow the performances<br />of your favorite artists</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                        <CarouselItem className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                            <div className="p-1 xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                <Card className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                    <CardContent className="flex h-full p-6 bg-cover bg-center rounded-md items-center justify-center select-none bg-lime-400">
                                        <p className="font-bold xl:text-5xl lg:text-4xl ipad:text-4xl phone:text-xl text-black ">Join our community</p>
                                        <Image src="/bigLogo.png" alt="Logo" height={40} width={1000} className='rounded-xl w-[40px] ipad:w-[100px]' />
                                        <Image src="/logoWord.png" alt="word" height={40} width={1000} className='rounded-xl w-[60px] ipad:w-[250px] hidden ipad:block' />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
                <p className="font-bold text-3xl p-4 select-none">Upcoming events in</p>
                <div className="grid ipad:grid-cols-2 grid-cols-1 p-1 gap-2 2xl:grid-cols-3 items-center">
                    {upcomingEvents?.map((event, index) => (

                        <Card key={index} className="relative flex col-span-1 items-end bg-cover bg-center select-none overflow-hidden h-[200px] mb-1 cursor-pointer"
                            style={{ backgroundImage: `url('${event.picture ? event.picture : "/gradient.jpeg"}` }}
                            onClick={() => (router.push(`/events/${event._id}`))}
                        >
                            <div className="absolute inset-0 bg-black opacity-60"></div>
                            <CardContent className="flex h-full w-full">
                                <div className="bg-neutral-800 w-[200px] rounded-md h-[200px] flex ">
                                    <div className="flex flex-col items-center justify-center w-full h-full z-10">
                                        <p className="font-bold text-5xl text-white">{event.month}</p>
                                        <p className="text-6xl font-bold text-white">{event.dayOfMonth}</p>

                                    </div>
                                </div>
                                <div className="flex flex-col justify-between">
                                    <p className=" font-bold ml-2 text-xl text-white mt-16 z-10">{event.name}</p>
                                    <div className='flex flex-col mb-8'>
                                        <p className="font-bold ml-2 text-white text-lg z-10 text-wrap">{event.location.address}</p>
                                        <p className=" font-bold ml-2 text-white z-10">{event.dayOfWeek} {event.time}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <p className="font-bold text-3xl p-4 plselect-none">Now in tour</p>
                {
                    !loading ? (
                        eventsArtists.length > 0 && (
                            eventsArtists.map((event, index) => (
                                <div key={index}>
                                    <div className='grid 2xl:grid-cols-6 xl:grid-cols-4 phone:grid-cols-1 ipad:grid-cols-3 gap-4 m-1 p-4'>
                                        <div key={index} className="flex flex-col col-span-1 rounded-md cursor-pointer px-4 items-center ipad:items-start" >

                                            <Image src={event.artist.images} alt='logo' height={50} width={200} className='rounded-md h-[200px]' />
                                            <div className='ipad:pl-5 flex-col'>
                                                {event.artist.followers > 5000 && (
                                                    <div className="flex items-center none mt-4">
                                                        <Image src="/verified.svg" alt="verified" width={20} height={20} />
                                                        <div className="text-primary">Verified</div>
                                                    </div>
                                                )}
                                                <h1 className='iphone:text-6xl text-2xl font-bold ipad:pt-0'>{event.artist.name}</h1>
                                                <div className='flex items-center ipad:justify-normal justify-between ipad:mt-4 mb-5 ipad:mb-0 gap-1 '>
                                                    <div className='flex items-center gap-1'>
                                                        <p className='text-lg font-bold'>{event.artist.followers.toLocaleString("en-US")}</p>
                                                        <p className='font-bold text-xs pt-1'>Followers</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='grid ipad:grid-cols-1 grid-cols-1 gap-2 2xl:grid-cols-3 items-center 2xl:col-span-5 xl:col-span-3 ipad:col-span-2'>
                                            {
                                                event.events.map((eventData, index) => (
                                                    <div key={index}>
                                                        <Card key={index} className="relative flex col-span-1 items-end bg-cover bg-center select-none overflow-hidden h-[150px] mb-1 cursor-pointer"
                                                            style={{ backgroundImage: `url('${eventData.picture ? eventData.picture : "/gradient.jpeg"}` }}
                                                            onClick={() => (router.push(`/events/${eventData._id}`))}
                                                        >
                                                            <div className="absolute inset-0 bg-black opacity-60"></div>
                                                            <CardContent className="flex h-full w-full">
                                                                <div className="bg-neutral-800 w-[150px] rounded-md h-[150px] flex ">
                                                                    <div className="flex flex-col items-center justify-center w-full h-full z-10">
                                                                        <p className="font-bold text-4xl text-white">{eventData.month}</p>
                                                                        <p className="text-5xl font-bold text-white">{eventData.dayOfMonth}</p>

                                                                    </div>
                                                                </div>
                                                                <div className="flex flex-col justify-between">
                                                                    <p className=" font-bold ml-2 text-xl text-white mt-10 z-10">{eventData.name}</p>
                                                                    <div className='flex flex-col mb-8'>
                                                                        <p className="font-bold ml-2 text-white text-xs z-10 text-wrap">{eventData.location.address}</p>
                                                                        <p className=" font-bold ml-2 text-white text-sm z-10">{eventData.dayOfWeek} {eventData.time}</p>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            )))) : (
                        Array.from({ length: 3 }).map((_, index) => (
                            <div className='grid 2xl:grid-cols-6 xl:grid-cols-4 phone:grid-cols-1 ipad:grid-cols-3 gap-4 m-1 p-4'>
                                <div key={index} className="flex flex-col col-span-1 rounded-md cursor-pointer px-4 items-center ipad:items-start" >

                                    <Skeleton className="h-[200px] w-[200px] rounded-xl" />
                                    <div className='flex-col'>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[200px] mt-4" />
                                            <Skeleton className="h-4 w-[200px] mt-4" />
                                            <Skeleton className="h-4 w-[200px] mt-4" />
                                        </div>
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 gap-2 2xl:grid-cols-3 xl:gird-cols-2 items-center 2xl:col-span-5 xl:col-span-3 ipad:col-span-2'>
                                    {
                                        Array.from({ length: 6 }).map((_, index) => (
                                            <div key={index}>
                                                <Card key={index} className="relative flex col-span-1 items-end bg-cover bg-center select-none overflow-hidden h-[150px] mb-1 cursor-pointer"
                                                >
                                                    <CardContent className="flex h-full w-full border  rounded-lg">
                                                        <Skeleton className="h-[150px] w-[150px] rounded-md" />
                                                        <div className="flex flex-col justify-between">
                                                            <div className="ml-4 flex justify-center items-center flex-col gap-4 h-full">
                                                                <Skeleton className="h-4 w-[200px]" />
                                                                <Skeleton className="h-4 w-[200px]" />
                                                                <Skeleton className="h-4 w-[200px]" />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    )

                }

            </div>
        </div>
    );
});

export default page;
