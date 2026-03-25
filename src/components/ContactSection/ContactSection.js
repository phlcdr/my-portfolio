import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import SectionWrapper from "../SectionWrapper/SectionWrapper";
import "./ContactSection.css";

const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001/api";
      await axios.post(`${apiUrl}/contact`, formData);
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Submission failed", err);
      setStatus("error");
    }
  };

  return (
    <SectionWrapper id="contact">
      <div className="container contact-inner">
        {/* Section Metadata */}
        <div className="section-meta-it">
          <span className="tech-coord-v">05</span>
          <span className="tech-label-minimal">/ CONTACT_INTERFACE</span>
        </div>

        <div className="contact-header-it">
          <h2 className="section-title">Enquiry</h2>
          <div className="tech-divider"></div>
        </div>

        <div className="contact-grid-it">
          <motion.div
            className="contact-details-it"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h3 className="contact-subheading-it">ESTABLISH_CONNECTION</h3>
            <p className="contact-lead-it">Currently available for specialized collaborations and high-impact digital architectural ventures.</p>

            <div className="contact-info-it">
              <div className="info-item-it">
                <span className="info-label-it">[ EMAIL ]</span>
                <span className="info-value-it">cidrophilipjohn30@gmail.com</span>
              </div>
              <div className="info-item-it">
                <span className="info-label-it">[ LOCATION ]</span>
                <span className="info-value-it">MANILA_PH // GMT+8</span>
              </div>
              <div className="info-item-it">
                <span className="info-label-it">[ STATUS ]</span>
                <span className="info-value-it">SYSTEM_ONLINE</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="contact-portal-it"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            {status === "success" ? (
              <motion.div
                className="contact-success-it"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="tech-node-large" />
                <h3 className="tech-success-text">MESSAGE_TRANSMITTED</h3>
                <p className="tech-muted-text">Your data packet has been successfully encrypted and delivered to the system vault.</p>
                <button className="luxury-button" onClick={() => setStatus("idle")}>SEND_NEW_ENQUIRY</button>
              </motion.div>
            ) : (
              <form className="tech-form-it" onSubmit={handleSubmit}>
                <div className="tech-form-row">
                  <div className="tech-input-group">
                    <label className="tech-label-xs">YOUR_NAME</label>
                    <input name="name" type="text" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                  </div>
                  <div className="tech-input-group">
                    <label className="tech-label-xs">YOUR_EMAIL</label>
                    <input name="email" type="email" placeholder="email@address.com" value={formData.email} onChange={handleChange} required />
                  </div>
                </div>

                <div className="tech-input-group">
                  <label className="tech-label-xs">SUBJECT</label>
                  <input name="subject" type="text" placeholder="Project Inquiry" value={formData.subject} onChange={handleChange} required />
                </div>

                <div className="tech-input-group message-group-it">
                  <label className="tech-label-xs">MESSAGE_BODY</label>
                  <div className="code-editor-sim">
                    <div className="line-numbers-sim">
                      <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span>
                    </div>
                    <textarea name="message" placeholder=" // WRITE YOUR MESSAGE HERE..." value={formData.message} onChange={handleChange} required rows={5}></textarea>
                  </div>
                </div>

                {status === "error" && <p className="tech-error-text">ERR_TRANSMISSION_FAILED: PLEASE_RETRY</p>}

                <button type="submit" className="luxury-button w-full-it" disabled={status === "submitting"}>
                  {status === "submitting" ? "TRANSMITTING..." : "SEND_MESSAGE"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ContactSection;
