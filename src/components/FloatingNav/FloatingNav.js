import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useScrollSpy from "../../hooks/useScrollSpy";
import "./FloatingNav.css";

const FloatingNav = ({ data }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const navLinks = [
    { label: "INTRO", href: "#hero", index: "01" },
    { label: "ABOUT", href: "#about", index: "02" },
    { label: "SKILLS", href: "#skills", index: "03" },
    { label: "PROJECTS", href: "#projects", index: "04" },
    { label: "CONTACT", href: "#contact", index: "05" },
  ];

  const sectionIds = navLinks.map((l) => l.href);
  const activeSection = useScrollSpy(sectionIds, 120);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href) => {
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  };


  return (
    <>
      <motion.header
        className={`luxury-nav ${scrolled ? "scrolled" : ""}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-container">
          <div className="nav-content">
            {/* Logo / Brand */}
            <div className="nav-brand-it" onClick={() => handleNavClick("#hero")}>
              <span className="tech-node-nav" />
              <span className="brand-name-it">P.J.CIDRO // DEV</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="nav-desktop-it">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  className={`nav-item-it ${activeSection === link.href ? "active" : ""}`}
                  onClick={() => handleNavClick(link.href)}
                >
                  <span className="nav-index-it">{link.index}</span>
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Hamburger for Mobile */}
            <button 
              className={`nav-toggle ${mobileOpen ? "open" : ""}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Menu"
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <nav className="mobile-nav-links">
              {navLinks.map((link, i) => (
                <motion.button
                  key={link.href}
                  className="mobile-item"
                  onClick={() => handleNavClick(link.href)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNav;
