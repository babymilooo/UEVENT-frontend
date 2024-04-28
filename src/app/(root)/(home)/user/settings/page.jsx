"use client";

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { RootStoreContext } from '@/providers/rootStoreProvider';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";

const page = () => {
    const [profilePic, setProfilePic] = useState(null);

    const handleFileChange = (event) => {
        setProfilePic(URL.createObjectURL(event.target.files[0]));
    };

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

    return (
        <Tabs defaultValue="account" className="mx-auto my-8">
            {!userStore.user?.isRegisteredViaSpotify && (
                <>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
                <Card className="p-4 border rounded-lg">
                    <CardHeader className="mb-4">
                        <CardTitle className="text-lg font-semibold">Account</CardTitle>
                        <CardDescription>
                            Make changes to your account here. Click save when you're done.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-4">
                        <div className="flex justify-center md:justify-start md:flex-initial mb-4 md:mb-0">
                            <div onClick={() => document.getElementById('profile-picture').click()} className="cursor-pointer">

                            <Image src={profilePic || userStore.user?.profilePicture || "/bigLogo.png"} alt='Profile Picture' height={200} width={200} className='rounded-md' />
                                <Input
                                type="file"
                                id="profile-picture"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                />
                            </div>
                        </div>
                        
                        <div className="flex-grow">
                            <div className="grid gap-2 mb-4 mt-4">
                                <Input 
                                    type="email" 
                                    defaultValue={userStore.user?.email} 
                                    placeholder="Email" 
                                    className="w-full px-3 py-2 border rounded" 
                                />
                                <Input 
                                    id="username" 
                                    defaultValue={userStore.user?.userName} 
                                    placeholder="Username" 
                                    className="w-full px-3 py-2 border rounded" 
                                />
                            </div>
                            <div className="text-center">
                                <Button className="px-4 py-2 rounded hover:bg-lime-600 focus:outline-none">
                                    Save changes
                                </Button>
                            </div>
                        </div>
                    </CardContent>

                </Card>
            </TabsContent>
            
            <TabsContent value="password">
                <Card className="p-4 border rounded-lg">
                    <CardHeader className="mb-6">
                        <CardTitle className="text-lg font-semibold">Password</CardTitle>
                        <CardDescription>
                            Change your password here. After saving, you'll be logged out.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
                                <Input 
                                    id="current"  
                                    placeholder="Current Password"  
                                    type="password" 
                                    className="w-full px-3 py-2 border rounded shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-lime-500 focus:border-lime-500" 
                                />
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4">
                                <Input 
                                    id="new"  
                                    placeholder="New Password"  
                                    type="password" 
                                    className="w-full px-3 py-2 border rounded shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-lime-500 focus:border-lime-500" 
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center pt-4">
                        <Button className="px-4 py-2 rounded hover:bg-lime-600 focus:outline-none">
                            Save password
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            </>
            )}
            
            <div className="mt-8 text-center">
                <a
                    href="https://www.spotify.com/account/profile/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-10 py-3 font-bold rounded-full bg-black text-white flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#000000', minWidth: '300px' }}
                >
                <img src="/spotify-2.svg" alt="Spotify" className="h-6"/> 
                <span>Go to Spotify Account</span>
                </a>
            </div>



            <div className="mt-8 mb-4 text-center">
                <Button className="px-6 py-3 text-white font-bold rounded bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                    DELETE ACCOUNT
                </Button>
            </div>
        </Tabs>
    );
};

export default page;
