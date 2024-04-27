"use client";

import $api from "@/https/axios";
import { Ban, Loader, TicketCheck, TimerOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export const CheckoutReturnStatus = () => {
  const searchParams = useSearchParams();
  const session_id = useMemo(
    () => searchParams.get("session_id"),
    [searchParams]
  );
  // "open" | "complete" | "expired" | "error"
  const [status, setStatus] = useState("open");
  const router = useRouter();

  const fetchStatus = useCallback(async () => {
    try {
      if (status != "open") return;

      const resp = await $api.get("/stripe/session-status", {
        params: {
          session_id,
        },
      });
      setStatus(resp.data.status);
      return resp.data;
    } catch (error) {
      setStatus("error");
    }
  }, [session_id, status]);

  useEffect(() => {
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return (
    <>
      <div className="flex flex-col justify-center m-auto p-2 items-center">
        <p className="m-2 p-2 text-center text-3xl">Payment Status</p>
        {status == "open" && (
          <>
            <Loader size={80} color="blue" />
            <p className="m-2 p-2 text-center text-2xl">
              Waiting for the payment to finish
            </p>
          </>
        )}
        {status == "complete" && (
          <>
            <TicketCheck size={80} color="#05ff00" />
            <p className="m-2 p-2 text-center text-2xl">
              Payment is complete. The ticket will be sent to your email
            </p>
          </>
        )}
        {status == "expired" && (
          <>
            <TimerOff size={80} color="#fffa00" />
            <p className="m-2 p-2 text-center text-2xl">Payment expired</p>
          </>
        )}
        {status == "error" && (
          <>
            <Ban size={80} color="#ff3d02" />
            <p className="m-2 p-2 text-center text-2xl">Error</p>
          </>
        )}
        <button
          type="button"
          className="bg-lime-400 px-6 py-3 rounded-md font-bold text-xs text-black mt-6"
          onClick={() => router.push('/home')}
        >
          Go to Home
        </button>
      </div>
    </>
  );
};
