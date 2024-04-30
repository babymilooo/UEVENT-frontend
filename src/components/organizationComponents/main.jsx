"use client"
import React from "react";
import Image from 'next/image';

export function Main({
    isVerified,
    organization
}) {
    return <div className='ipad:px-5 ipad:pt-20 pt-5 ipad:pb-5 items-center flex flex-col ipad:flex-row w-full'>
        <Image src={organization.logo ? organization.logo : "/BigLogo.png"} alt='logo' height={200} width={200} className='rounded-lg h-[200px]' style={{
            objectFit: 'cover',
            objectPosition: 'center'
        }} />
        <div className='ipad:pl-5 flex-col'>
            {organization.isVerified && (
                <div className="flex items-center gap-2 mr-4">
                    <Image src="/verified.svg" alt="verified" width={20} height={20} />
                    <div className="text-primary">Verified</div>
                </div>)
            }

            <h1 className='iphone:text-6xl text-5xl font-bold pt-5 ipad:pt-0'>{organization.name}</h1>

            <div className='flex items-center ipad:justify-normal justify-between ipad:mt-16 mb-5 ipad:mb-0 gap-1 '>
                <div className='flex items-center gap-1'>
                    <p className='text-xl font-bold'>{organization.followerCount}</p>
                    <p className='font-bold text-xs pt-1'>Followers</p>
                </div>
            </div>
        </div>
    </div>;
}
