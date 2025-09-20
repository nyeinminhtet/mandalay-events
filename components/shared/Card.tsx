import React from "react";
import Link from "next/link";
import Image from "next/image";

import { auth } from "@clerk/nextjs/server";

import { formatDateTime } from "@/lib/utils";
import { IEvent } from "@/lib/database/models/events.model";
import { DeleteConfirmation } from "./DeleteConfirmation";

interface CardProps {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
}

const Card = ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const getUserId = async (): Promise<string> => {
    const { sessionClaims } = await auth();
    return sessionClaims?.userId as string;
  };

  const userId = getUserId() as unknown as string;

  const isEventCreator = userId === event.organizer._id.toString();

  return (
    <div
      className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden
          rounded-xl bg-secondary/10 shadow-md transition-all hover:shadow-lg md:min-h-[438px]"
    >
      <Link
        href={`/events/${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-50"
      />

      {/* IS EVENT CREATOR.. */}
      {isEventCreator && !hidePrice && (
        <div className="absolute top-2 right-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit icon"
              height={20}
              width={20}
            />
          </Link>

          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 flex items-center rounded-full bg-green-100 px-4 py-1 text-green-600">
              {event.isFree ? "အခမဲ့" : `${event.price}MMK`}
            </span>

            <p className="p-semibold-14 flex items-center rounded-full bg-grey-500/10 px-4 py-1 text-grey-50">
              {event.category.name}
            </p>
          </div>
        )}

        <p className="p-medium-12 md:p-medium-14 text-gray-50">
          {formatDateTime(event.startDateTime).dateTime}
        </p>

        <Link href={`/events/${event._id}`} className="hover:opacity-75">
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-white">
            {event.title}
          </p>
        </Link>

        <div className="flex-between w-full">
          <div className="p-medium-14 md:p-medium-16 text-grey-600 flex gap-1 items-center">
            <span className="text-xs text-muted-foreground">ပွဲစီစဥ်သူ</span>-
            <p className="capitalize">
              {event.organizer.firstName} {event.organizer.lastName}
            </p>
          </div>

          {hasOrderLink && (
            <Link
              href={`/orders?eventId=${event._id}`}
              className="flex gap-2 hover:opacity-75"
            >
              <p className="text-green-600">အော်ဒါ အသေးစိတ်</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="arrow image"
                width={10}
                height={10}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
