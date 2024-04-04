import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
const SideBar = () => {
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
                    <Input type="username" placeholder="find artist"/>
                </div>
            </div>
        </div>
    );
};

export default SideBar;