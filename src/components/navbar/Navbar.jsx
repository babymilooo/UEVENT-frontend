'use client'

import React, { useContext, useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RootStoreContext } from '@/providers/rootStoreProvider';
import { observer } from 'mobx-react-lite';
import { Skeleton } from "@/components/ui/skeleton"
import {
    Popover as MyPopover,
    PopoverContent as MyPopoverContent,
    PopoverTrigger as MyPopoverTrigger
} from '@/components/popover/MyPopover';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import Tooltip from '../tooltip/tooltip';

const Navbar = () => {
    const router = useRouter();
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await userStore.checkAuth();
                if (response?.status !== 200) {
                    setLoading(false);
                } else {
                    setLoading(false);
                    userStore.setLoggedIn(true);
                }
            } catch (error) {
                console.error("Authentication check failed", error);
            }
        };

        checkAuthentication();
    }, [userStore]);


    const handleLogout = async () => {
        try {
            await userStore.logout();
            router.push("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (loading) {
        return < header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" >
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="hidden ipad:flex">
                    <div className="text-xl text-foreground flex items-center cursor-pointer" onClick={() => router.push("/home")}>
                        <Image src="/bigLogo.png" alt='logo' height={40} width={35} />
                        <Image src="/logoWord.png" alt='word' height={40} width={100} />
                    </div>
                </div>
                <div className='flex flex-1 items-center space-x-2 justify-end'>
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                </div>
            </div>
        </header >;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" >
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="hidden ipad:flex">
                    <div className="text-xl text-foreground flex items-center cursor-pointer" onClick={() => router.push("/home")}>
                        <Image src="/bigLogo.png" alt='logo' height={40} width={35} />
                        <Image src="/logoWord.png" alt='word' height={40} width={100} />
                    </div>
                </div>

                {
                    !userStore.isLoggedIn ? (
                        <div className='flex flex-1 items-center space-x-2 justify-end'>
                            <Button variant="ghost" onClick={() => router.push("/auth/login")}>login</Button>
                            <button className=" bg-lime-400 px-6 py-3 rounded-3xl font-bold text-xs" onClick={() => router.push("/auth/registration")} >
                                Registration
                            </button>
                        </div>) : (
                        <div className='flex flex-1 items-center space-x-2 justify-end cursor-pointer'>
                            <MyPopover>
                                <MyPopoverTrigger>
                                    <Tooltip text={userStore.user?.userName}>
                                        <Avatar>
                                            <AvatarImage src={userStore.user?.profilePicture} alt="@avatar" className="w-10" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </Tooltip>
                                </MyPopoverTrigger>
                                <MyPopoverContent className="rounded-lg">
                                    <div className="flex flex-col font-bold">
                                        <div className="p-3 pl-4 cursor-pointer hover:bg-muted" onClick={() => router.push(`/user/${userStore.user?._id}`)}>
                                            account
                                        </div>
                                        <div className="p-3 pl-4 cursor-pointer hover:bg-muted" onClick={() => router.push("/organizations")}>
                                            <p>
                                                My organizations
                                            </p>
                                        </div>
                                        <div className="p-3 pl-4 cursor-pointer hover:bg-muted">
                                            settings
                                        </div>
                                        <div className="w-full border-t">
                                            <p className="p-4 cursor-pointer" onClick={handleLogout}>
                                                Logout
                                            </p>
                                        </div>
                                    </div>
                                </MyPopoverContent>
                            </MyPopover>
                        </div>)
                }
            </div>
        </header >
    );
};

export default observer(Navbar);

// export async function getServerSideProps(context) {
//     const cookie = context.req.headers.cookie;
//     // const response = await AuthService.checkAuth(cookie);
//     const response = await user.checkAuth(cookie);
//     return {
//         props: {
//             response, // Передаем ответ как проп в ваш компонент
//         },
//     };
// }