"use client";

import $api from "@/https/axios";
import { useCallback, useEffect, useState } from "react";

export const CheckoutReturnStatus = () => {
  //get session_id from query params of current URL
  const session_id = "aboba";
  // "open" | "complete" | "expired" | "error"
  const [status, setStatus] = useState("open");

  const fetchStatus = useCallback(async () => {
    try {
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
    
  }, [session_id]);

  useEffect(() => {
    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, [fetchStatus])

  return <>
  <div>
    {status}
  </div>
  </>;
};
