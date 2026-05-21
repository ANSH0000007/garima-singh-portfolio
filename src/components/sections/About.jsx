import { useRef } from 'react';
import { motion } from 'framer-motion';

import photoshopLogo from '../../assets/photoshop.png';
import illustratorLogo from '../../assets/illustrator.png';
import canvaLogo from '../../assets/canva.png';

const TOOLS = [
  { name: 'Adobe Photoshop', logo: photoshopLogo, tone: '#31a8ff', isSquare: true, href: 'https://www.adobe.com/products/photoshop.html' },
  { name: 'Adobe Illustrator', logo: illustratorLogo, tone: '#ff9a00', isSquare: true, href: 'https://www.adobe.com/products/illustrator.html' },
  { name: 'Canva', logo: canvaLogo, tone: '#00c4cc', isSquare: false, href: 'https://www.canva.com' },
];

export default function About() {
  const sectionRef = useRef(null);

  return (
    <>
      <div className="section-curtain" aria-hidden="true" />
      <section id="about" ref={sectionRef} className="about-scene scroll-scene px-page py-24 md:py-36 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="md:col-span-5 md:col-start-1"
          >
            <p className="text-xs font-semibold uppercase text-tertiary mb-4">About</p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cocoa leading-tight mb-4">Creative Graphic Designer & Artist</h2>
            <p className="font-serif italic text-tertiary/90 text-lg mb-4 max-w-md">
              Passionate about visual storytelling and always looking to improve my craft.
            </p>
            <p className="text-muted text-base leading-relaxed max-w-md">
              Skilled in digital design, social media graphics, and creative artwork. I enjoy creating engaging social media posts, posters, and meaningful designs.
            </p>
          </motion.div>

          <div className="md:col-span-6 md:col-start-7">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.65, ease: 'easeOut', delay: 0.15 }}
              className="reveal-panel rounded-[1.75rem] p-8 md:p-10"
            >
              <div className="skill-chip text-cocoa mb-4 font-bold">Toolkit</div>
              <div className="tool-logos mb-8">
                {TOOLS.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tool-logo group"
                    title={tool.name}
                    style={{ '--tool-tone': tool.tone }}
                  >
                    <img 
                      src={tool.logo} 
                      alt={tool.name} 
                      className={
                        tool.isSquare 
                          ? "w-11 h-11 object-contain rounded-[0.55rem] transition-transform duration-300 group-hover:scale-105" 
                          : "h-7 w-auto max-w-[85%] object-contain transition-transform duration-300 group-hover:scale-105"
                      }
                    />
                    <span className="sr-only">{tool.name}</span>
                  </a>
                ))}
              </div>
              <div className="skill-chip text-cocoa mb-4 font-bold">Expertise</div>
              <div className="flex flex-wrap gap-2">
                {['Logo Design', 'Poster Design', 'Social Media Graphics', 'Creative Thinking', 'Leadership', 'Content Creation'].map((tag) => (
                  <span key={tag} className="skill-chip px-4 py-2 rounded-full bg-rose/60 text-secondary border border-white/55">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
