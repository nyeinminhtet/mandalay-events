import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { Suspense } from "react";
import Loader from "./loading";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen ">
      <Header />
      <Suspense fallback={<Loader />}>
        <main className="flex-1">{children}</main>
      </Suspense>
      <Footer />
    </div>
  );
}
