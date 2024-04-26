"use client"

import { useState, useEffect } from 'react';



import { Input } from '@/components/ui/input';



import { Main } from './main';
import { OpenLeftBar } from './openLeftBar';
import CreateNew from './createNew';
import Edit from './edit';
import { RightBar } from './rightBar';
import { Skeleton } from "@/components/ui/skeleton"


const Render = ({ res }) => {
    const [organization, setOrganization] = useState(res);
    const [search, setSearch] = useState('');


    const isVerified = organization.IsVerified;

    return (
        <div className='flex bg-muted h-full'>
            <div className="rounded-md mt-2 flex flex-col w-full xl:mr-[415px]">
                <Main isVerified={isVerified} organization={organization} />
                <OpenLeftBar isVerified={isVerified} organization={organization} />
                <div className='bg-background rounded-t-md h-full ipad:p-5'>
                    <div className='flex justify-center items-center w-full gap-2 border-b pb-5'>
                        <CreateNew organization={organization} />

                        <Input
                            placeholder='Search organization'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <Edit organization={organization} setOrganization={setOrganization} />
                    </div>
                    {
                        Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className='flex pt-12 pl-12 w-full gap-4'>
                                <Skeleton className="h-[200px] w-[200px] rounded-lg" />
                                <div className=' flex flex-col gap-8 py-6'>
                                    <Skeleton className="h-4 w-[300px] rounded-md" />
                                    <div className=' flex flex-col gap-2'>
                                        <Skeleton className="h-4 w-[200px] rounded-md" />
                                        <Skeleton className="h-4 w-[200px] rounded-md" />
                                        <Skeleton className="h-4 w-[250px] rounded-md" />
                                    </div>
                                    <Skeleton className="h-4 w-[200px] rounded-md" />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className="z-10 h-full hidden xl:block ">
                <div className="fixed top-[55px] bottom-0 right-0 h-full m-2 w-[400px]">
                    <div className="bg-background h-full rounded-md">
                        <RightBar isVerified={isVerified} organization={organization} className="h-full w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Render;
