const express = require('express');
const router = express.Router();
const { db } = require('../db');
const auth = require('../middleware/auth');

// --- PUBLIC ROUTES ---

// 1. Get All Portfolio Data (Aggregate)
router.get('/portfolio', (req, res) => {
  const data = { content: {}, projects: [], skills: [] };

  db.all("SELECT * FROM content", [], (err, contentRows) => {
    if (err) return res.status(500).json({ message: 'Error fetching content' });
    contentRows.forEach(row => data.content[row.key] = row.value);

    db.all("SELECT * FROM projects ORDER BY featured DESC, id DESC", [], (err, projectRows) => {
      if (err) return res.status(500).json({ message: 'Error fetching projects' });
      data.projects = projectRows;

      db.all("SELECT * FROM skills", [], (err, skillRows) => {
        if (err) return res.status(500).json({ message: 'Error fetching skills' });
        
        // Group skills by category for convenience
        const groupedSkills = {};
        skillRows.forEach(row => {
          if (!groupedSkills[row.category_name]) groupedSkills[row.category_name] = [];
          groupedSkills[row.category_name].push({ id: row.id, name: row.skill_name, level: row.level });
        });
        
        data.skills = Object.keys(groupedSkills).map(cat => ({
          name: cat,
          skills: groupedSkills[cat]
        }));

        res.json(data);
      });
    });
  });
});

// 2. Contact form submission (Public)
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const stmt = db.prepare("INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)");
  stmt.run([name, email, subject, message], function(err) {
    if (err) return res.status(500).json({ message: 'Error saving message' });
    res.status(201).json({ id: this.lastID, message: 'Message received' });
  });
  stmt.finalize();
});


// --- PROTECTED ADMIN ROUTES ---

// Update Content Key
router.put('/content/:key', auth, (req, res) => {
  const { value } = req.body;
  db.run("INSERT OR REPLACE INTO content (key, value) VALUES (?, ?)", [req.params.key, value], function(err) {
    if (err) return res.status(500).json({ message: 'Error updating content' });
    res.json({ message: 'Content updated successfully' });
  });
});

// Project CRUD
router.post('/projects', auth, (req, res) => {
  const { title, description, tags, category, featured, liveUrl, repoUrl, gradient } = req.body;
  const stmt = db.prepare("INSERT INTO projects (title, description, tags, category, featured, liveUrl, repoUrl, gradient) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  stmt.run([title, description, tags, category, featured, liveUrl, repoUrl, gradient], function(err) {
    if (err) return res.status(500).json({ message: 'Error creating project' });
    res.status(201).json({ id: this.lastID, message: 'Project created' });
  });
  stmt.finalize();
});

router.put('/projects/:id', auth, (req, res) => {
  const { title, description, tags, category, featured, liveUrl, repoUrl, gradient } = req.body;
  const sql = "UPDATE projects SET title = ?, description = ?, tags = ?, category = ?, featured = ?, liveUrl = ?, repoUrl = ?, gradient = ? WHERE id = ?";
  db.run(sql, [title, description, tags, category, featured, liveUrl, repoUrl, gradient, req.params.id], function(err) {
    if (err) return res.status(500).json({ message: 'Error updating project' });
    res.json({ message: 'Project updated' });
  });
});

router.delete('/projects/:id', auth, (req, res) => {
  db.run("DELETE FROM projects WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ message: 'Error deleting project' });
    res.json({ message: 'Project deleted' });
  });
});

// Skill CRUD
router.post('/skills', auth, (req, res) => {
  const { category_name, skill_name, level } = req.body;
  db.run("INSERT INTO skills (category_name, skill_name, level) VALUES (?, ?, ?)", [category_name, skill_name, level], function(err) {
    if (err) return res.status(500).json({ message: 'Error adding skill' });
    res.status(201).json({ id: this.lastID, message: 'Skill added' });
  });
});

router.delete('/skills/:id', auth, (req, res) => {
  db.run("DELETE FROM skills WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).json({ message: 'Error deleting skill' });
    res.json({ message: 'Skill deleted' });
  });
});

// View Messages
router.get('/messages', auth, (req, res) => {
  db.all("SELECT * FROM messages ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching messages' });
    res.json(rows);
  });
});

module.exports = router;
