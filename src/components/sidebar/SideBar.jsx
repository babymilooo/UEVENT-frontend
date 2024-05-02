'use client'

import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { RootStoreContext } from '@/providers/rootStoreProvider';
import { ScrollArea } from "@/components/ui/scroll-area"
import { observer } from 'mobx-react-lite';
import { Skeleton } from "@/components/ui/skeleton"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { useRouter } from 'next/navigation';

const SideBar = () => {
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredArtists, setFilteredArtists] = useState([]);
    const router = useRouter();
    useEffect(() => {
        const getArtists = async () => {
            try {
                if (userStore.userArtists.length === 0 || userStore.isLoaded) {
                    const response = await userStore.getUserArtists();
                    if (response?.status !== 200) {
                        setLoading(false);
                    } else {
                        setFilteredArtists(response.data);
                        setLoading(false);
                    }
                    userStore.setIsLoaded(false);
                }
            } catch (error) {
                console.error("user artists failed", error);
            }
        }

        getArtists();

    }, [userStore.userArtists]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    useEffect(() => {
        if (searchQuery) {
            const filtered = userStore.userArtists.filter((artist) =>
                artist.name.toLowerCase().includes(searchQuery.toLowerCase()));
            setFilteredArtists(filtered);
        } else {
            setFilteredArtists(userStore.userArtists);
        }
    }, [searchQuery]);

    return (
        <div className="mt-16">
            <div className="flex flex-grow h-[50px] bg-background m-2 rounded-lg items-center justify-center overflow-hidden">
                <div className="flex rounded-md w-full cursor-pointer ml-6" onClick={() => router.push('/search')}>
                    <Image src="/search.svg" alt="spotify" width={20} height={20} className="mr-1" />
                    <p >
                        search
                    </p>
                </div>
            </div>
            <div className="flex flex-col flex-grow bg-background m-2 rounded-lg">
                <div className="flex rounded-md cursor-pointer m-1 h-[50px] items-center">
                    <Input
                        type="text"
                        placeholder="find artist"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <ScrollArea className="mx-2 mb-2" style={{ height: `calc(100vh - 196px)`, overflowY: 'auto' }}>
                    {loading ?
                        (
                            Array.from({ length: 13 }).map((_, index) => (

                                <div key={index} className="flex items-center space-x-4 mb-2">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-[150px]" />
                                        <Skeleton className="h-4 w-[150px]" />
                                    </div>
                                </div>
                            ))

                        ) :
                        (filteredArtists.map((artist, index) => (
                            <div key={index} className="flex rounded-md cursor-pointer m-1 h-[50px] items-center hover:bg-secondary" onClick={() => (router.push(`/artist/${artist.id}`))}>
                                <Avatar>
                                    <AvatarImage src={artist.images[0].url} alt="@spotify" className="w-10" />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                                <p className='ml-3'>{artist.name}</p>
                            </div>
                        )))
                    }
                </ScrollArea>
            </div>
        </div>
    );
};

export default observer(SideBar);