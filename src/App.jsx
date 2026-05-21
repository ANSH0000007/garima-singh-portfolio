import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { LenisProvider } from './utils/LenisContext';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import WorkReel from './components/sections/WorkReel';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Footer from './components/sections/Footer';
import ErrorBoundary from './components/ErrorBoundary';

gsap.registerPlugin(ScrollTrigger);

function ScrollRefresh() {
  useEffect(() => {
    const refresh = () => window.requestAnimationFrame(() => ScrollTrigger.refresh());

    window.addEventListener('load', refresh);
    window.addEventListener('resize', refresh);
    refresh();

    return () => {
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', refresh);
    };
  }, []);

  return null;
}

function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <LenisProvider>
          <ScrollRefresh />
          <div className="relative">
            <Navbar />

            <main className="relative z-10">
              <Hero />
              <WorkReel />
              <About />
              <Experience />
            </main>

            <Footer />
          </div>
        </LenisProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
