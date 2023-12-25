import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.action";
import { auth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const ProfilePage = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const organizedEvents = await getEventsByUser({ userId, page: 1 });

  return (
    <>
      {/* My Ticket */}
      <section className="bg-slate-800 bg-cover bg-center py-5 md:py-10">
        <div className="flex wrapper items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left text-secondary">
            My Tickets
          </h3>
          <Button
            asChild
            size="lg"
            className="button hidden sm:flex hover:opacity-75"
          >
            <Link href="/#events">ပွဲ များကိုကြည့်ရန်</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={[]}
          emptyTitle="သင်ဝယ်ထားသော လက်မှတ်များ မရှိသေးပါ"
          emptyStateSubText="စိတ်မပူပါနဲ့ စိတ်လှုပ်ရှားစရာ ပွဲ တွေများစွာရှိပါတယ်။"
          collectionType="My_Tickets"
          limit={3}
          page={1}
          totalPages={2}
          urlParamName="ordersPage"
        />
      </section>

      {/* Events Organized */}
      <section className="bg-slate-800 bg-cover bg-center py-5 md:py-10">
        <div className="flex wrapper items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left text-secondary">
            Events Organized
          </h3>
          <Button
            asChild
            size="lg"
            className="button hidden sm:flex hover:opacity-75"
          >
            <Link href="/events/create">ပွဲအသစ် ဖန်တီးရန်</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="သင် ဖန်တီးထားသော ပွဲ မရှိသေးပါ"
          emptyStateSubText="ပွဲဖန်တီးရန် နေရာသို့သွားရောက် ဖန်တီးနိုင်ပါသည်။"
          collectionType="Events_Organized"
          limit={6}
          page={1}
          totalPages={2}
          urlParamName="eventsPage"
        />
      </section>
    </>
  );
};

export default ProfilePage;
