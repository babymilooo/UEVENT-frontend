'use client'

import React from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


const Navbar = () => {
    const router = useRouter();
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="hidden ipad:flex">
                    <div className="text-xl text-foreground flex items-center cursor-pointer" onClick={() => router.push("/home")}>
                        <Image src="/bigLogo.png" height={40} width={35} />
                        <Image src="/logoWord.png" height={40} width={100} />
                    </div>
                </div>
                <div className='flex flex-1 items-center space-x-2 justify-end'>
                    <Button variant="ghost" onClick={() => router.push("/auth/login")}>login</Button>
                    <button className=" bg-lime-400 px-6 py-3 rounded-3xl font-bold text-xs" onClick={() => router.push("/auth/registration")} >
                        Registration
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Navbar;