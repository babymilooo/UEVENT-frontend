"use client"
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Tooltip from '@/components/tooltip/tooltip';
import { RootStoreContext } from '@/providers/rootStoreProvider';
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
import Autoplay from 'embla-carousel-autoplay';
import { observer } from 'mobx-react-lite';

const Render = ({ artist }) => {
    const isVerified = artist.followers.total > 5000;
    const [isFollowing, setIsFollowing] = useState(false);
    const [showAllTracks, setShowAllTracks] = useState(false);
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const filteredHistory = history.filter(id => id !== artist.id);
        const updatedHistory = [artist.id, ...filteredHistory];
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }, [artist.id]);

    useEffect(() => {s
        if ((userStore.userArtists.map(o => o.id)).includes(artist.id)) {
            setIsFollowing(true);
        }
    }
        , [artist.id, userStore.userArtists]);

    // Определите функцию для переключения отображения треков
    const toggleTracksDisplay = () => setShowAllTracks(!showAllTracks);

    // Получите либо первые пять треков, либо все, в зависимости от showAllTracks
    const tracksToShow = showAllTracks ? artist.tracks : artist.tracks.slice(0, 5);

    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col bg-muted overflow-x-hidden select-none mb-[50px] lg:mb-0">
            <div className='ipad:px-5 ipad:pt-20 pt-5 ipad:pb-5 items-center flex flex-col ipad:flex-row w-full'>
                <Image src={artist.images[1].url} alt='logo' height={200} width={200} className='rounded-md' />
                <div className='ipad:pl-5 flex-col'>
                    {isVerified && (
                        <div className="hidden ipad:flex items-center none">
                            <Image src="/verified.svg" alt="verified" width={20} height={20} />
                            <div className="text-primary">Verified</div>
                        </div>
                    )}
                    <h1 className='iphone:text-6xl text-5xl font-bold pt-5 ipad:pt-0'>{artist.name}</h1>
                    <p className=' text-muted-foreground '>{artist.genres[0]}</p>
                    <div className='flex items-center ipad:justify-normal justify-between ipad:mt-16 mb-5 ipad:mb-0 gap-1 '>
                        <div className='flex items-center gap-1'>
                            <p className='text-xl font-bold'>{artist.followers.total.toLocaleString()}</p>
                            <p className='font-bold text-xs pt-1'>Followers</p>
                        </div>
                        <button onClick={() => setIsFollowing(!isFollowing)}>{
                            !isFollowing ?
                                <div>
                                    <Tooltip text="unfollow">
                                        <Image src="/heart.svg" alt='heart' height={30} width={30} />
                                    </Tooltip>
                                </div>
                                :
                                <div>
                                    <Tooltip text="follow">
                                        <Image src="/heart-clicked.svg" alt='heart' height={30} width={30} />
                                    </Tooltip>
                                </div>
                        }</button>
                    </div>
                </div>

            </div>
            <div className='bg-background ipad:mr-2 rounded-t-md h-full ipad:p-5'>
                <p className='ipad:text-3xl text-2xl font-bold pl-5 pt-3 ipad:pl-0 ipad:pt-0'>Popular tracks</p>
                <div>
                    {
                        tracksToShow?.map((track, index) => (
                            <div key={index} className='flex items-center justify-between gap-5 mt-2 xl:w-2/3 hover:bg-muted rounded-md'>
                                <div className='flex gap-2 ipad:pl-7 pl-3 w-full'>
                                    <div className='flex items-center ipad:mr-3'>
                                        <p className='font-bold text-muted-foreground text-xs ipad:text-lg'>{index + 1}</p>
                                    </div>
                                    <Image src={track.album.images[0].url} alt='album cover' height={50} width={50} className='rounded-xl p-2' />
                                    <div className='flex-col max-w-40 ipad:max-w-[600px]'>
                                        <p className='ipad:text-lg text-sm font-bold truncate'>{track.name}</p>
                                        <p className='text-muted-foreground text-xs ipad:text-lg truncate'>{track.album.name}</p>
                                    </div>
                                </div>
                                <div className='text-muted-foreground flex px-5'>
                                    {Math.floor(track.duration_ms / 60000) + ":" + (Math.floor((track.duration_ms % 60000) / 1000) < 10 ? '0' : '') + Math.floor((track.duration_ms % 60000) / 1000)}
                                </div>
                            </div>
                        ))

                    }
                    {artist.tracks && artist.tracks.length > 5 && (
                        <button onClick={toggleTracksDisplay} className='font-bold text-xs pl-5'>
                            {showAllTracks ? 'Less' : 'More'}
                        </button>
                    )}
                </div>
                <div className="flex flex-col mt-14">
                    <p className="font-bold text-xl mb-2">similar artists</p>
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
                            {Array.from({ length: 20 }).map((_, index) => (
                                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/6">
                                    <div className="p-1">
                                        <Card className="relative flex w-full items-start bg-cover bg-center select-none overflow-hidden h-[245px]"
                                            style={{
                                                backgroundImage: `url('/concert.webp')`,
                                            }}>
                                            <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                                            <p className="absolute bottom-0 mb-2 ml-6 font-bold text-xl text-white z-10">Playboi Carti</p>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
                
            </div>
        </div>
    );
};

export default observer(Render);
