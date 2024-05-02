"use client"
import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/service/authService';
import toast from 'react-hot-toast';
import { RootStoreContext } from '@/providers/rootStoreProvider';
import  Image  from 'next/image';

const page = () => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const rootStore = useContext(RootStoreContext);
  const { userStore } = rootStore;

  useEffect(() => {
    (async () => {
      const queryParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const code = queryParams ? queryParams.get('code') : null;
      const state = queryParams ? queryParams.get('state') : null;

      if (code && !isProcessing) {
        setIsProcessing(true);
        try {
          const response = await AuthService.verifySpotify(code);
          if (response?.status === 200) {
            userStore.setUser(response);
            toast.success('Successfully authenticated with Spotify.');
            router.push('/home');
          };
        } catch (error) {
          console.error(error);
          toast.error('Authorization error. Please try again.');
          router.push('/auth/login');
        }
      }
    })();
  }, []);

  return (
  <div className="h-full w-full flex justify-center items-center">
    <div className=" animate-spin animate-infinite animate-duration-[1500ms] animate-ease-in-out">
      <Image src="/Spotify.png" width={50} height={50}/>
    </div>
  </div>
  )
};

export default page;