"use client"

import { useState, useEffect, use } from 'react';
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
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Render = ({ res, eventsData }) => {
    const [organization, setOrganization] = useState(res);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState(eventsData);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const isVerified = organization.isVerified;

    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const processedEvents = await Promise.all(
                    events.map(async (event) => {
                        const eventDate = new Date(event.date);
                        const month = months[eventDate.getMonth()];
                        const dayOfWeek = days[eventDate.getDay()];
                        const dayOfMonth = eventDate.getDate();

                        if (event.location?.latitude && event.location?.longitude) {
                            const response = await axios.get(
                                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${event.location.latitude},${event.location.longitude}&key=${API_KEY}`
                            );
                            let address = '';
                            let city = '';
                            let country = '';
                            let street = '';
                            let route = '';
                            if (response.data.results.length > 0) {
                                const placeInfo = response.data.results[0];

                                // Iterate over address components to extract short names
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

                                // Construct formatted address using extracted data

                                if (route && street) {
                                    address = `${route} ${street}, ${city}, ${country}`;
                                } else if (route || street) {
                                    address = `${route}${street}, ${city}, ${country}`;
                                } else {
                                    address = `${city}, ${country}`;
                                }
                            }

                            return {
                                ...event,
                                month,
                                dayOfWeek,
                                dayOfMonth,
                                address
                            };
                        } else {
                            // If latitude or longitude is missing, return event without address
                            return {
                                ...event,
                                month,
                                dayOfWeek,
                                dayOfMonth,
                                address: ''
                            };
                        }
                    })
                );

                setEvents(processedEvents);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false); // Handle loading state in case of error
            }
        };

        // Fetch data if events array is not empty
        if (events.length > 0) {
            fetchData();
        }
    }, []);

    return (
        <div className='flex bg-muted h-full'>
            <div className="rounded-md pt-20 flex flex-col w-full xl:mr-[415px]">
                <Main isVerified={isVerified} organization={organization} />
                <OpenLeftBar isVerified={isVerified} organization={organization} events={events} />
                <div className='bg-background rounded-t-md h-full ipad:p-5'>
                    <div className='flex justify-center items-center w-full gap-2 border-b pb-5'>
                        <CreateNew organization={organization} setEvents={setEvents} events={events} />

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
                                <Card key={index}
                                    className="relative flex w-full items-end bg-cover bg-center select-none overflow-hidden h-[250px] mb-4"
                                    style={{
                                        backgroundImage: `url('${event.picture ? event.picture : "/gradient.jpeg"}`
                                    }}
                                    onClick={() => (router.push(`/events/${event.id}/management`))}
                                >
                                    <div className="absolute inset-0 bg-black opacity-50"></div>
                                    <CardContent className="flex items-center h-full w-full">
                                        <div className="bg-neutral-800 w-[200px] rounded-md h-[200px] ml-[20px] flex ">
                                            <div className="flex flex-col items-center justify-center w-full h-full z-10 gap-4">
                                                <p className="font-bold text-white text-5xl">{event.month}</p>
                                                <p className="text-5xl font-bold text-white">{event.dayOfMonth}</p>

                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-xl font-bold ml-2 text-white z-10">{event.address}</p>
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
                        <RightBar isVerified={isVerified} organization={organization} events={events} className="h-full w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Render;
