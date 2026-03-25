import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import SectionWrapper from "../SectionWrapper/SectionWrapper";
import "./SkillsSection.css";


const SkillsSection = ({ data }) => {
  const categories = data || [];

  return (
    <SectionWrapper id="skills">
      <div className="container skills-inner">
        {/* Section Metadata */}
        <div className="section-meta-it">
          <span className="tech-coord-v">03</span>
          <span className="tech-label-minimal">/ TECHNICAL_EXPERTISE</span>
        </div>

        <div className="skills-header-top">
          <h2 className="section-title">Core_Stack</h2>
          <div className="tech-divider"></div>
        </div>

        <div className="skills-grid-it">
          {categories.map((cat, catIdx) => (
            <motion.div
              key={cat.name}
              className="skills-category-block-it"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: catIdx * 0.1 }}
            >
              <div className="tech-cat-header">
                <span className="tech-node-s" />
                <h3 className="skills-cat-title-it">{cat.name}</h3>
              </div>
              
              <div className="skill-tags-it">
                {cat.skills.map((skill, sIdx) => (
                  <motion.div 
                    key={sIdx}
                    className="skill-tag-it"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.1 * sIdx }}
                  >
                    <span className="skill-dot-it" />
                    <span className="skill-name-it">{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </SectionWrapper>
  );
};

export default SkillsSection;
