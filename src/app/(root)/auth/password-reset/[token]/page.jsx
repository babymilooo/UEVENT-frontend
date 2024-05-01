"use client";

import { Input } from "@/components/ui/input";
import $api from "@/https/axios";
import { passwordRegex } from "@/lib/passwordRegex";
import { useParams, useRouter } from "next/navigation";

import { useState } from "react";

export default function PasswordResetPage() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSend = async () => {
    try {
      const resp = await $api.post(`/auth/password-reset/${encodeURIComponent(token)}`, { password: newPassword.trim() });
      router.push('/auth/login');
    } catch (error) {
      //alert user of error
    }
    
  };

  return (
    <>
      <div className="flex flex-col justify-center align-middle gap-2 m-auto w-80 mt-12">
        <p className="m-0 p-0">New Password</p>
        {/* TODO - add password pattern/validation rules */}
        <Input
          type="password"
          autocomplete="new-password"
          value={newPassword}
          minLength={8}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <p className="m-0 p-0">Confirm password</p>
        <Input
          type="password"
          autocomplete="new-password"
          value={confirmPassword}
          minLength={8}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <p
          className="m-0 p-0 text-red-500"
          hidden={newPassword.trim() == confirmPassword.trim()}
        >
          Passwords must be identical
        </p>
        <p
          className="m-auto p-0 text-red-500 text-center max-w-96"
          hidden={newPassword.trim().match(passwordRegex) || newPassword.length === 0}
        >
          Passwords must be at least 8 characters long, have 1 letter and 1 number and no whitespaces
        </p>
        <button
        type="button"
          className="bg-lime-400 px-6 py-3 rounded-md font-bold text-xs text-black mt-6"
          disabled={
            !newPassword ||
            newPassword.trim().length < 8 ||
            !confirmPassword ||
            confirmPassword.trim().length < 8 ||
            newPassword.trim() != confirmPassword.trim() ||
            !newPassword.trim().match(passwordRegex)
          }
          onClick={handleSend}
        >
          Confirm
        </button>
      </div>
    </>
  );
}
