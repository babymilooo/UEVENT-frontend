import Navbar from '@/components/navbar/Navbar';
import { Toaster } from 'react-hot-toast';

export default async function Layout({ children }) {
  return (
    <div className='flex flex-col h-screen'>
      <Navbar />
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className='flex-grow h-full'>
        {children}
      </div>

    </div>
  );
}
