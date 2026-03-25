import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const SectionWrapper = ({
  id,
  className = "",
  children,
  delay = 0,
  style = {},
}) => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      id={id}
      className={`section ${className}`}
      style={style}
      ref={ref}
    >
      <motion.div
        className="container section-inner"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default SectionWrapper;
