import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { ScrollProgress } from "@/components/motion";
import { AnimatedMain } from "@/components/layout/animated-main";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <AnimatedMain>{children}</AnimatedMain>
      <Footer />
      <ScrollToTop />
    </>
  );
}
