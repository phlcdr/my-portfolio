import React, { useEffect, useState } from "react";
import axios from "axios";
import FloatingNav from "../components/FloatingNav/FloatingNav";
import HeroSection from "../components/HeroSection/HeroSection";
import AboutSection from "../components/AboutSection/AboutSection";
import SkillsSection from "../components/SkillsSection/SkillsSection";
import ProjectsSection from "../components/ProjectsSection/ProjectsSection";
import ContactSection from "../components/ContactSection/ContactSection";
import FooterSection from "../components/FooterSection/FooterSection";

/**
 * HomePage — Assembles all portfolio sections.
 * ALL data is fetched dynamically from the SQLite backend.
 */
const HomePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
        const res = await axios.get(`${apiUrl}/portfolio`);
        setData(res.data);
      } catch (error) {
        console.error("Failed to load portfolio data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontSize: "1.2rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Loading Experience
      </div>
    );
  }

  if (!data) return <div>Failed to load data. Ensure backend is running.</div>;

  return (
    <>
      <FloatingNav data={data} />
      <main id="main-content" aria-label="Portfolio main content">
        <HeroSection data={data.content} />
        <AboutSection data={data.content} />
        <SkillsSection data={data.skills} />
        <ProjectsSection data={data.projects} />
        <ContactSection />
        <FooterSection data={data.content} />
      </main>
    </>
  );
};

export default HomePage;
