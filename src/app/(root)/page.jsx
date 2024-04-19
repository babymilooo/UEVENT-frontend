"use client"

import Navbar from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className="flex-grow flex justify-center items-center p-4">
        <div className="flex flex-col items-center justify-center">
          <p className=" xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-3xl font-bold text-center animate-fade-up animate-duration-[1500ms] animate-ease-out">Visit your favorite</p>
          <p className=" xl:text-6xl lg:text-5xl ipad:text-4xl phone:text-3xl font-bold text-center animate-fade-up animate-duration-[1500ms] animate-ease-out">artists with us</p>
          <p className="lg:text-lg text-xs font-bold text-center animate-fade animate-once animate-duration-[1500ms] animate-delay-[1000ms] animate-ease-out mt-4">Don’t miss the concerts of your performers</p>
          <p className="lg:text-lg text-xs font-bold text-center animate-fade animate-once animate-duration-[1500ms] animate-delay-[1000ms] animate-ease-out">perhaps they are already in your city!</p>
          <div className="animate-fade animate-once animate-duration-[1500ms] animate-delay-[2000ms] animate-ease-out">
            <button className="mt-4 bg-lime-400 px-6 py-3 rounded-3xl font-bold text-xs animate-jump animate-once animate-duration-[1000ms] animate-delay-[1900ms] animate-ease-out" onClick={() => router.push("/home")}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
