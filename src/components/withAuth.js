import { useEffect, useContext } from 'react';
import { useRouter } from "next/navigation";
import { RootStoreContext } from '@/providers/rootStoreProvider';
import { observer } from 'mobx-react-lite';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const rootStore = useContext(RootStoreContext);
    const router = useRouter();
    const { userStore } = rootStore;

    useEffect(() => {
      if (userStore.user._id === undefined || userStore.user._id === null) {
        router.push('/auth/login');
      }
    }, [userStore.user]);

    return userStore.user._id !== undefined ? <WrappedComponent {...props} /> : null;
  };
};

export default observer(withAuth);
