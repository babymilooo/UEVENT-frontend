'use client'

import React from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';


const Navbar = () => {
    const router = useRouter();
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="hidden md:flex">
                    <a className="text-xl text-foreground" href="">Navbar</a>
                </div>
                <div className='flex flex-1 items-center justify-between space-x-2 md:justify-end'>
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