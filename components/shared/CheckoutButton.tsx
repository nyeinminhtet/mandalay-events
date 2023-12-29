"use client";

import React from "react";
import { IEvent } from "@/lib/database/models/events.model";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import Link from "next/link";
import CheckOut from "./CheckOut";

const CheckoutButton = ({ event }: { event: IEvent }) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  const hasEventFinished = new Date(event.endDateTime) < new Date();

  return (
    <div className="flex items-center gap-3">
      {/* cannot buy past ticket */}
      {hasEventFinished ? (
        <p className="p-2 text-red-500">
          စိတ်မကောင်းပါဘူး လက်မှတ် ဝယ်ယူလို့မရတော့ပါ။
        </p>
      ) : (
        <>
          <SignedOut>
            <Button
              asChild
              size="lg"
              variant="destructive"
              className="button rounded-full"
            >
              <Link href="/sign-in">လက်မှတ် ဝယ်ရန်</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <CheckOut event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  );
};

export default CheckoutButton;
