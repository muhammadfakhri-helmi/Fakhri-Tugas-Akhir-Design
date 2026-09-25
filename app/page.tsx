import { Stage } from "@/components/three/Stage";
import { Header } from "@/components/story/Header";
import { Providers } from "@/components/story/Providers";
import { SceneTracker } from "@/components/story/SceneTracker";
import { Hero } from "@/components/story/Hero";
import { AnatomyChapter, PathChapter } from "@/components/story/PathAndAnatomy";
import { ForcesChapter } from "@/components/story/Forces";
import { DesignsChapter } from "@/components/story/Designs";
import { MethodsChapter } from "@/components/story/Methods";
import { ConclusionChapter, Footer, RevisionChapter, SkillsChapter } from "@/components/story/Closing";

export default function Home() {
  return (
    <Providers>
      <Stage />
      <Header />
      <SceneTracker />
      <main id="main" className="relative z-10">
        <Hero />
        <PathChapter />
        <AnatomyChapter />
        <ForcesChapter />
        <DesignsChapter />
        <MethodsChapter />
        <RevisionChapter />
        <ConclusionChapter />
        <SkillsChapter />
      </main>
      <Footer />
    </Providers>
  );
}
