'use client'

import React, { useContext, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { RootStoreContext } from '@/providers/rootStoreProvider';
const SideBar = () => {
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getArtists = async () => {
            try {
                const response = await userStore.getUserArtists();
                console.log(response);
                if (response?.status !== 200) {
                    setLoading(false);
                } else {
                    console.log("user artists", response.data);
                    setLoading(false);
                }
            } catch (error) {
                console.error("user artists failed", error);
            }
        }
        getArtists();

    }, [userStore]);
    
    return (
        <div className="mt-16">
            <div className="flex flex-grow h-[50px] bg-background m-2 rounded-lg items-center justify-center">
                <div className="flex rounded-md w-full cursor-pointer ml-6">
                    <Image src="/search.svg" alt="spotify" width={20} height={20} className="mr-1" />
                    <p>
                        search
                    </p>
                </div>
            </div>
            <div className="flex flex-grow bg-background h-[835px] m-2 rounded-lg">
                <div className="flex rounded-md cursor-pointer m-1 h-[50px] items-center">
                    <Input type="username" placeholder="find artist" />
                </div>
                <div>

                </div>
            </div>
        </div>
    );
};

export default SideBar;