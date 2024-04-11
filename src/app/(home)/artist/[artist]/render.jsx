"use client"
import { useEffect, useState } from 'react';
import Image from 'next/image';

const Render = ({ artist }) => {
    console.log(artist);
    const isVerified = artist.followers.total > 5000;

    useEffect(() => {
        const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        const filteredHistory = history.filter(id => id !== artist.id);
        const updatedHistory = [artist.id, ...filteredHistory];
        localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
    }, []);

    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col bg-muted overflow-x-hidden select-none" style={{ height: `calc(100vh - 57px)`, overflowY: 'auto' }}>
            <div className='px-5 pt-20 pb-5 flex'>
                <Image src={artist.images[1].url} alt='logo' height={200} width={200} className='rounded-md' />
                <div className='pl-5 flex-col'>
                    {isVerified && (
                        <div className="flex items-center">
                            <Image src="/verified.svg" alt="verified" width={20} height={20} />
                            <div className="text-primary">Verified</div>
                        </div>
                    )}
                    <h1 className='text-6xl font-bold'>{artist.name}</h1>
                    <p className=' text-muted-foreground'>{artist.genres[0]}</p>
                    <p className='text-xl mt-16 '>{artist.followers.total} followers</p>
                </div>

            </div>
            <div className='bg-background mr-2 rounded-t-md h-full'>
            </div>
        </div>
    );
};

export default Render;