"use client"
import { useState } from 'react';

const Render = ({ artist }) => {
    return (
        <div className="xl:pl-[250px] lg:pl-[200px] flex items-center overflow-x-hidden">
            {artist.name}
        </div>
    );
};

export default Render;