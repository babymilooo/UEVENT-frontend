"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/service/authService';
import toast from 'react-hot-toast';

const page = () => {
  console.log('============');
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false); 

  useEffect(() => {
    (async () => {
      const queryParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const code = queryParams ? queryParams.get('code') : null;
      const state = queryParams ? queryParams.get('state') : null;
      console.log(code, state);
      
      if (code && !isProcessing) {
        setIsProcessing(true);
        try {
          const response = await AuthService.verifySpotify(code);
          console.log(response);
          if (response?.status === 200) {
            toast.success('Successfully authenticated with Spotify.');
            router.push('/home');
          } router.push('/auth/login');
        } catch (error) {
          console.error(error);
          toast.error('Authorization error. Please try again.');
          router.push('/auth/login');
        }
      }
    })();
  }, []);

  return <div>Loading....</div>;
};

export default page;