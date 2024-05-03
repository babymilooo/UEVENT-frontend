"use client"
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { RootStoreContext } from '@/providers/rootStoreProvider';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import withAuth from '@/components/withAuth';

import AuthService from '@/service/authService';

import UserService from '@/service/userService';

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
const days = ["Sun.", "Mon.", "Tue.", "Wed.", "Thu.", "Fri.", "Sat."];


const Render = () => {
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;
    const [showAllArtists, setShowAllArtists] = useState(false);
    const [artistsToShow, setArtistsToShow] = useState([])
    // const artistsToShow = showAllArtists ? userStore.userArtists : null;
    const [tickets, setTickets] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (userStore.userArtists.length > 5) {
            setArtistsToShow(showAllArtists ? userStore.userArtists : userStore.userArtists.slice(0, 5));
        } else {
            setArtistsToShow(userStore.userArtists);
        }
    }, [showAllArtists, userStore.userArtists]);

    useEffect(() => {
        const fetchTickets = async () => {
            const rawTickets = await UserService.getUserTickets();
            // console.log(rawTickets);
            const newTickets = rawTickets.map(ticket => {
                const event = ticket.event;
                const eventDate = new Date(event.date);
                const month = months[eventDate.getMonth()];
                const dayOfWeek = days[eventDate.getDay()];
                const dayOfMonth = eventDate.getDate();
                const time = eventDate.toTimeString().substring(0, 5);

                ticket.event = {
                    ...event,
                    month,
                    dayOfWeek,
                    dayOfMonth,
                    time,
                }
                return ticket;
            });
            console.log(newTickets);
            setTickets(newTickets);
        }
        fetchTickets();
    }, [])

    const toggleTracksDisplay = () => setShowAllArtists(!showAllArtists);

    const [auth, setAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const response = await AuthService.checkToken();
            if (response.data) {
                console.log('User is logged in');
                setAuth(false);
            } else {
                router.push('/auth/login');
            }
        }
        checkAuth();
    }, []);

    if (auth) {
        return null;
    }


    return (

        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col bg-muted overflow-x-hidden select-none mb-[50px] lg:mb-0 h-full">
            <div className='ipad:px-5 ipad:pt-40 pt-20 ipad:pb-5 items-center flex flex-col ipad:flex-row w-full'>
                <Image src={userStore.user.profilePicture} alt='logo' height={200} width={200} className='rounded-md h-[200px]' />
                <div className='ipad:pl-5 flex-col'>
                    <h1 className='iphone:text-6xl text-5xl font-bold pt-5 ipad:pt-0'>{userStore.user.userName}</h1>
                    <p className=' text-muted-foreground '>{userStore.user.email}</p>
                    <div className='flex items-center ipad:justify-normal justify-between ipad:mt-16 mb-5 ipad:mb-0 gap-1 '>
                        <div className='flex items-center gap-1'>
                        </div>
                    </div>
                </div>
            </div>


            <div className='bg-background ipad:mr-2 rounded-t-md h-full ipad:p-5'>
                {artistsToShow.length > 0 && (<>
                    <div className='flex justify-between items-center mr-4'>
                        <p className='ipad:text-3xl text-2xl font-bold pl-5 pt-3 ipad:pl-0 ipad:pt-0'>My artists</p>
                        {userStore.userArtists && userStore.userArtists.length > 5 && (
                            <button onClick={toggleTracksDisplay} className='font-bold text-md pl-5'>
                                {showAllArtists ? 'Less' : 'More'}
                            </button>
                        )}
                    </div>
                    <div className='grid grid-cols-1 ipad:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-y-auto p-2 gap-4 w-full'>
                        {artistsToShow.map((artist, index) => (
                            <div key={index} className="col-span-1">
                                <Card
                                    onClick={() => router.push(`/artist/${artist.id}`)}
                                    className="h-[80px] ipad:h-[300px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] flex items-center cursor-pointer hover:bg-secondary w-full"
                                >
                                    <CardContent className="p-4 flex flex-row ipad:items-start items-center ipad:flex-col w-full pt-4">
                                        <Avatar>
                                            <AvatarImage src={artist.images[1].url} alt={artist.name} className="ipad:w-full w-10" />
                                            <AvatarFallback>AR</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col ml-2">
                                            <p className="text-xd font-bold ml-2 pt-2">{artist.name}</p>
                                            <p className="text-muted-foreground text-xs ml-2">Artist</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </>


                )}

                {tickets.length > 0 && (
                    <>
                        <p className='ipad:text-3xl text-2xl font-bold pl-5 pt-3 ipad:pl-0 ipad:pt-0'>My tickets</p>
                        <div className="hidden ipad:flex flex-wrap items-center w-full">
                            {tickets.map((ticket, index) => (
                                <div key={index}>
                                    <div className='relative select-none'>
                                        <img src="/ticket.png" alt="ticket" className='w-[500px] h-[200px] rounded-lg' />
                                        <div className="absolute inset-0  ml-6 mr-36 my-6 rounded-md w-[350px] h-[150px]">
                                            <div className="rounded-lg grid grid-cols-1 gap-4 h-full bg-white">
                                                <div className='col-span-1 flex flex-col pb-2 pt-2 pl-2 h-full justify-center'>
                                                    <h1 className="text-3xl font-bold col-span-1 justify-center flexpb-2">{ticket.event.name}</h1>
                                                    <h1 className="text-3xl font-bold col-span-1 justify-center flexpb-2">{ticket.ticketOption.name}</h1>
                                                </div>
                                            </div>
                                            <div className="absolute top-12 right-[-140px] rounded-md px-3 py-1 -rotate-90 flex ">
                                                <p className="text-5xl font-bold text-lime-700 mr-1">{ticket.event.month}</p>
                                                <p className="text-5xl font-bold text-lime-700">{ticket.event.dayOfMonth}</p>
                                                {/* <p className="text-5xl font-bold text-lime-700">ucode</p> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="ipad:hidden flex flex-wrap justify-center items-center w-full">
                            {tickets.map((ticket, index) => (
                                <div key={index} className="relative select-none w-[200px] h-[450px] col-span-1">
                                    <div className="absolute inset-0 flex items-center justify-center ">
                                        <img src="/ticket-rotated.png" alt="ticket" className='w-full h-full rounded-lg' />
                                    </div>
                                    <div className="absolute inset-0 ml-6 mr-36 my-6 rounded-md w-[153px] h-[300px]">
                                        <div className="rounded-lg flex flex-col justify-between py-4 h-full w-full bg-white">
                                            <div className="justify-center items-center flex flex-col w-full pb-2">
                                                <h1 className="text-3xl font-bold col-span-1 justify-center flexpb-2">{ticket.event.name}</h1>
                                                <h1 className="text-3xl font-bold">{ticket.ticketOption.name}</h1>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="absolute bottom-8 ml-[15px] rounded-md px-3 py-1 flex    ">
                                        <p className="text-5xl font-bold text-lime-700">{ticket.event.month}</p>
                                        <p className="text-5xl font-bold text-lime-700 ml-3">{ticket.event.dayOfMonth}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>)}
                {(tickets.length <= 0 && artistsToShow.length <= 0) && <div className="flex justify-center items-center h-full w-full bg-background rounded-t-md">
                    <p className="text-5xl font-bold text-neutral-300">No information found</p>
                </div>}
            </div>

        </div>
    );
};

export default observer(Render);
