import {useEffect, useContext } from 'react';
import { useRouter } from "next/navigation";
import { RootStoreContext } from '@/providers/rootStoreProvider';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const rootStore = useContext(RootStoreContext);
    const router = useRouter();
    const { userStore } = rootStore;
    
    useEffect(() => {
      const timeoutId = setTimeout(() => {
        if (userStore.user._id === undefined || userStore.user._id === null) {
          router.push('/auth/login');
        }
      }, 5000);
      return () => clearTimeout(timeoutId);
    }, [userStore.user._id, router]);

    return userStore.user._id !== undefined ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
