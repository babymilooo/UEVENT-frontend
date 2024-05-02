import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import AuthService from '@/service/authService';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        const response = await AuthService.checkToken();
        if (response.data) {
          console.log('User is logged in');
          setLoading(false);
        } else {
          router.push('/auth/login');
        }
      }
      checkAuth();
    }, []);


    return !loading ? <WrappedComponent {...props} /> : null;
  };
};

export default observer(withAuth);
