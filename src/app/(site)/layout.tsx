import { Suspense } from "react";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense>
        <Nav />
      </Suspense>
      <main>{children}</main>
      <Footer />
    </>
  );
}
