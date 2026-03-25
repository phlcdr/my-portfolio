import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper from "../SectionWrapper/SectionWrapper";
import "./AboutSection.css";

const AboutSection = ({ data }) => {
  const { ref: contentRef, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  const { aboutBio, location, available, resumeUrl, profilePicture } = data || {};

  return (
    <SectionWrapper id="about">
      <div className="container about-inner">
        {/* Section Metadata */}
        <div className="section-meta-it">
          <span className="tech-coord-v">02</span>
          <span className="tech-label-minimal">/ PROFILE_OVERVIEW</span>
        </div>
        
        <div className="about-header-it">
          <h2 className="section-title">Identity</h2>
          <div className="tech-divider"></div>
        </div>

        <motion.div
          ref={contentRef}
          className="about-grid-it"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="about-visual-column">
            <div className="profile-image-container-it">
              <img 
                src={profilePicture || "/default-profile.jpg"} 
                alt="Profile" 
                className="profile-image-it" 
              />
              <div className="image-overlay-it" />
            </div>
          </div>

          <div className="about-text-column">
            <h3 className="about-manifesto-it">
              ENGINEERING DIGITAL SOLUTIONS WITH <span className="tech-accent-text">PRECISION_&_PURPOSE</span>.
            </h3>
            <p className="about-bio-it">{aboutBio}</p>
            
            <div className="about-actions-it">
              <a href={resumeUrl} className="luxury-button" target="_blank" rel="noopener noreferrer">
                DOWNLOAD_RESUME
              </a>
            </div>
          </div>

          <div className="about-specs-column">
            <div className="spec-item-it">
              <span className="spec-label-it">[ LOCATION ]</span>
              <span className="spec-value-it">{location}</span>
            </div>
            <div className="spec-item-it">
              <span className="spec-label-it">[ TECH_STACK ]</span>
              <span className="spec-value-it">MERN / FULL-STACK</span>
            </div>
            <div className="spec-item-it">
              <span className="spec-label-it">[ ARCHITECTURE ]</span>
              <span className="spec-value-it">CLEAN_CODE // SOLID</span>
            </div>
            <div className="spec-item-it">
              <span className="spec-label-it">[ STATUS ]</span>
              <span className="spec-value-it">
                {available ? "AVAILABLE_FOR_PROJECTS" : "CURRENTLY_BOOKED"}
              </span>
            </div>
          </div>
        </motion.div>

      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
