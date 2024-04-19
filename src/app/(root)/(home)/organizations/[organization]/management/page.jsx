import React from 'react';
import Render from './render';

const page = () => {
    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex flex-col h-full">
            <Render />
        </div>
    );
};

export default page;