'use client'

import React, { useState } from 'react';
import Main from '@/components/eventComponents/main';
import RightBar from '@/components/eventComponents/rightBar';

const Events = ({ org, eventData }) => {
    const [event, setEventData] = useState(eventData);

    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col overflow-x-hidden pt-16 w-full h-full xl:mr-[415px] rounded-t-lg">
            <Main eventData={event} org={org} setEventData={setEventData} />
            <div className='flex bg-background h-full w-full'>
                sadsad
            </div>

            <div className="fixed top-[55px] bottom-0 right-0 h-full m-2 w-[400px] bg-muted hidden xl:block">
                <div className="bg-background h-full rounded-md">
                    <RightBar eventData={event}  org={org} />
                </div>
            </div>
        </div>
    );
};

export default Events;