import React from 'react';

const Render = () => {
    return (
        <div>
            <div className="relative flex h-[360px] w-full items-end bg-cover bg-center select-none overflow-hidden"
                style={{
                    backgroundImage: `url('/rolingLoud.webp')`,
                }}>
                <div className="absolute bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-black to-transparent"></div>
                <p className="relative mb-[50px] ml-6 font-bold xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-xl text-white z-10">Organizator</p>
            </div>
        </div>
    );
};

export default Render;