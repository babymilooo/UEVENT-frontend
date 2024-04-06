'use client'

import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RootStoreContext } from '@/providers/rootStoreProvider';
import {
    Popover as MyPopover,
    PopoverContent as MyPopoverContent,
    PopoverTrigger as MyPopoverTrigger
} from '@/components/popover/MyPopover';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Tooltip from '../tooltip/tooltip';


const Navbar = () => {
    const router = useRouter();
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;


    return (

        !userStore.isLoggedIn ? (

            < header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" >
                <div className="container flex h-14 max-w-screen-2xl items-center">
                    <div className="hidden ipad:flex">
                        <div className="text-xl text-foreground flex items-center cursor-pointer" onClick={() => router.push("/home")}>
                            <Image src="/bigLogo.png" alt='logo' height={40} width={35} />
                            <Image src="/logoWord.png" alt='word' height={40} width={100} />
                        </div>
                    </div>
                    <div className='flex flex-1 items-center space-x-2 justify-end'>
                        <Button variant="ghost" onClick={() => router.push("/auth/login")}>login</Button>
                        <button className=" bg-lime-400 px-6 py-3 rounded-3xl font-bold text-xs" onClick={() => router.push("/auth/registration")} >
                            Registration
                        </button>
                    </div>
                </div>
            </header >
        ) : (
            < header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" >
                <div className="container flex h-14 max-w-screen-2xl items-center">
                    <div className="hidden ipad:flex">
                        <div className="text-xl text-foreground flex items-center cursor-pointer" onClick={() => router.push("/home")}>
                            <Image src="/bigLogo.png" alt='logo' height={40} width={35} />
                            <Image src="/logoWord.png" alt='word' height={40} width={100} />
                        </div>
                    </div>
                    <div className='flex flex-1 items-center space-x-2 justify-end cursor-pointer'>
                        <MyPopover>
                            <MyPopoverTrigger>
                                <Tooltip text={userStore.user?.userName}>
                                    <Avatar>
                                        <AvatarImage src={userStore.user?.image} alt="@avatar" className="w-[100px]" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Tooltip>
                            </MyPopoverTrigger>
                            <MyPopoverContent className="rounded-lg">
                                <div className="flex flex-col font-bold">
                                    <div className="pt-4 pl-4 cursor-pointer">
                                        account
                                    </div>
                                    <div className="p-4 cursor-pointer ">
                                        settings
                                    </div>
                                    <div className="w-full border-t">
                                        <p className="p-4 cursor-pointer">
                                            Logout
                                        </p>
                                    </div>
                                </div>
                            </MyPopoverContent>
                        </MyPopover>
                    </div>
                </div>
            </header >)

    );
};

export default Navbar;