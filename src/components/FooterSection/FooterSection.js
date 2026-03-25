import React from "react";

import "./FooterSection.css";

const FooterSection = ({ data }) => {
  const authorName = data?.heroTitle || "PHILIP JOHN CIDRO";
  const year = new Date().getFullYear();

  const handleScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="luxury-footer-it">
      <div className="container footer-content-it">
        <div className="footer-top-it">
          <div className="footer-brand-it">
            <div className="tech-logo-group">
              <span className="tech-node-f" />
              <h2 className="footer-logo-it">P.J.CIDRO // DEV</h2>
            </div>
            <p className="footer-mission-it">ENGINEERING HIGH-FIDELITY DIGITAL INTERFACES THROUGH RIGOROUS LOGIC AND MINIMALIST DESIGN.</p>
          </div>
          
          <div className="footer-nav-it">
            <div className="nav-column-it">
              <span className="column-label-it">[ DIRECTORY ]</span>
              <button onClick={() => handleScroll('hero')}>./intro</button>
              <button onClick={() => handleScroll('about')}>./about</button>
              <button onClick={() => handleScroll('projects')}>./projects</button>
              <button onClick={() => handleScroll('contact')}>./contact</button>
            </div>
            <div className="nav-column-it">
              <span className="column-label-it">[ TECHNOLOGY ]</span>
              <span>build_v1.0.4</span>
              <span>react_engine</span>
              <span>node_runtime</span>
              <span>framer_motion</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom-it">
          <div className="footer-metadata-it">
            <span className="status-indicator">SYSTEM_STATUS: NOMINAL // 200 OK</span>
            <span className="build-timestamp">LAST_COMPILED: {year}.03.12</span>
          </div>
          <div className="footer-copyright-it">
            <span>© {year} ALL_RIGHTS_RESERVED // PHILIP_JHON_CIDRO</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
