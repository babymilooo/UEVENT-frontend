"use client"

import { TicketCheckout } from "@/components/checkout/TicketCheckout";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const { ticketOptionId } = useParams();
  return <>
  <div className="flex flex-col justify-center items-center align-middle m-auto h-3/4 w-3/4">
    <TicketCheckout ticketOptionId={ticketOptionId} />
  </div>
    
  </>;  
}
