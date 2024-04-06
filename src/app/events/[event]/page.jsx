"use client"

import Navbar from '@/components/navbar/Navbar';
import SideBar from '@/components/sidebar/SideBar';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

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

import React from 'react';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import { Footer } from '@/components/footer/Footer';

const page = ({ params }) => {
    return (
        <div className="relative flex h-full flex-col bg-background">
            <Navbar />
            <div className="flex flex-col flex-grow">
                <div className="hidden lg:block fixed top-0 left-0 h-full xl:w-[250px] lg:w-[200px] bg-neutral-100 overflow-auto">
                    <SideBar />
                </div>
                <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col items-center overflow-x-hidden">
                    <div className="relative flex h-[360px] w-full items-end bg-cover bg-center select-none overflow-hidden"
                        style={{
                            backgroundImage: `url('/rolingLoud.webp')`,
                        }}>
                        <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                        <p className="relative mb-[50px] ml-6 font-bold xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-xl text-white z-10">Rolling Loud</p>
                    </div>
                    <div className="relative w-full p-6 mt-[-35px] bg-background z-30 rounded-[40px]">
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src="/Rolling_Loud_Logo.png" alt="@avatar" className="w-[50px]" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="font-bold">
                                Rolling Loud Co.
                            </div>
                            <div className="flex items-center">
                                <Image src="/verified.svg" alt="verified" width={20} height={20} />
                                <div className="text-primary">Verified</div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="font-bold text-xl">Hard Rock Stadium, Miami Gardens, US</div>
                            <div className=" text-neutral-400">Sunday, 28 april. 14:00</div>
                        </div>
                        <div className='mt-14 flex flex-col'>
                            <p className="font-bold text-xl">Buy ticket</p>
                            <div className="flex flex-col ipad:flex-row  gap-7 mt-2">
                                <Card className="xl:w-1/3 w-full">
                                    <CardTitle className="font-bold text-lg p-1 pl-4 bg-neutral-200 rounded-t-md">VIP ticket</CardTitle>
                                    <CardContent className="mt-4">
                                        <p className="font-bold text-xl">Access to the VIP area</p>
                                        <div className="flex items-center justify-end">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="font-bold text-lg">$100</div>
                                                <button className=" bg-lime-400 px-6 py-3 rounded-3xl font-bold text-xs mt-2">
                                                    buy now
                                                </button>
                                            </div>
                                        </div>
                                        <p className="font-bold text-neutral-400">total ended: 34 </p>
                                    </CardContent>
                                </Card>
                                <Card className="xl:w-1/3 w-full">
                                    <CardTitle className="font-bold text-lg p-1 pl-4 bg-neutral-200 rounded-t-md">Default ticket</CardTitle>
                                    <CardContent className="mt-4">
                                        <p className="font-bold text-xl">Access to the common area</p>
                                        <div className="flex items-center justify-end">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="font-bold text-lg">$50</div>
                                                <button className=" bg-lime-400 px-6 py-3 rounded-3xl font-bold text-xs mt-2">
                                                    buy now
                                                </button>
                                            </div>
                                        </div>
                                        <p className="font-bold text-neutral-400">total ended: 156 </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="flex flex-col mt-14">
                            <p className="font-bold text-xl mb-2">Who is performing</p>
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
                <Footer />
            </div>
        </div>
    );
};

export default page;