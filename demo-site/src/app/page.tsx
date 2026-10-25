import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Chapters from "@/components/Chapters";
import Footer from "@/components/Footer";
import { ViewModeProvider } from "@/components/ViewMode";

export default function Home() {
  return (
    <ViewModeProvider>
      <Header />
      <main className="flex-1">
        <Hero />
        <Chapters />
      </main>
      <Footer />
    </ViewModeProvider>
  );
}
