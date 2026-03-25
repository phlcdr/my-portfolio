const express = require('express');
const router = express.Router();
const { supabase } = require('../db');
const auth = require('../middleware/auth');

// --- PUBLIC ROUTES ---

// 1. Get All Portfolio Data (Aggregate)
router.get('/portfolio', async (req, res) => {
  try {
    const [contentRes, projectsRes, skillsRes] = await Promise.all([
      supabase.from('content').select('*'),
      supabase.from('projects').select('*').order('featured', { ascending: false }).order('id', { ascending: false }),
      supabase.from('skills').select('*')
    ]);

    if (contentRes.error) throw contentRes.error;
    if (projectsRes.error) throw projectsRes.error;
    if (skillsRes.error) throw skillsRes.error;

    const portfolioData = {
      content: {},
      projects: projectsRes.data,
      skills: []
    };

    contentRes.data.forEach(row => portfolioData.content[row.key] = row.value);

    // Group skills by category
    const groupedSkills = {};
    skillsRes.data.forEach(row => {
      if (!groupedSkills[row.category_name]) groupedSkills[row.category_name] = [];
      groupedSkills[row.category_name].push({ id: row.id, name: row.skill_name, level: row.level });
    });

    portfolioData.skills = Object.keys(groupedSkills).map(cat => ({
      name: cat,
      skills: groupedSkills[cat]
    }));

    res.json(portfolioData);
  } catch (error) {
    console.error('PORTFOLIO_FETCH_ERROR:', error);
    res.status(500).json({ message: 'Error fetching portfolio data' });
  }
});

// 2. Contact form submission (Public)
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([{ name, email, subject, message }])
    .select();

  if (error) {
    console.error('CONTACT_SUBMIT_ERROR:', error);
    return res.status(500).json({ message: 'Error saving message' });
  }
  
  res.status(201).json({ id: data[0].id, message: 'Message received' });
});


// --- PROTECTED ADMIN ROUTES ---

// Update Content Key
router.put('/content/:key', auth, async (req, res) => {
  const { value } = req.body;
  const { error } = await supabase
    .from('content')
    .upsert({ key: req.params.key, value }, { onConflict: 'key' });

  if (error) {
    console.error('CONTENT_UPDATE_ERROR:', error);
    return res.status(500).json({ message: 'Error updating content' });
  }
  
  res.json({ message: 'Content updated successfully' });
});

// Project CRUD
router.post('/projects', auth, async (req, res) => {
  const { title, description, tags, category, featured, liveUrl, repoUrl, gradient } = req.body;
  const { data, error } = await supabase
    .from('projects')
    .insert([{ title, description, tags, category, featured: !!featured, liveUrl, repoUrl, gradient }])
    .select();

  if (error) {
    console.error('PROJECT_CREATE_ERROR:', error);
    return res.status(500).json({ message: 'Error creating project' });
  }
  
  res.status(201).json({ id: data[0].id, message: 'Project created' });
});

router.put('/projects/:id', auth, async (req, res) => {
  const { title, description, tags, category, featured, liveUrl, repoUrl, gradient } = req.body;
  const { error } = await supabase
    .from('projects')
    .update({ title, description, tags, category, featured: !!featured, liveUrl, repoUrl, gradient })
    .eq('id', req.params.id);

  if (error) {
    console.error('PROJECT_UPDATE_ERROR:', error);
    return res.status(500).json({ message: 'Error updating project' });
  }
  
  res.json({ message: 'Project updated' });
});

router.delete('/projects/:id', auth, async (req, res) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    console.error('PROJECT_DELETE_ERROR:', error);
    return res.status(500).json({ message: 'Error deleting project' });
  }
  
  res.json({ message: 'Project deleted' });
});

// Skill CRUD
router.post('/skills', auth, async (req, res) => {
  const { category_name, skill_name, level } = req.body;
  const { data, error } = await supabase
    .from('skills')
    .insert([{ category_name, skill_name, level }])
    .select();

  if (error) {
    console.error('SKILL_ADD_ERROR:', error);
    return res.status(500).json({ message: 'Error adding skill' });
  }
  
  res.status(201).json({ id: data[0].id, message: 'Skill added' });
});

router.delete('/skills/:id', auth, async (req, res) => {
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('id', req.params.id);

  if (error) {
    console.error('SKILL_DELETE_ERROR:', error);
    return res.status(500).json({ message: 'Error deleting skill' });
  }
  
  res.json({ message: 'Skill deleted' });
});

// View Messages
router.get('/messages', auth, async (req, res) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('MESSAGES_FETCH_ERROR:', error);
    return res.status(500).json({ message: 'Error fetching messages' });
  }
  
  res.json(data);
});

module.exports = router;


module.exports = router;
