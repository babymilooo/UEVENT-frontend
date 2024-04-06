"use client"
import React from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/MyCarousel"

import { Card, CardContent } from "@/components/ui/card"
import Navbar from '@/components/navbar/Navbar';
import Image from 'next/image';
import Autoplay from 'embla-carousel-autoplay';
import SideBar from '@/components/sidebar/SideBar';
import { Footer } from '@/components/footer/Footer';
import { useRouter } from 'next/navigation';

const page = () => {
    const router = useRouter();
    return (
        <div className="relative flex h-full flex-col bg-background">
            <Navbar />
            <div className="flex flex-col flex-grow">
                <div className="hidden lg:block fixed top-0 left-0 h-full xl:w-[250px] lg:w-[200px] bg-neutral-100 overflow-auto">
                    <SideBar />
                </div>
                <div className="xl:pl-[250px] lg:pl-[200px] flex items-center overflow-x-hidden">
                    <div className="ipad:px-4 lg:px-8 w-full">
                        <Carousel
                            plugins={[
                                Autoplay({
                                    delay: 5000,
                                    reset: 1000
                                }),
                            ]}>
                            <CarouselContent className="xl:h-[360px] lg:h-[260px] phone:h-[260px]">
                                <CarouselItem className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                    <div className="p-1 xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                        <Card className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                            <CardContent className="flex p-6 h-full bg-cover bg-center rounded-md items-center select-none"
                                                style={{
                                                    backgroundImage: `url('/carti.jpg')`,
                                                }}>
                                                <p className="font-bold xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-xl text-white">get tickets to the best <br /> concerts in the world</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                                <CarouselItem className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                    <div className="p-1 xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                        <Card className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                            <CardContent className="flex p-6 h-full bg-cover bg-center rounded-md items-center select-none"
                                                style={{
                                                    backgroundImage: `url('/artists.png')`,
                                                }}>
                                                <p className="font-bold xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-xl text-white">follow the performances<br />of your favorite artists</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                                <CarouselItem className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                    <div className="p-1 xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                        <Card className="xl:h-[350px] lg:h-[250px] phone:h-[250px]">
                                            <CardContent className="flex h-full p-6 bg-cover bg-center rounded-md items-center justify-center select-none bg-lime-400">
                                                <p className="font-bold xl:text-5xl lg:text-4xl ipad:text-4xl phone:text-xl text-black ">Join our community</p>
                                                <Image src="/bigLogo.png" height={40} width={1000} className='rounded-xl w-[40px] ipad:w-[100px]' />
                                                <Image src="/logoWord.png" height={40} width={1000} className='rounded-xl w-[60px] ipad:w-[250px] hidden ipad:block' />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                        <p className="font-bold text-3xl p-4 select-none">Upcoming events</p>
                        <div className="grid ipad:grid-cols-2 grid-cols-1 gap-8 p-1">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div onClick={() => router.push(`/events/${index}`)}>
                                    <Card className="h-[360px] cursor-pointer" >
                                        <CardContent className="flex p-6 h-full bg-cover bg-center rounded-md items-center select-none"
                                            style={{
                                                backgroundImage: `url('/carti.jpg')`,
                                            }}
                                        >
                                            <p className="font-bold xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-xl text-white">get tickets to the best <br /> concerts in the world</p>
                                        </CardContent>
                                    </Card>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default page;