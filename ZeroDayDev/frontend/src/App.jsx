import { ChatPanel } from "./components/chat/ChatPanel.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { Header } from "./components/layout/Header.jsx";
import { AuthSection } from "./components/sections/AuthSection.jsx";
import { HeroSection } from "./components/sections/HeroSection.jsx";
import { MountainBand } from "./components/sections/MountainBand.jsx";
import { MembersSection } from "./components/sections/MembersSection.jsx";
import { ProjectsSection } from "./components/sections/ProjectsSection.jsx";
import { useAuth } from "./hooks/useAuth.js";

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <MountainBand />
        <MembersSection />
        <ProjectsSection />
        <AuthSection />
        {user ? <ChatPanel /> : null}
      </main>
      <Footer />
    </>
  );
}
