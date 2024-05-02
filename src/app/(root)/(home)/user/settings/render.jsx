"use client";

import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import withAuth from '@/components/withAuth';
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
import {
    Dialog,
    DialogOverlay,
    DialogDescription,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { passwordRegex } from '@/lib/passwordRegex';
import $api from '@/https/axios';
import toast from 'react-hot-toast';
import AuthService from '@/service/authService';
const Page = () => {

    const router = useRouter();
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;
    const [email, setEmail] = useState(userStore.user?.email);
    const [isModified, setIsModified] = useState(userStore.user?.emailVerified);
    const [username, setUsername] = useState(userStore.user?.userName);
    const [profilePic, setProfilePic] = useState(userStore.user?.profilePicture);
    const [selectedImage, setSelectedImage] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [auth, setAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const response = await AuthService.checkToken();
            if (response.data) {
                console.log('User is logged in');
                setAuth(false);
            } else {
                router.push('/auth/login');
            }
        }
        checkAuth();
    }, []);

    if (auth) {
        return null;
    }

    const handleDelete = async () => {
        try {
            await userStore.deleteAccount();
            router.push("/");
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    }

    const handleChange = async () => {
        const userdata = { userName: username };
        try {
            await userStore.updateUser(userdata, selectedImage);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePic(reader.result);
                handleLogoChange(e);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoChange = (e) => {
        setSelectedImage(e.target.files[0]);
    };

    const handlePasswordChange = async () => {
        if (!newPassword.trim().match(passwordRegex)) return;
        try {
            await $api.patch(`/user/edit-password`, { newPassword: newPassword.trim(), currentPassword: currentPassword.trim() });
            router.push('/auth/login');
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    return (
        <Tabs defaultValue="account" className="xl:pl-[250px] lg:pl-[200px] flex flex-col items-center overflow-x-hidden pt-14 select-none h-full justify-center">
            {!userStore.user?.isRegisteredViaSpotify && (
                <>
                    <TabsList className="grid grid-cols-2 w-[500px]">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>

                    <TabsContent value="account" className="w-[500px]">
                        <Card className="p-4 border rounded-lg">
                            <CardHeader className="mb-4">
                                <CardTitle className="text-lg font-semibold">Account</CardTitle>
                                <CardDescription>
                                    Make changes to your account here. Click save when you&apos;re done.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col md:flex-row gap-4">
                                <div className="flex justify-center md:justify-start md:flex-initial mb-4 md:mb-0">
                                    <div onClick={() => document.getElementById('profile-picture').click()} className="cursor-pointer">

                                        <Image src={profilePic ? profilePic : "/bigLogo.png"} alt='logo' height={200} width={200} className='rounded-lg h-[200px]' style={{
                                            objectFit: 'cover',
                                            objectPosition: 'center'
                                        }} />
                                        <Input
                                            type="file"
                                            id="profile-picture"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <div className="grid gap-2 mb-4 mt-4">
                                        <div className="relative flex items-center">
                                            <Input
                                                disabled
                                                type="email"
                                                defaultValue={userStore.user?.email}
                                                placeholder="Email"
                                                className="w-full px-3 py-2 border rounded-l"
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                {userStore.user?.emailVerified ? (
                                                    <span className="text-green-500">✔️</span>
                                                ) : (
                                                    <span className="text-red-500">✖️</span>
                                                )}
                                            </div>
                                        </div>

                                        <Input
                                            id="username"
                                            defaultValue={userStore.user?.userName}
                                            placeholder="Username"
                                            className="w-full px-3 py-2 border rounded"
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <Button className="px-4 py-2 rounded hover:bg-lime-600 focus:outline-none" onClick={handleChange}>
                                            Save changes
                                        </Button>
                                    </div>
                                </div>

                            </CardContent>

                        </Card>
                    </TabsContent>

                    <TabsContent value="password" className="w-[500px]">
                        <Card className="p-4 border rounded-lg">
                            <CardHeader className="mb-6">
                                <CardTitle className="text-lg font-semibold">Password</CardTitle>
                                <CardDescription>
                                    Change your password here. After saving, you&apos;ll be logged out.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-center">
                                    <div className="w-full sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3">
                                        <Input
                                            id="current"
                                            placeholder="Current Password"
                                            type="password"
                                            autocomplete="current-password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className="w-full px-3 py-2 border rounded shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-lime-500 focus:border-lime-500"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <div className="w-full sm:w-2/3 md:w-1/2 lg:w-2/5 xl:w-1/3">
                                        <Input
                                            id="new"
                                            placeholder="New Password"
                                            type="password"
                                            autocomplete="new-password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full px-3 py-2 border rounded shadow-sm placeholder-gray-400 focus:ring-1 focus:ring-lime-500 focus:border-lime-500"
                                        />
                                    </div>

                                </div>
                                <p
                                    className="m-auto p-0 text-red-500 text-center max-w-96"
                                    hidden={newPassword.trim().match(passwordRegex) || newPassword.length === 0}
                                >
                                    Passwords must be at least 8 characters long, have 1 letter and 1 number and no whitespaces
                                </p>

                            </CardContent>
                            <CardFooter className="flex justify-center pt-4">
                                <Button className="px-4 py-2 rounded hover:bg-lime-600 focus:outline-none" onClick={handlePasswordChange}>
                                    Save password
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </>
            )}

            {userStore.user?.isRegisteredViaSpotify && (
                <>
                    <div className="mt-8 text-center">
                        <a
                            href="https://www.spotify.com/account/profile/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-10 py-3 font-bold rounded-full bg-black text-white flex items-center justify-center gap-2"
                            style={{ backgroundColor: '#000000', minWidth: '300px' }}
                        >
                            <img src="/spotify-2.svg" alt="Spotify" className="h-6" />
                            <span>Go to Spotify Account</span>
                        </a>
                    </div>
                </>
            )}


            <div className="mt-8 mb-4 text-center">

                <Dialog className="col-span-1">
                    <DialogTrigger>
                        <Button className="px-6 py-3 text-white font-bold rounded bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                            DELETE ACCOUNT
                        </Button>
                    </DialogTrigger>
                    <DialogOverlay />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </DialogDescription>
                            <DialogClose className='flex justify-end'>
                                <Button variant="destructive" className="w-24" onClick={handleDelete}>delete</Button>
                            </DialogClose>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
            
        </Tabs>
    );
};

export default observer(Page);