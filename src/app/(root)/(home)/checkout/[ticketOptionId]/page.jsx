"use client"

import { TicketCheckout } from "@/components/checkout/TicketCheckout";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const { ticketOptionId } = useParams();
  return <>
  <div className="flex flex-col justify-center items-center align-middle m-auto h-3/4 w-3/4">
    <p className="text-center text-2xl p-1 font-semibold">Checkout</p>
    <TicketCheckout ticketOptionId={ticketOptionId} />
  </div>
    
  </>;  
}
