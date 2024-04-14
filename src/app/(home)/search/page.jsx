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

import { Avatar } from '@/components/ui/avatar';
import ArtistService from '@/service/artistService';

const page = () => {
    const [search, setSearch] = useState('');
    const [timer, setTimer] = useState(null);
    const [artists, setArtists] = useState([]);
    const [searchHistory, setSearchHistory] = useState(() => {
        const savedHistory = localStorage.getItem('searchHistory');
        return savedHistory ? JSON.parse(savedHistory) : [];
    });
    const [artistsInfo, setArtistsInfo] = useState([]);

    const router = useRouter();


    useEffect(() => {
        if (searchHistory.length > 0) {
            loadArtistsInfo(searchHistory);
        }
    }, [searchHistory]);

    const loadArtistsInfo = async (artistIds) => {
        try {
            console.log("artistIds", artistIds);
            const response = await ArtistService.getArtists(artistIds);
            setArtistsInfo(response.data.map((artist) => {
                return {
                    artist: artist.name,
                    id: artist.id,
                    image: artist.images[1]?.url,
                };
            }));
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
            // console.log("Результат поиска артистов:", artists);
        } catch (error) {
            console.error("Ошибка при поиске артистов:", error);
            // Обработка ошибок при запросе
        }
    };

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
        <div className='xl:pl-[250px] lg:pl-[200px] flex flex-col items-center lg:items-start mb-12 w-full '>
            <Input
                placeholder='Search for artists'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className='w-2/3 mt-10 lg:ml-10'
            />
            {search === '' && searchHistory.length > 0 && (
                <p className='mt-4 mb-2 font-bold pl-2'>Search History</p>
            )}
            <div className='grid grid-cols-1 ipad:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-y-auto p-2 gap-4 w-full'>
                {/* Отображение истории поиска */}

                {search === '' && searchHistory.length > 0 ? (

                    artistsInfo.map((artist, index) => (
                        <div key={index} className="col-span-1">
                            <Card
                                onClick={() => {

                                    router.push(`/artist/${artist.id}`);
                                }}
                                className="h-[80px] ipad:h-[300px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] flex items-center  cursor-pointer hover:bg-secondary w-full"
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

                ) : (
                    artists.map((artist) => (
                        <div key={artist.id} className="col-span-1 mt-10">
                            <Card
                                onClick={() => {

                                    router.push(`/artist/${artist.id}`);
                                }}
                                className="h-[80px] ipad:h-[300px] lg:h-[250px] xl:h-[300px] 2xl:h-[350px] flex items-center  cursor-pointer hover:bg-secondary w-full"
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

export default page;
