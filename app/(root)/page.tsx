import { Suspense } from "react";
import { SearchParamProps } from "@/types";
import Hero from "@/components/shared/Hero";
import { getAllEvents } from "@/lib/actions/event.action";
import { IEvent } from "@/lib/database/models/events.model";
import EventsContainer from "@/components/shared/EventsContainer";
import SearchAndFilter from "@/components/shared/SearchAndFilter";

export default async function Home({ searchParams }: SearchParamProps) {
  const { page, query, category } = await searchParams;

  const pageValue = Number(page) || 1;
  const searchText = (query as string) || "";

  const events: { data: IEvent[]; totalPages: number } | undefined =
    await getAllEvents({
      query: searchText,
      category: (category as string) || "",
      page: pageValue,
      limit: 6,
    });

  return (
    <>
      <Hero />

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h1-bold">
          Events <span className="text-muted-foreground">in Mandalay</span>
        </h2>

        <SearchAndFilter />

        <Suspense fallback={<div>loading...</div>}>
          <EventsContainer
            events={events || { data: [], totalPages: 0 }}
            pageValue={pageValue}
          />
        </Suspense>
      </section>
    </>
  );
}
