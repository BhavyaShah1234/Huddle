import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProblemStory from "@/components/ProblemStory";
import Chapters from "@/components/Chapters";
import Footer from "@/components/Footer";
import { ViewModeProvider } from "@/components/ViewMode";

export default function Home() {
  return (
    <ViewModeProvider>
      {/* Very top of the page, above the problem story; the header logo links here. */}
      <div id="page-top" />
      <Header />
      <main className="flex-1">
        <ProblemStory />
        <Hero />
        <Chapters />
      </main>
      <Footer />
    </ViewModeProvider>
  );
}
