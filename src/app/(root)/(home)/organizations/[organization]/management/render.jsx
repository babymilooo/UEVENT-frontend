"use client"

import { useState, useEffect } from 'react';
import EventService from '@/service/eventService';

import { Main } from '@/components/organizationComponents/main';
import { OpenLeftBar } from '@/components/organizationComponents/openLeftBar';
import CreateNew from '@/components/organizationComponents/createNew';
import Edit from '@/components/organizationComponents/edit';
import { RightBar } from '@/components/organizationComponents/rightBar';
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from '@/components/ui/input';
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';

const Render = ({ res, eventsData }) => {
    const [organization, setOrganization] = useState(res);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState(eventsData);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];

    useEffect(() => {

                const processedEvents = events.map(event => {
                    const eventDate = new Date(event.date);
                    const month = months[eventDate.getMonth()];
                    const dayOfWeek = days[eventDate.getDay()];
                    const dayOfMonth = eventDate.getDate();
                    return {
                        ...event,
                        month,
                        dayOfWeek,
                        dayOfMonth
                    }
                });
                setEvents(processedEvents);
                setLoading(false);

    }, []);


    const isVerified = organization.IsVerified;

    return (
        <div className='flex bg-muted h-full'>
            <div className="rounded-md mt-2 flex flex-col w-full xl:mr-[415px]">
                <Main isVerified={isVerified} organization={organization} />
                <OpenLeftBar isVerified={isVerified} organization={organization} />
                <div className='bg-background rounded-t-md h-full ipad:p-5'>
                    <div className='flex justify-center items-center w-full gap-2 border-b pb-5'>
                        <CreateNew organization={organization} />

                        <Input
                            placeholder='Search organization'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <Edit organization={organization} setOrganization={setOrganization} />
                    </div>
                    {
                        loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className='flex pt-12 pl-12 w-full gap-4'>
                                    <Skeleton className="h-[200px] w-[200px] rounded-lg" />
                                    <div className=' flex flex-col gap-8 py-6'>
                                        <Skeleton className="h-4 w-[300px] rounded-md" />
                                        <div className=' flex flex-col gap-2'>
                                            <Skeleton className="h-4 w-[200px] rounded-md" />
                                            <Skeleton className="h-4 w-[200px] rounded-md" />
                                            <Skeleton className="h-4 w-[250px] rounded-md" />
                                        </div>
                                        <Skeleton className="h-4 w-[200px] rounded-md" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            events.map((event, index) => (
                                <Card key={index} className="relative flex w-full items-end bg-cover bg-center select-none overflow-hidden h-[250px] mb-4" style={{
                                    backgroundImage: `url('${event.picture ? event.picture : "/gradient.jpeg"}`
                                }}>
                                    <div className="absolute inset-0 bg-black opacity-50"></div>
                                    <CardContent className="flex items-center h-full w-full">
                                        <div className="bg-neutral-800 w-[200px] rounded-md h-[200px] ml-[20px] flex ">
                                            <div className="flex flex-col items-center justify-center w-full h-full z-10 gap-4">
                                                <p className="font-bold text-white text-5xl">{event.month}</p>
                                                <p className="text-5xl font-bold text-white">{event.dayOfMonth}</p>

                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-xl font-bold ml-2 text-white z-10">asdsad</p>
                                            <p className="text-xl font-bold ml-2 text-white z-10">{event.name}</p>
                                            <p className="text-xl font-bold ml-2 text-white z-10">{event.dayOfWeek} {event.time}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )
                    }
                </div>
            </div>
            <div className="z-10 h-full hidden xl:block ">
                <div className="fixed top-[55px] bottom-0 right-0 h-full m-2 w-[400px]">
                    <div className="bg-background h-full rounded-md">
                        <RightBar isVerified={isVerified} organization={organization} className="h-full w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Render;
