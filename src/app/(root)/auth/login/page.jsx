"use client"

import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card"
import AuthService from '@/service/authService';
import toast from 'react-hot-toast';
import { RootStoreContext } from '@/providers/rootStoreProvider';
import { observer } from "mobx-react-lite";
const page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const rootStore = useContext(RootStoreContext);
    const { userStore } = rootStore;

    const handeLogin = async () => {
        // const responce = await AuthService.login(email, password);
        const response = await userStore.login(email, password);
        if (response?.status === 200) {
            router.push("/home");
            toast.success("Login success");
        }
    }

    const handeAuthSpotify = async (state) => {
        const responce = await AuthService.authSpotify(state);
        if (responce?.status === 200)
            window.location.href = responce.data;
    }

    return (
        <div className="flex justify-center items-center bg-background my-32">
            <div className="ipad:m-2 flex items-center border-foreground border rounded-lg overflow-hidden">
                <div className="lg:w-1/2 ipad:w-1/3 lg:ml-12 lg:mt-16 lg:mb-32">
                    <p className="p-12 text-foreground text-center text-3xl font-bold">Welcome back</p>
                    <div className="flex flex-col gap-2 lg:mx-16 mx-2">
                        <Input placeholder="Email" onChange={e => setEmail(e.target.value)} />
                        <Input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
                        <a href="" className="text-xs text-foreground text-end underline">Forgot password?</a>
                        <button className="bg-lime-400 px-6 py-3 rounded-md font-bold text-xs text-black" onClick={handeLogin}>Login</button>
                        <div className="flex text-xs text-foreground">
                            <p>Don't have an account?</p>
                            <p className="underline cursor-pointer ml-1" onClick={() => router.push("/auth/registration")}>Sign up</p>
                        </div>
                        <div className="lg:mt-12 mb-2 flex items-center justify-center border border-foreground px-6 py-2 rounded-md text-xs font-bold cursor-pointer"
                            onClick={() => handeAuthSpotify("login")}>
                            <Image src="/spotify-2.svg" alt="spotify" width={20} height={20} className="mr-1" />
                            <p>
                                Login with Spotify
                            </p>
                        </div>
                    </div>
                </div>
                {/* <Image src="/gradient.jpeg" width={400} height={700} className="rotate-180 rounded-lg mr-8" /> */}
                <Card className="xl:h-[500px] lg:h-[500px] ipad:h-[300px] hidden ipad:block lg:mx-14 ml-14">
                    <CardContent className="flex h-full p-20 bg-cover bg-center rounded-md items-center justify-center select-none "
                        style={{
                            backgroundImage: `url('/gradient.jpeg')`,
                        }}>
                        <Image src="/bigLogo.png" alt='logo' height={40} width={1000} className='rounded-xl w-[40px] lg:w-[100px] ipad:w-[50px]' />
                        <Image src="/logoWord.png" alt="word" height={40} width={1000} className='rounded-xl w-[60px] lg:w-[250px] ipad:w-[175px] hidden ipad:block' />
                    </CardContent>
                </Card>
            </div>
        </div >
    );
};

export default observer(page);