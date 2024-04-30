"use client"

import { useState, useEffect, use, useContext } from 'react';
import EventService from '@/service/eventService';
import ReactPaginate from 'react-paginate';
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
import { RootStoreContext } from '@/providers/rootStoreProvider';
import { is } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import OrganizationService from '@/service/orgService';
import {  useRouter } from "next/navigation";

const Render = ({ res, eventsData, total, totalPages }) => {
    const rootStore = useContext(RootStoreContext);
    const router = useRouter();
    const { userStore } = rootStore;
    const [organization, setOrganization] = useState(res);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState(eventsData);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'];
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    const [currentPage, setCurrentPage] = useState(0);
    const [totalItems, setTotalItems] = useState(total);
    const itemsPerPage = 10;
    const [pageCount, setPageCount] = useState(totalPages);
    const [isAuthor, setIsAuthor] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);


    
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
                            console.log(response.data.results[0]);
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
        if (events.length > 0)
            fetchData();
        else
            setLoading(false);

        if (userStore.user && organization) {
            setIsAuthor(userStore.user._id === organization.createdBy);
            setIsAdmin(userStore.user.role === "admin");
        }
    }, [userStore.user, organization]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected);
    };
    const isVerified = organization.isVerified;

    const handleClickVerify = async () => {
        try {
            await OrganizationService.verifyOrganization(organization._id);
            router.push("/admin");
        } catch (error) {
            console.log(error);
        }
      };

    return (
        <div className='flex bg-muted h-full'>
            <div className="rounded-md mt-2 flex flex-col w-full xl:mr-[415px]">
                <Main isVerified={isVerified} organization={organization} />
                <OpenLeftBar isVerified={isVerified} organization={organization} events={events}/>
                <div className='bg-background rounded-t-md h-full ipad:p-5'>
                    <div className='flex justify-center items-center w-full gap-2 border-b pb-5'>
                    {isAdmin && !isAuthor && (
                        <>
                        <Button className="bg-lime-400 hover:bg-lime-400 px-6 py-1 rounded-3xl font-bold text-xs text-black" onClick={handleClickVerify}> Verify This Organization </Button>
                        </>
                        )}
                        
                        {isAuthor   && (
                        <>
                        <CreateNew organization={organization} setEvents={setEvents} events={events} />
                        </>
                        )}

                        <Input
                            placeholder='Search organization'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        {isAuthor  && (
                        <>
                        <Edit organization={organization} setOrganization={setOrganization} />
                        </>
                        )}
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
                                            <p className="text-xl font-bold ml-2 text-white z-10">{event.address}</p>
                                            <p className="text-xl font-bold ml-2 text-white z-10">{event.name}</p>
                                            <p className="text-xl font-bold ml-2 text-white z-10">{event.dayOfWeek} {event.time}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )
                    }
                    
                    {!loading && totalItems > itemsPerPage && (
                    <div className="mt-10">
                        <ReactPaginate
                            previousLabel={"<"}
                            nextLabel={">"}
                            breakLabel={"..."}
                            pageCount={pageCount}
                            onPageChange={handlePageClick}
                            containerClassName="flex list-none justify-center p-4"
                            activeClassName="bg-black text-white rounded-full"
                            pageClassName="mx-1"
                            pageLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                            previousClassName="mx-1"
                            nextClassName="mx-1"
                            previousLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                            nextLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                            breakClassName="mx-1"
                            breakLinkClassName="block px-3 py-1 border border-black rounded-full text-sm text-black-700 bg-black-200 hover:bg-black-300" // Reduced padding and text-sm for smaller text
                            forcePage={currentPage}
                            disabledClassName="opacity-30 cursor-not-allowed"
                        />
                    </div>
                )}
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
