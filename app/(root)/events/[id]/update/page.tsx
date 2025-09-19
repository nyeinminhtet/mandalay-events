import React from "react";

import { auth } from "@clerk/nextjs";

import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.action";

interface UpdateEventProps {
  params: Promise<{
    id: string;
  }>;
}

const UpdateEventPage = async (params: UpdateEventProps) => {
  const { id } = await params.params;

  const { sessionClaims } = auth();
  const event = await getEventById(id);
  const userId = sessionClaims?.userId as string;

  return (
    <>
      <section className="bg-primary-50 bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left text-white">
          Update Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm
          userId={userId}
          type="Update"
          event={event}
          eventId={event._id}
        />
      </div>
    </>
  );
};

export default UpdateEventPage;
