'use client'

import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
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
import { Skeleton } from "@/components/ui/skeleton"

import ArtistService from '@/service/artistService';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import $api from '@/https/axios';
import { getUserCountryCode } from '@/lib/userCountryCode';

const Page = () => {
    const [search, setSearch] = useState('');
    const [timer, setTimer] = useState(null);
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchHistory, setSearchHistory] = useState(() => {
        try {
            const savedHistory = localStorage.getItem('searchHistory');
            return savedHistory ? JSON.parse(savedHistory) : [];
        } catch (error) {
            return [];
        }

    });
    const [artistsInfo, setArtistsInfo] = useState([]);

    //event search
    const now = new Date();
    // now.setHours(0, 0, 1, 0); //set to midnight
    const [onlyLocalEvents, setOnlyLocalEvents] = useState(true);
    const [startDate, setStartDate] = useState(now);
    const [endDate, setEndDate] = useState(new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30)); //default - till next month
    const [order, setOrder] = useState('newest'); // 'newest' | 'oldest'
    const [searchResultEvents, setSearchResultEvents] = useState({
        total: 0,
        page: 1,
        pages: 0,
        events: []
    })

    const router = useRouter();


    useEffect(() => {
        if (searchHistory.length > 0) {
            loadArtistsInfo(searchHistory);

        }
    }, [searchHistory]);

    const loadArtistsInfo = async (artistIds) => {
        try {
            const response = await ArtistService.getArtists(artistIds);
            setArtistsInfo(response.data.map((artist) => {
                return {
                    artist: artist.name,
                    id: artist.id,
                    image: artist.images[1]?.url,
                };
            }));
            setLoading(false);
        } catch (error) {
            console.error("Ошибка при загрузке информации об исполнителях:", error);
            // Обработка ошибок
        }
    };

    const handleSearch = async () => {
        try {
            const response = await ArtistService.searchArtists(search);
            setArtists(response.data.map((artist) => {
                return {
                    artist: artist.name,
                    id: artist.id,
                    image: artist.images[1]?.url,
                };
            }));
        } catch (error) {
            console.error("Ошибка при поиске артистов:", error);
            // Обработка ошибок при запросе
        }
    };

    const handleSearchEvents = async () => {
        try {
            if (onlyLocalEvents) {
                const resp = await $api.get('/events/get-events', {
                    params: {
                        countryCode: await getUserCountryCode(),
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                        order,
                        eventName: search
                    }
                });
                setSearchResultEvents(resp.data);
            }
            else {
                const resp = await $api.get('/events/get-events', {
                    params: {
                        startDate: startDate.toISOString(),
                        endDate: endDate.toISOString(),
                        order,
                        eventName: search
                    }
                });
                setSearchResultEvents(resp.data);
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        if (timer) {
            clearTimeout(timer);
        }

        if (search.length === 0) {
            setArtists([]); // Очистить список артистов, если строка поиска пуста
        } else {
            setTimer(setTimeout(() => {
                if (search) {
                    handleSearch();
                }
            }, 500)); // Задержка в 500 мс
        }

        // Очистка таймера при размонтировании компонента
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [search]);

    return (
        <div className='xl:pl-[250px] lg:pl-[200px] flex flex-col items-center lg:items-start mb-12 w-full pt-14'>
            <Input
                placeholder='Search for artists'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-2/3 mt-10 lg:ml-10'
            />
            <div className='flex flex-wrap flex-row gap-3 w-2/3 mt-5 lg:ml-10 items-center justify-center'>
                <div className='flex flex-row items-center gap-2'>
                    <label htmlFor="startDate" className='align-center'>From</label>
                    <Input type="date"
                        id="startDate"
                        value={startDate.toISOString().substring(0, 10)}
                        onChange={(e) => setStartDate(new Date(e.target.value))}
                        className="w-fit"
                    />
                </div>

                <div className='flex flex-row items-center gap-2'>
                    <label htmlFor="endDate">To</label>
                    <Input type="date"
                        id="endDate"
                        value={endDate.toISOString().substring(0, 10)}
                        onChange={(e) => setEndDate(new Date(e.target.value))}
                        className="w-fit"
                    />
                </div>
                <div className='flex flex-row items-center gap-2'>
                    <label htmlFor="eventsOtherCountries">Events from other countries</label>
                    <Checkbox id="eventsOtherCountries"
                        checked={!onlyLocalEvents}
                        onCheckedChange={() => setOnlyLocalEvents(!onlyLocalEvents)}
                    />
                </div>
                <div className='flex flex-row items-center gap-2'>
                    <label htmlFor="order">Order</label>
                    <Select value={order} onValueChange={(val) => setOrder(val)}>
                        <SelectTrigger>
                            <SelectValue>{order == 'newest' ? "Newest first" : order == 'oldest' ? "Oldest first" : "Select Order"}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="newest">Newest first</SelectItem>
                                <SelectItem value="oldest">Oldest first</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>


            </div>
            {search === '' && searchHistory.length > 0 && (
                <p className='mt-4 mb-2 font-bold pl-2'>Search History</p>
            )}
            <div className='grid grid-cols-1 ipad:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-y-auto p-2 gap-4 w-full'>
                {/* Отображение истории поиска */}
                {search === '' && searchHistory.length > 0 ? (
                    loading ? (
                        Array.from({ length: 12 }).map((_, index) => (
                            <div key={index} className="col-span-1">
                                <Card className="h-[80px] ipad:h-[300px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] flex items-center cursor-pointer hover:bg-secondary w-full">
                                    <CardContent className="p-4 flex flex-row ipad:items-start items-center ipad:flex-col w-full pt-4 ">
                                        <Skeleton className=" w-[230px] h-[230px] rounded-full" />
                                        <div className="flex flex-col gap-2 mt-4">
                                            <Skeleton className="h-4 w-[120px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    ) : (
                        artistsInfo.map((artist, index) => (
                            <div key={index} className="col-span-1">
                                <Card
                                    onClick={() => router.push(`/artist/${artist.id}`)}
                                    className="h-[80px] ipad:h-[300px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] flex items-center cursor-pointer hover:bg-secondary w-full"
                                >
                                    <CardContent className="p-4 flex flex-row ipad:items-start items-center ipad:flex-col w-full pt-4">
                                        <Avatar>
                                            <AvatarImage src={artist.image} alt={artist.artist} className="ipad:w-full w-10" />
                                            <AvatarFallback>AR</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col ml-2">
                                            <p className="text-xd font-bold ml-2 pt-2">{artist.artist}</p>
                                            <p className="text-muted-foreground text-xs ml-2">Artist</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    )
                ) : (
                    artists.map((artist) => (
                        <div key={artist.id} className="col-span-1 mt-10">
                            <Card
                                onClick={() => router.push(`/artist/${artist.id}`)}
                                className="h-[80px] ipad:h-[300px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] flex items-center cursor-pointer hover:bg-secondary w-full"
                            >
                                <CardContent className="p-4 flex flex-row ipad:items-start items-center ipad:flex-col w-full pt-4">
                                    <Avatar>
                                        <AvatarImage src={artist.image} alt={artist.artist} className="ipad:w-full w-10" />
                                        <AvatarFallback>AR</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col ml-2">
                                        <p className="text-xd font-bold ml-2 pt-2">{artist.artist}</p>
                                        <p className="text-muted-foreground text-xs ml-2">Artist</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))
                )}
            </div>
        </div>

    );
};

export default Page;
