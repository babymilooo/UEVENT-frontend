import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from './../components/navbar/Navbar';
import { Toaster } from 'react-hot-toast';
import UserService from "@/service/userService";
import AuthService from "@/service/authService";
const inter = Inter({ subsets: ["latin"] });
import { cookies } from 'next/headers'

export const metadata = {
  title: "UCODE MUISIC",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const user = await getServerSideProps();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar user={user} />
        <Toaster position="bottom-right" reverseOrder={false} />
        {children}
      </body>
    </html>
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