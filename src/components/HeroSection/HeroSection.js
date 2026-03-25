import React from "react";
import { motion } from "framer-motion";
import useTypewriter from "../../hooks/useTypewriter";
import "./HeroSection.css";

const HeroSection = ({ data }) => {
  // Graceful fallback if data isn't loaded yet
  const title = data?.heroTitle || "Loading...";
  const bio = data?.heroBio || "";
  
  // Parse dynamic taglines array or use default
  let taglines = ["Loading Array..."];
  try {
    taglines = data?.heroTaglines ? JSON.parse(data.heroTaglines) : ["Developer"];
  } catch(e) { /* ignore */ }

  const { displayText } = useTypewriter(taglines, 80, 40, 2500);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="hero-section">
      {/* Structural Data Accents */}
      <div className="hero-tech-markers">
        <span className="tech-coord">X:122.9 Y:14.1</span>
        <span className="tech-status">[ SYSTEM_READY ]</span>
      </div>

      <div className="container hero-inner">
        {/* Availability Badge */}
        {data?.available === "true" && (
          <motion.div
            className="hero-badge-it"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="tech-node" />
            LIVE_STATUS: OPEN_FOR_COLLAB
          </motion.div>
        )}

        <div className="hero-title-group">
          <span className="tech-label">PHILIP_J_CIDRO // ROOT_DIR</span>
          {/* Minimalist Name */}
          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {title}
          </motion.h1>
        </div>

        {/* Subtle Typewriter */}
        <motion.div
          className="hero-typewriter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <span className="tech-prompt">$&#62;</span>
          <span className="hero-typewriter-text">{displayText}</span>
          <span className="cursor-blink-it" />
        </motion.div>

        {/* Bio Text */}
        <motion.p
          className="hero-bio"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {bio}
        </motion.p>

        {/* Luxury Buttons */}
        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          <button className="luxury-button" onClick={scrollToContact}>
            EXECUTE_PROJECT
          </button>
          <button className="luxury-button outline-it" onClick={scrollToProjects}>
            VIEW_ARCHIVE
          </button>
        </motion.div>

      </div>

      {/* IT Scroll Indicator */}
      <motion.div
        className="hero-scroll-it"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <div className="scroll-stream">
          <span>01</span><span>10</span><span>11</span><span>01</span>
        </div>
        <span className="scroll-label">EXPLORE_SYSTEM</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;
