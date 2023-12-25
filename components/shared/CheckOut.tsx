import React, { useEffect } from "react";

import { loadStripe } from "@stripe/stripe-js";

import { IEvent } from "@/lib/database/models/events.model";
import { Button } from "../ui/button";
import { checkoutOrder } from "@/lib/actions/order.action";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckOut = ({ event, userId }: { event: IEvent; userId: string }) => {
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you’re ready."
      );
    }
  }, []);

  const onCheckOut = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
    };

    await checkoutOrder(order);
  };

  return (
    <form action={onCheckOut} method="post">
      <Button
        type="submit"
        size="lg"
        role="link"
        className="button sm:w-fit"
        variant="destructive"
      >
        {event.isFree ? "လက်မှတ်ရယူရန်" : "လက်မှတ်ဝယ်ရန်"}
      </Button>
    </form>
  );
};

export default CheckOut;
