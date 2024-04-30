"use client";

import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import AuthService from "@/service/authService";
import toast from "react-hot-toast";
import { RootStoreContext } from "@/providers/rootStoreProvider";
import { observer } from "mobx-react-lite";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import $api from "@/https/axios";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passResetEmail, setPassResetEmail] = useState("");
  const [openResetModal, setOpenResetModal] = useState(false);
  const router = useRouter();
  const rootStore = useContext(RootStoreContext);
  const { userStore } = rootStore;

  const handeLogin = async () => {
    // const responce = await AuthService.login(email, password);
    const response = await userStore.login(email, password);
    if (response?.status === 200) {
      router.push("/home");
      toast.success("Login success");
    }
  };

  const handleSendPassReset = async () => {
    const resp = await $api.post(`/auth/password-reset/send-email`, { email: passResetEmail.trim() });
    toast.success("Email has been sent");
    setOpenResetModal(false);
  }

  const handeAuthSpotify = async (state) => {
    const responce = await AuthService.authSpotify(state);
    if (responce?.status === 200) window.location.href = responce.data;
  };

  return (
    <div className="flex justify-center items-center bg-background h-full">
      <div className="ipad:m-2 flex items-center border-foreground border rounded-lg overflow-hidden">
        <div className="lg:w-1/2 ipad:w-1/3 lg:ml-12 lg:mt-16 lg:mb-32">
          <p className="p-12 text-foreground text-center text-3xl font-bold">
            Welcome back
          </p>
          <div className="flex flex-col gap-2 lg:mx-16 mx-2">
            <Input
              placeholder="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="Password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Dialog open={openResetModal} onOpenChange={setOpenResetModal}>
              <DialogTrigger asChild>
                <span className="text-xs text-foreground text-end underline cursor-pointer">
                  Forgot password?
                </span>
              </DialogTrigger>
              <DialogOverlay />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                  <DialogDescription>
                    Enter your email. A link will be sent to you to reset your
                    password
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-row justify-center items-center gap-3">
                  <Input
                    placeholder="Email"
                    type="email"
                    value={passResetEmail}
                    onChange={(e) => setPassResetEmail(e.target.value)}
                  />
                  <button
                    className="bg-lime-400 px-8 py-4 rounded-3xl font-bold text-xs text-black"
                    type="button"
                    onClick={handleSendPassReset}
                  >Send</button>
                </div>
              </DialogContent>
            </Dialog>

            <button
              className="bg-lime-400 px-6 py-3 rounded-md font-bold text-xs text-black"
              type="button"
              onClick={handeLogin}
            >
              Sign in
            </button>
            <div className="flex text-xs text-foreground">
              <p>Don&apos;t have an account?</p>
              <p
                className="underline cursor-pointer ml-1"
                onClick={() => router.push("/auth/registration")}
              >
                Sign up
              </p>
            </div>
            <div
              className="lg:mt-12 mb-2 flex items-center justify-center border border-foreground px-6 py-2 rounded-md text-xs font-bold cursor-pointer"
              onClick={() => handeAuthSpotify("login")}
            >
              <Image
                src="/spotify-2.svg"
                alt="spotify"
                width={20}
                height={20}
                className="mr-1"
              />
              <p>Continue with Spotify</p>
            </div>
          </div>
        </div>
        {/* <Image src="/gradient.jpeg" width={400} height={700} className="rotate-180 rounded-lg mr-8" /> */}
        <Card className="xl:h-[500px] lg:h-[500px] ipad:h-[300px] hidden ipad:block lg:mx-14 ml-14">
          <CardContent
            className="flex h-full p-20 bg-cover bg-center rounded-md items-center justify-center select-none "
            style={{
              backgroundImage: `url('/gradient.jpeg')`,
            }}
          >
            <Image
              src="/bigLogo.png"
              alt="logo"
              height={40}
              width={1000}
              className="rounded-xl w-[40px] lg:w-[100px] ipad:w-[50px]"
            />
            <Image
              src="/logoWord.png"
              alt="word"
              height={40}
              width={1000}
              className="rounded-xl w-[60px] lg:w-[250px] ipad:w-[175px] hidden ipad:block"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default observer(Page);
