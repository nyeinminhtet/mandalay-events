import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 place-items-center gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8 text-secondary">
            <h1 className="h1-bold">Elevate Your Nightlife Experience! </h1>
            <p className="p-regular-20 md:p-regular-24">
              Ready to turn your night into a legend? Join our global party
              community and let the celebrations begin!
            </p>

            <Button
              asChild
              size="lg"
              className="button w-full sm:w-fit "
              variant="outline"
            >
              <Link href="#events" className="font-semibold">
                Events
              </Link>
            </Button>
          </div>

          <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className=" 2xl:max-h-[50vh] max-h-[70vh] object-contain object-center"
          />
        </div>
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          Search Category
        </div>
      </section>
    </>
  );
}
