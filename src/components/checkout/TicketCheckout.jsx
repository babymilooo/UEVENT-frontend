"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import $api from "@/https/axios";

const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "";
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export const TicketCheckout = ({ ticketOptionId }) => {
  const [ownerName, setOwnerName] = useState("");
  const [collectedPersonalInfo, setCollectedPersonalInfo] = useState(false);

  const handleProceed = useCallback(() => {
    if (!ownerName || ownerName.trim().length == 0) {
      //show error stuff
      return;
    }
    setCollectedPersonalInfo(true);
  }, [ownerName]);

  const fetchClientSecret = useCallback(() => {
    return $api
      .post("/stripe/create-checkout-session", { ticketOptionId, ownerName })
      .then((resp) => resp.data.clientSecret)
      .catch((err) => "");
  }, [ticketOptionId, ownerName]);
  return (
    <>
      <div
        className="w-full"
      >
        {/* collect personal info */}

        {!collectedPersonalInfo && (
          <div className="flex flex-col m-auto justify-center gap-2 w-11/12 max-w-96">
            <p className="m-0 p-0">Owner Name</p>
            <Input
              type="text"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Name"
              required
            />
            <button
              type="button"
              className="bg-lime-400 px-6 py-3 rounded-md font-bold text-xs text-black mt-6"
              disabled={!ownerName || ownerName.trim().length == 0}
              onClick={handleProceed}
            >
              Payment Options
            </button>
          </div>
        )}
        {collectedPersonalInfo && (
          <div className="m-auto p-2 flex flex-col justify-center gap-3 items-center w-full">
            <button
              type="button"
              className="bg-lime-400 px-6 py-3 rounded-md font-bold text-xs text-black mt-6 w-1/3 min-w-fit"
              onClick={() => setCollectedPersonalInfo(false)}
            >
              Back To Personal Info
            </button>
            <div className="w-full">
              <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{ fetchClientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
            </div>
            
          </div>
        )}
      </div>
    </>
  );
};
