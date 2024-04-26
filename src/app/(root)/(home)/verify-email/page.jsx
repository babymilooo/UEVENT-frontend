"use client"
import { useRouter } from "next/navigation";

export default function VerifyEmailRedirectPage() {
  const router = useRouter();
  return (
    <>
      <div className="m-auto flex flex-col">
        <h1 className="text-center text-2xl">Thank you for verifying your email</h1>
        <button
          className="bg-lime-400 px-6 py-3 rounded-md font-bold text-xs text-black mt-6 m-auto"
          onClick={() => router.push("/home")}
        >
          Go to home page
        </button>
      </div>
    </>
  );
}
