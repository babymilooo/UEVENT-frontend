'use client'

import React, { useEffect, useState } from 'react';
import Main from '@/components/eventComponents/main';
import RightBar from '@/components/eventComponents/rightBar';
import withAuth from '@/components/withAuth';
import AuthService from '@/service/authService';
const Events = ({ org, eventData }) => {
    const [event, setEventData] = useState(eventData);
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
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col overflow-x-hidden pt-16 w-full h-full xl:mr-[415px] rounded-t-lg">
            <Main eventData={event} org={org} setEventData={setEventData} />
            <div className='flex flex-col bg-background h-full w-full'>
                <div className="flex flex-row w-full  gap-7 mt-2">
                    <div className="hidden ipad:flex flex-wrap justify-center items-center w-full">
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

            <div className="fixed top-[55px] bottom-0 right-0 h-full m-2 w-[400px] bg-muted hidden xl:block">
                <div className="bg-background h-full rounded-md">
                    <RightBar eventData={event} org={org} />
                </div>
            </div>
        </div>
    );
};

export default Events;