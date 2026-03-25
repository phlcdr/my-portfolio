import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "../SectionWrapper/SectionWrapper";
import "./ProjectsSection.css";

const ProjectCard = ({ project, index }) => (
  <motion.article
    className="project-item-it"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 1, delay: index * 0.1 }}
  >
    <div className="project-header-it">
      <span className="project-id-it">PRJ_{(index + 1).toString().padStart(2, '0')} // ARCHIVE</span>
      <span className="tech-node-p" />
    </div>

    <div className="project-image-container-it">
      <div className="project-placeholder-it" style={{ background: project.gradient || "#111" }}>
        <div className="project-data-stream">
          {Array(5).fill().map((_, i) => (
            <span key={i}>{Math.random().toString(36).substring(7)}</span>
          ))}
        </div>
      </div>
      <div className="project-overlay-it">
        <div className="project-links-it">
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="luxury-button outline-it mini">ACCESS_DEPLOYMENT</a>
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="luxury-button outline-it mini">VIEW_SOURCE</a>
        </div>
      </div>
    </div>
    
    <div className="project-info-it">
      <div className="project-meta-it">
        <span className="tech-label-p">{project.category}</span>
      </div>
      <h3 className="project-title-it">{project.title}</h3>
      <p className="project-description-it">{project.description}</p>
      
      <div className="project-tech-stack-it">
        <span className="stack-label">STACK_LOADED: </span>
        <span className="stack-array">[ {project.tags?.split(",").map(tag => tag.trim().toUpperCase()).join(" / ")} ]</span>
      </div>
    </div>
  </motion.article>
);

const ProjectsSection = ({ data }) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const projects = data || [];
  
  const categories = useMemo(() => {
    const projectsList = data || [];
    const cats = ["All", ...new Set(projectsList.map(p => p.category))];
    return cats;
  }, [data]);

  const filtered = useMemo(() => {
    const projectsList = data || [];
    return projectsList.filter((p) => {
      const matchesCategory = activeFilter === "All" || p.category === activeFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [data, activeFilter, searchQuery]);

  return (
    <SectionWrapper id="projects">
      <div className="container projects-inner">
        {/* Section Metadata */}
        <div className="section-meta-it">
          <span className="tech-coord-v">04</span>
          <span className="tech-label-minimal">/ PROJECT_ARCHIVE</span>
        </div>

        <div className="projects-header-it">
          <h2 className="section-title">Archives</h2>
          <div className="tech-divider"></div>
        </div>

        {/* Technical Filter Controls */}
        <div className="projects-nav-it">
          <div className="category-filters-it">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`filter-it ${activeFilter === cat ? "active" : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                ./{cat.toLowerCase()}
              </button>
            ))}
          </div>
          <div className="search-it">
            <span className="search-icon-it">$&#62;_</span>
            <input 
              type="text" 
              placeholder="QUERY_ARCHIVE" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <motion.div className="projects-gallery-it" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="no-results-it">
            <p className="tech-error-text">ERR_ZERO_MATCHES: [ {searchQuery} ]</p>
            <button className="luxury-button" onClick={() => {setSearchQuery(""); setActiveFilter("All")}}>
              SYSTEM_REBOOT
            </button>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default ProjectsSection;
