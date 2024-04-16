import Navbar from '@/components/navbar/Navbar';
import { Toaster } from 'react-hot-toast';

export default async function Layout({ children }) {
  return (
    <div className=''>
      <Navbar />
      <Toaster position="bottom-right" reverseOrder={false} />
      {children}
    </div>
  );
}
