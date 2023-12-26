import React from "react";
import Image from "next/image";

import CheckoutButton from "@/components/shared/CheckoutButton";
import Collection from "@/components/shared/Collection";
import {
  getEventById,
  getRelatedEventsByCategory,
} from "@/lib/actions/event.action";
import { formatDateTime } from "@/lib/utils";
import { SearchParamProps } from "@/types";
import { Metadata, ResolvingMetadata } from "next";

const EventDetailsPage = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  const event = await getEventById(id);

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: searchParams.page as string,
  });
  return (
    <>
      <section className="flex justify-center bg-slate-950 bg-contain text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={event.imageUrl}
            alt="event image"
            width={1000}
            height={1000}
            quality={90}
            priority
            className="h-full min-h-[300px] object-contain object-center"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10 ">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">{event.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.isFree ? "အခမဲ့" : `${event.price} MMK`}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.name}
                  </p>
                </div>

                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by{" "}
                  <span className="text-muted-foreground capitalize">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>
            </div>

            <CheckoutButton event={event} />

            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar icon"
                  width={32}
                  height={32}
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap justify-between items-center">
                  <p>
                    <span className="font-semibold text-green-600">
                      စတင်မည့်ရက်:{" "}
                    </span>
                    {formatDateTime(event.startDateTime).dateOnly} -{" "}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p>
                    <span className="font-semibold text-red-600">
                      ပြီးဆုံးမည့်ရက်:{" "}
                    </span>
                    {formatDateTime(event.endDateTime).dateOnly} -{" "}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className="p-regular-20 flex items-center gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location icon"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">အကြောင်းအရာ</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
              <a
                href={event.url}
                target="_blank"
                className="p-medium-16 lg:p-regular-18 truncate text-green-600 cursor-pointer underline"
              >
                {event.url}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED EVENTs */}
      <section className="wrapper flex flex-col my-8 gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>

        <Collection
          data={relatedEvents?.data}
          emptyTitle="အမျိုးအစားတူသော ပွဲများမရှိသေးပါ"
          emptyStateSubText="နောက်တခါ မှပြန်လာကြည့်ပါ။"
          collectionType="All_Events"
          limit={3}
          page={searchParams.page as string}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </>
  );
};

export default EventDetailsPage;

export async function generateMetadata(
  { params, searchParams }: SearchParamProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.id;

  // fetch data
  const event = await getEventById(id);

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: event.title,
    openGraph: {
      images: ["/some-specific-page-image.jpg", ...previousImages],
    },
  };
}
