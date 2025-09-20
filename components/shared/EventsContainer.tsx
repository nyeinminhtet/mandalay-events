import React from "react";

import Collection from "./Collection";
import { IEvent } from "@/lib/database/models/events.model";

interface EventsContainerProps {
  events: {
    data: IEvent[];
    totalPages: number;
  };
  pageValue: number;
}

const EventsContainer = ({ events, pageValue }: EventsContainerProps) => {
  return (
    <Collection
      data={events?.data}
      emptyTitle="ပွဲများ မရှိသေးပါ"
      emptyStateSubText="ခန နေမှ ပြန်လာကြည့်ပါ။"
      collectionType="All_Events"
      limit={6}
      page={pageValue}
      totalPages={events?.totalPages}
    />
  );
};

export default EventsContainer;
