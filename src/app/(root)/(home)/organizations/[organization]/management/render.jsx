"use client"

import { useState, useEffect } from 'react';



import { Input } from '@/components/ui/input';



import { Main } from './main';
import { OpenLeftBar } from './openLeftBar';
import CreateNew from './createNew';
import Edit from './edit';
import { RightBar } from './rightBar';


const Render = ({ res }) => {
    const [organization, setOrganization] = useState(res);
    const [search, setSearch] = useState('');
    const [selectedPlace, setSelectedPlace] = useState(organization.location);

    useEffect(() => {
        console.log(organization)
    }
        , [organization])

    const isVerified = organization.IsVerified;

    return (
        <div className='grid grid-cols-4 bg-muted h-full'>
            <div className=" lg:col-span-3 col-span-4 rounded-md mt-2 flex flex-col">
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
                </div>
            </div>
            <div className="lg:col-span-1 z-10 h-full hidden lg:block ">
                <div className="flex flex-col fixed h-full m-2">
                    <div className="bg-background h-full rounded-md">
                        <RightBar isVerified={isVerified} selectedPlace={selectedPlace} organization={organization} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Render;
