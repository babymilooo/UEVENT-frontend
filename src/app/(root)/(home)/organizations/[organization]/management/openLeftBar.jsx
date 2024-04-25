import { useState } from 'react';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

import { ScrollArea } from '@/components/ui/scroll-area';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import Image from 'next/image';

import {
    Card,
    CardContent
} from "@/components/ui/card"

export function OpenLeftBar({
    isVerified,
    organization

}) {
    const [backgroundImage, setBackgroundImage] = useState(organization.picture);

    return (
        <div className='lg:hidden fixed right-0'>
            <Sheet>
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent>
                    <div className="flex flex-col fixed h-full">
                        <div className="bg-background h-full rounded-md">
                            <ScrollArea className="h-full w-full rounded-md">
                                <div className="relative flex h-[360px] w-full items-end bg-cover bg-center select-none rounded-t-md" style={{
                                    backgroundImage: `url('/gradient.jpeg')`
                                }}>
                                    <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                                </div>
                                <div className="relative w-full mt-[-35px] bg-background z-30 rounded-[40px]">
                                    <div className="flex items-center gap-2 p-4 pb-0">
                                        <Avatar>
                                            <AvatarImage src="/BigLogo.png" alt="@avatar" className="w-[50px]" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                        <div></div>
                                        <div className="font-bold">
                                            Organization
                                        </div>

                                        {isVerified && <div className="hidden ipad:flex items-center none">
                                            <Image src="/verified.svg" alt="verified" width={20} height={20} />
                                        </div>}
                                    </div>
                                    <div className="mt-4 p-1">
                                        <div className="font-bold">Hard Rock Stadium, Miami Gardens, US</div>
                                        <p className="font-bold mt-4 text-sm">
                                            About us
                                        </p>
                                        <p className=' text-muted-foreground text-sm'>     Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam, at dignissimos deleniti commodi adipisci beatae aperiam saepe harum. Incidunt doloribus quibusdam aspernatur reiciendis quod vel numquam! Officiis sunt aliquid rem.
                                        </p>
                                        <p className="font-bold mt-4 mb-2 text-sm">
                                            Events
                                        </p>
                                        {Array.from({
                                            length: 3
                                        }).map((_, index) => <Card key={index} className="relative flex w-full items-end bg-cover bg-center select-none overflow-hidden h-[80px] mb-1" style={{
                                            backgroundImage: `url('/rolingLoud.webp')`
                                        }}>
                                            <div className="absolute inset-0 bg-black opacity-50"></div>
                                            <CardContent className="flex items-center h-full w-full">
                                                <div className="bg-neutral-800 w-[75px] rounded-md h-full flex ">
                                                    <div className="flex flex-col items-center justify-center w-full h-full z-10">
                                                        <p className="font-bold text-white">May</p>
                                                        <p className="text-4xl font-bold text-white">18</p>

                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-bold ml-2 text-white z-10">Location</p>
                                                    <p className="text-sm font-bold ml-2 text-white z-10">Name</p>
                                                    <p className="text-sm font-bold ml-2 text-white z-10">Mon. 17:00</p>
                                                </div>
                                            </CardContent>
                                        </Card>)}
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
