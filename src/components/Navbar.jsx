import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useLenisScroll } from '../utils/useLenisScroll';

const NAV_LINKS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('work');
  const { scrollTo, getScrollY, lenis } = useLenisScroll();

  useEffect(() => {
    const update = () => {
      const y = getScrollY();
      setIsScrolled(y > 24);

      const sections = ['work', 'about', 'experience', 'contact']
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      const marker = y + window.innerHeight * 0.35;
      let current = 'work';
      for (const section of sections) {
        if (section.offsetTop <= marker) current = section.id;
      }
      setActiveSection(current);
    };

    if (lenis) {
      lenis.on('scroll', update);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();

    return () => {
      lenis?.off?.('scroll', update);
      window.removeEventListener('scroll', update);
    };
  }, [getScrollY, lenis]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen);
    if (isOpen) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isOpen, lenis]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    scrollTo(`#${id}`);
    setIsOpen(false);
  };

  return (
    <header className={clsx('fixed top-0 left-0 w-full z-[100] nav-shell', isScrolled && 'is-compact')}>
      <nav
        className={clsx('nav-bar flex justify-between items-center gap-3', isScrolled && 'is-scrolled')}
        aria-label="Main navigation"
      >
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollTo('#hero', { offset: 0 });
          }}
          className="font-serif font-semibold text-base md:text-lg uppercase text-cocoa hover:text-tertiary transition-colors duration-300 shrink-0"
        >
          Garima Singh
        </a>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className={clsx('nav-link', activeSection === link.id && 'is-active')}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, 'contact')}
            className="nav-cta ml-1"
          >
            Contact
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="md:hidden w-10 h-10 rounded-full border border-outline/60 flex items-center justify-center bg-ivory/80"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
          <span className="sr-only">Menu</span>
        </button>
      </nav>

      <div id="mobile-menu" className={clsx('mobile-menu', isOpen && 'is-open')} aria-hidden={!isOpen}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => handleNavClick(e, link.id)}
            className="font-serif text-4xl font-medium text-cocoa"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={(e) => handleNavClick(e, 'contact')}
          className="font-serif text-4xl font-medium text-tertiary"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
