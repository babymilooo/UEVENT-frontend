'use client'

import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { RootStoreContext } from '@/providers/rootStoreProvider';
import { ScrollArea } from "@/components/ui/scroll-area"
import { observer } from 'mobx-react-lite';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
const SideBar = () => {
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredArtists, setFilteredArtists] = useState([]);

    useEffect(() => {
        const getArtists = async () => {
            try {
                const response = await userStore.getUserArtists();
                console.log(response);
                if (response?.status !== 200) {
                    setLoading(false);
                } else {
                    console.log("user artists", response.data);
                    setFilteredArtists(response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("user artists failed", error);
            }
        }
        getArtists();

    }, [userStore]);

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
                <div className="flex rounded-md w-full cursor-pointer ml-6">
                    <Image src="/search.svg" alt="spotify" width={20} height={20} className="mr-1" />
                    <p>
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
                    {filteredArtists.map((artist, index) => (
                        <div key={index} className="flex rounded-md cursor-pointer m-1 h-[50px] items-center hover:bg-secondary">
                            {/* <Image src={artist.images[0].url} alt="spotify" width={50} height={50} className="mr-1 rounded-full" /> */}
                            <Avatar>
                                <AvatarImage src={artist.images[0].url} alt="@spotify" className="w-10" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <p className='ml-3'>{artist.name}</p>
                        </div>
                    ))}
                </ScrollArea>
            </div>
        </div>
    );
};

export default observer(SideBar);