import Navbar from '@/components/navbar/Navbar';
import { Toaster } from 'react-hot-toast';


import AuthService from "@/service/authService";
import { cookies } from 'next/headers'

export default async function Layout({ children }) {
  const user = await getServerSideProps();
  return (
    <div>
      <Navbar user={user} />
      <Toaster position="bottom-right" reverseOrder={false} />
      {children}
    </div>
  );
}

async function getServerSideProps() {
  const accessToken = cookies().get('accessToken');
  const refreshToken = cookies().get('refreshToken');
  const res = await AuthService.checkAuth(accessToken, refreshToken);
  if (!res) {
    return null;
  }
  const artist = res.data;
  return artist;
}
