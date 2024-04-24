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
const Render = () => {
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;
    const [showAllArtists, setShowAllArtists] = useState(false);
    const artistsToShow = showAllArtists ? userStore.userArtists : userStore.userArtists.slice(0, 6);

    const toggleTracksDisplay = () => setShowAllArtists(!showAllArtists);
    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col bg-muted overflow-x-hidden select-none mb-[50px] lg:mb-0">
            <div className='ipad:px-5 ipad:pt-20 pt-5 ipad:pb-5 items-center flex flex-col ipad:flex-row w-full'>
                <Image src={userStore.user.profilePicture} alt='logo' height={200} width={200} className='rounded-md' />
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
                <div className='flex justify-between items-center mr-4'>
                    <p className='ipad:text-3xl text-2xl font-bold pl-5'>Favourite artists</p>
                    {userStore.userArtists && userStore.userArtists.length > 5 && (
                        <button onClick={toggleTracksDisplay} className='font-bold text-md pl-5'>
                            {showAllArtists ? 'Less' : 'More'}
                        </button>
                    )}
                </div>
                <div className='grid grid-cols-1 ipad:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-y-auto p-2 gap-4 w-full'>
                    {
                        artistsToShow?.map((artist, index) => (
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
                        ))
                    }
                </div>
                <p className='ipad:text-3xl text-2xl font-bold pl-5 pt-3 ipad:pl-0 ipad:pt-0'>My tickets</p>
                <div>

                </div>

            </div>

        </div>
    );
};

export default observer(Render);