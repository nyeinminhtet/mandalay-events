import React from "react";
import { Metadata } from "next";

import { auth } from "@clerk/nextjs";

import EventForm from "@/components/shared/EventForm";

export const metadata: Metadata = {
  title: "Create Event",
};

const CreateEventPage = () => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;

  return (
    <>
      <section className=" bg-slate-800 bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left text-white">
          Create Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} type="Create" />
      </div>
    </>
  );
};

export default CreateEventPage;
