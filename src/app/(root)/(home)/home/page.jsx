"use client"
import React, { useContext, useEffect, useState } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/MyCarousel"

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
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];

const page = observer(() => {
    const router = useRouter();
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;
    const [upcomingEvents, setUpcomingEvents] = useState([]);

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
        fetchUpcoming();
    }, [])

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
            </div>
        </div>
    );
});

export default page;
