"use client"
import { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Tooltip from '@/components/tooltip/tooltip';
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
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/MyCarousel"



const Page = ({ user }) => {
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;

    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col bg-muted overflow-x-hidden select-none mb-[50px] lg:mb-0">
            <div className='ipad:px-5 ipad:pt-20 pt-5 ipad:pb-5 items-center flex flex-col ipad:flex-row w-full'>
                <Image src={userStore.profilePicture} alt='logo' height={200} width={200} className='rounded-md' />
                <div className='ipad:pl-5 flex-col'>
                    <h1 className='iphone:text-6xl text-5xl font-bold pt-5 ipad:pt-0'>{userStore.userName}</h1>
                    <p className=' text-muted-foreground '>{userStore.email}</p>
                    <div className='flex items-center ipad:justify-normal justify-between ipad:mt-16 mb-5 ipad:mb-0 gap-1 '>
                        <div className='flex items-center gap-1'>
                        </div>
                    </div>
                </div>

            </div>
            <div className='bg-background ipad:mr-2 rounded-t-md h-full ipad:p-5'>
                <p className='ipad:text-3xl text-2xl font-bold pl-5 pt-3 ipad:pl-0 ipad:pt-0'>My tickets</p>
                <div>
                   
                </div>

            </div>
        </div>
    );
};

export default Page;