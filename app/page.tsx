import Hero from "@/components/Hero";
import { Questions, Projects, Packages, Flow, Services, Contact } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Hero />
      <Questions />
      <Projects />
      <Packages />
      <Flow />
      <Services />
      <Contact />
    </>
  );
}
