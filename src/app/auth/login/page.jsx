"use client"

import { Input } from '@/components/ui/input';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const page = () => {
    const router = useRouter();
    return (
        <div className="flex min-h-screen justify-center items-center bg-background">
            <div className="w-1/2 min-h-full flex items-center border-foreground border rounded-lg overflow-hidden">
                <div className="w-1/2 mx-12 mt-16 mb-32">
                    <p className="p-12 text-foreground text-center text-3xl font-bold">Welcome back</p>
                    <div className="flex flex-col gap-2 mx-16">
                        <Input placeholder="Email" />
                        <Input placeholder="Password" />
                        <a href="" className="text-xs text-foreground text-end underline">Forgot password?</a>
                        <button className="bg-lime-400 px-6 py-3 rounded-md font-bold text-xs text-black">Login</button>
                        <div className="flex text-xs text-foreground">
                            <p>Don't have an account?</p>
                            <p className="underline cursor-pointer" onClick={() => router.push("/auth/registration")}>Sign up</p>
                        </div>
                        <div className="mt-12 flex items-center justify-center border border-foreground px-6 py-2 rounded-md text-xs font-bold cursor-pointer">
                            <Image src="/spotify-2.svg" alt="spotify" width={20} height={20} className="mr-1" />
                            <p>
                                Login with Spotify
                            </p>
                        </div>
                    </div>
                </div>
                <Image src="/gradient.jpeg" width={400} height={700} className="rotate-180 rounded-lg mr-8" />
            </div>
        </div >
    );
};

export default page;