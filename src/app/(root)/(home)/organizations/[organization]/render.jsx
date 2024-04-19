import React from 'react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Image from 'next/image';

const Render = () => {
    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col items-center overflow-x-hidden">
            <div className="relative flex h-[360px] w-full items-end bg-cover bg-center select-none overflow-hidden"
                style={{
                    backgroundImage: `url('/rolingLoud.webp')`,
                }}>
                <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>

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
                </div>
            </div>
        </div>
    );
};

export default Render;