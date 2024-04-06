import Image from 'next/image';
import React from "react";

export function Footer({ }) {
    return <footer className="fixed bottom-0 inset-x-0 lg:hidden bg-white h-[50px] shadow-md border-t z-50">
        <div className="grid grid-cols-3 items-center h-full">
            <div className="flex justify-end"> {
                /* Left column */
            }
                <div className="flex flex-col items-center cursor-pointer">
                    {
                        /* Убедитесь, что Image является компонентом Next.js и он правильно импортирован и используется */
                    }
                    <Image src="/home.svg" alt="home" width={20} height={20} />
                    <p className="text-xs">Home</p>
                </div>
            </div>
            <div className="flex justify-center"> {
                /* Center column */
            }
                <div className="flex flex-col items-center cursor-pointer">
                    <Image src="/search.svg" alt="search" width={20} height={20} />
                    <p className="text-xs">Search</p>
                </div>
            </div>
            <div className="flex justify-start"> {
                /* Right column */
            }
                <div className="flex flex-col items-center cursor-pointer">
                    <Image src="/library.svg" alt="library" width={20} height={20} />
                    <p className="text-xs">Your library</p>
                </div>
            </div>
        </div>
    </footer>;
}
