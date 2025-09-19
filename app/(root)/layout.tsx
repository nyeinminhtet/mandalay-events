import { Suspense } from "react";

import Loader from "./loading";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Header />
      <Suspense fallback={<Loader />}>
        <main className="flex-1">{children}</main>
      </Suspense>
      <Footer />
    </div>
  );
}
