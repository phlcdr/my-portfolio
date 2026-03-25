import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [data, setData] = useState({ content: {}, projects: [], skills: [], messages: [] });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ profile: false, resume: false });
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [newSkill, setNewSkill] = useState({ category_name: 'Frontend', skill_name: '', level: 80 });
  const [newProject, setNewProject] = useState({ 
    title: '', description: '', tags: '', category: 'Frontend', 
    featured: 0, liveUrl: '#', repoUrl: '#', 
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' 
  });
  
  const profileInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const res = await axios.get(`${apiUrl}/portfolio`);
      setData(prev => ({ ...prev, ...res.data }));
    } catch (err) {
      toast.error('IDENTITY_SYNC_FAIL: DATABASE_UNREACHABLE');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateContent = async (key, value) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const token = localStorage.getItem('admin_token');
      await axios.put(`${apiUrl}/content/${key}`, { value }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      return true;
    } catch (err) {
      toast.error(`UPDATE_ERROR: ${key.toUpperCase()}_PERSISTENCE_FAILED`);
      return false;
    }
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(prev => ({ ...prev, [type]: true }));
    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';
      const token = localStorage.getItem('admin_token');
      
      const res = await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      });

      const fileUrl = res.data.url;
      const key = type === 'profile' ? 'profilePicture' : 'resumeUrl';
      
      const success = await handleUpdateContent(key, fileUrl);
      if (success) {
        setLastUpdate(Date.now());
        toast.success(`${type.toUpperCase()}_UPLOAD_SUCCESS // SYSTEM_SYNCED`);
      }
    } catch (err) {
      console.error("UPLOAD ERROR DETAILS:", err, err.response);
      const errorMsg = err.response?.data?.message || err.response?.statusText || err.message;
      toast.error(`UPLOAD_FAIL: ${errorMsg}`);
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const token = localStorage.getItem('admin_token');
      await axios.post(`${apiUrl}/skills`, newSkill, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewSkill({ category_name: 'Frontend', skill_name: '', level: 80 });
      fetchData();
      toast.success('SKILL_NODE_ADDED // SYSTEM_SYNCED');
    } catch (err) {
      toast.error('SKILL_ADD_FAILED // REJECTED');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${apiUrl}/skills/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      toast.success('SKILL_NODE_REMOVED // PURGED');
    } catch (err) {
      toast.error('SKILL_DELETE_FAILED // REJECTED');
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const token = localStorage.getItem('admin_token');
      await axios.post(`${apiUrl}/projects`, newProject, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewProject({ 
        title: '', description: '', tags: '', category: 'Frontend', 
        featured: 0, liveUrl: '#', repoUrl: '#', 
        gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)' 
      });
      fetchData();
      toast.success('PROJECT_ARCHIVE_CREATED // SYSTEM_SYNCED');
    } catch (err) {
      toast.error('PROJECT_CREATION_FAILED // REJECTED');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${apiUrl}/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      toast.success('PROJECT_ARCHIVE_DELETED // PURGED');
    } catch (err) {
      toast.error('PROJECT_DELETE_FAILED // REJECTED');
    }
  };

  if (loading) return <div className="admin-loading">AUTHENTICATING_STUDIO_SESSION...</div>;

  const { heroTitle, heroBio, location, available, resumeUrl, profilePicture, aboutBio } = data.content;

  return (
    <div className="admin-dashboard">
      <ToastContainer position="bottom-right" theme="dark" />
      
      <header className="admin-header-studio">
        <div className="studio-logo">PHILIP_J_CIDRO // STUDIO_ADMIN</div>
        <button onClick={logout} className="luxury-button" style={{ padding: '0.6rem 2rem', fontSize: '9px' }}>
          CLOSE_SESSION
        </button>
      </header>

      <div className="admin-editor-grid">
        {/* Sidebar: Profile Status & Previews */}
        <aside className="studio-sidebar">
          <div className="profile-preview-card">
            <img 
              src={profilePicture ? `${profilePicture}?t=${lastUpdate}` : "https://via.placeholder.com/150"} 
              alt="Preview" 
              className="preview-image-it"
              onClick={() => profileInputRef.current.click()}
              onLoad={() => console.log("IMAGE_LOAD_SUCCESS // URL:", profilePicture)}
              onError={(e) => {
                console.error("IMAGE_LOAD_FAIL // URL:", profilePicture);
                // Fallback to placeholder on error to avoid broken icon
                if (profilePicture) e.target.src = "https://via.placeholder.com/150?text=LOAD_ERROR";
              }}
              style={{ cursor: 'pointer' }}
            />
            <h4 className="preview-name">{heroTitle || "Identity Unknown"}</h4>
            <div className="preview-status">
              {uploading.profile ? "UPLOADING_CORE_ASSET..." : "STATUS: ONLINE // READY"}
            </div>
            
            <input 
              type="file" 
              ref={profileInputRef} 
              style={{ display: 'none' }} 
              onChange={(e) => handleFileUpload(e, 'profile')}
              accept="image/*"
            />
          </div>

          <div className="editor-section">
            <h3>System Status</h3>
            <div className="studio-field-group">
              <label>AVAILABILITY_BIT</label>
              <select 
                className="studio-input"
                defaultValue={available}
                onChange={(e) => handleUpdateContent('available', e.target.value)}
              >
                <option value="true">01 // AVAILABLE_FOR_PROJECTS</option>
                <option value="false">00 // SYSTEM_BUSY</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Editor: Content Fields */}
        <main className="studio-main-editor">
          <section className="editor-section">
            <h3>Identity Core</h3>
            
            <div className="studio-field-group">
              <label>TITLE_IDENTIFIER</label>
              <input 
                type="text" 
                className="studio-input"
                defaultValue={heroTitle}
                onBlur={(e) => handleUpdateContent('heroTitle', e.target.value)}
              />
            </div>

            <div className="studio-field-group">
              <label>GEOGRAPHIC_NODE</label>
              <input 
                type="text" 
                className="studio-input"
                defaultValue={location}
                onBlur={(e) => handleUpdateContent('location', e.target.value)}
              />
            </div>

            <div className="studio-field-group">
              <label>MANIFESTO_STRING</label>
              <textarea 
                className="studio-textarea"
                defaultValue={heroBio}
                onBlur={(e) => handleUpdateContent('heroBio', e.target.value)}
              />
            </div>

            <div className="studio-field-group">
              <label>ABOUT_BIOGRAPHY</label>
              <textarea 
                className="studio-textarea"
                defaultValue={aboutBio}
                onBlur={(e) => handleUpdateContent('aboutBio', e.target.value)}
              />
            </div>
          </section>

          <section className="editor-section">
            <h3>Technical Assets</h3>
            
            <div className="studio-field-group">
              <label>OFFICIAL_RESUME_ARCHIVE</label>
              <div 
                className="upload-zone-it"
                onClick={() => resumeInputRef.current.click()}
              >
                <span className="upload-icon">↑</span>
                <span className="upload-text">
                  {uploading.resume ? "TRANSMITTING_DATA..." : resumeUrl ? "RESUME_LOADED // CLICK_TO_REPLACE" : "DRAG_OR_CLICK_TO_UPLOAD_PDF"}
                </span>
              </div>
              <input 
                type="file" 
                ref={resumeInputRef} 
                style={{ display: 'none' }} 
                onChange={(e) => handleFileUpload(e, 'resume')}
                accept=".pdf,.doc,.docx"
              />
            </div>
          </section>

          {/* Project Management */}
          <section className="editor-section">
            <h3>Project Archive Management</h3>
            <form onSubmit={handleAddProject} className="studio-form-project">
              <div className="studio-field-group">

                <label>PROJECT_TITLE</label>
                <input type="text" className="studio-input" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required placeholder="e.g. Enterprise CRM" />
              </div>
              <div className="studio-field-group">
                <label>DATA_DESCRIPTION</label>
                <textarea className="studio-textarea" style={{minHeight: '80px'}} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required placeholder="System description..." />
              </div>
                <div className="studio-form-grid">
                  <div className="studio-field-group">
                    <label>TECH_STACK_TAGS</label>
                    <input type="text" className="studio-input" value={newProject.tags} onChange={e => setNewProject({...newProject, tags: e.target.value})} required placeholder="React, Node, etc." />
                  </div>
                  <div className="studio-field-group">
                    <label>CATEGORY_NODE</label>
                    <select className="studio-input" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})}>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Full-Stack">Full-Stack</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="studio-save-btn" style={{ marginTop: '1rem', width: '100%' }}>INITIALIZE_NEW_PROJECT</button>
              </form>
  
              <div className="data-table-container">
                <div className="data-table-wrapper">
                  <table className="studio-table">
                    <thead>
                      <tr>
                        <th>TITLE</th>
                        <th>CATEGORY</th>
                        <th style={{ textAlign: 'right' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.projects.map(proj => (
                        <tr key={proj.id}>
                          <td className="table-title">{proj.title}</td>
                          <td>{proj.category}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button onClick={() => handleDeleteProject(proj.id)} className="table-purge-btn">PURGE</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
  
            {/* Skill Management */}
            <section className="editor-section">
              <h3>Skill Node Management</h3>
              <form onSubmit={handleAddSkill} className="studio-form-skill-grid">
                <div className="studio-field-group">
                  <label>CATEGORY_NODE</label>
                  <select className="studio-input" value={newSkill.category_name} onChange={e => setNewSkill({...newSkill, category_name: e.target.value})}>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Database">Database</option>
                    <option value="Tools">Tools</option>
                  </select>
                </div>
                <div className="studio-field-group">
                  <label>SKILL_IDENTIFIER</label>
                  <input type="text" className="studio-input" value={newSkill.skill_name} onChange={e => setNewSkill({...newSkill, skill_name: e.target.value})} required placeholder="e.g. React.js" />
                </div>
                <button type="submit" className="studio-save-btn">ADD_NODE</button>
              </form>
  
              <div className="data-table-container">
                <div className="data-table-wrapper">
                  <table className="studio-table">
                    <thead>
                      <tr>
                        <th>SKILL_NODE</th>
                        <th>CATEGORY</th>
                        <th style={{ textAlign: 'right' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.skills.map(category => (
                        category.skills.map(skill => (
                          <tr key={skill.id}>
                            <td className="table-title">{skill.name}</td>
                            <td>{category.name}</td>
                            <td style={{ textAlign: 'right' }}>
                              <button onClick={() => handleDeleteSkill(skill.id)} className="table-purge-btn">PURGE</button>
                            </td>
                          </tr>
                        ))
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>


          <footer style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
            <div className="preview-status" style={{ color: 'rgba(255,255,255,0.2)' }}>
              NOTE: ALL CHANGES ARE AUTO-SAVED TO THE CORE DATABASE UPON FIELD_EXIT.
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
