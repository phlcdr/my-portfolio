const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.resolve(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Content Table (Key-Value)
      db.run(`CREATE TABLE IF NOT EXISTS content (
        key TEXT PRIMARY KEY,
        value TEXT
      )`);

      // 2. Projects Table
      db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        tags TEXT,
        category TEXT,
        featured BOOLEAN DEFAULT 0,
        liveUrl TEXT,
        repoUrl TEXT,
        gradient TEXT
      )`);

      // 3. Skills Table
      db.run(`CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT NOT NULL,
        skill_name TEXT NOT NULL,
        level INTEGER DEFAULT 0
      )`);

      // 4. Users (Admin)
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )`);

      // 5. Messages (Contact Form)
      db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        subject TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Seed initial data if empty
      db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
        if (row.count === 0) {
          const hashedPassword = await bcrypt.hash('admin123', 10);
          db.run("INSERT INTO users (username, password) VALUES (?, ?)", ['admin', hashedPassword]);
          console.log("Admin user created: admin / admin123");
        }
      });

      db.get("SELECT COUNT(*) as count FROM content", (err, row) => {
        if (row.count === 0) {
          const initialContent = [
            ['heroTitle', 'Philip John Cidro'],
            ['heroBio', 'I craft digital experiences that merge clean architecture with stunning design. Passionate about building scalable, secure, and high-performance web applications.'],
            ['heroTaglines', JSON.stringify(["Full-Stack Developer", "Problem Solving", "Collaboration"])],
            ['location', 'Philippines'],
            ['available', 'true'],
            ['resumeUrl', '#'],
            ['profilePicture', 'https://via.placeholder.com/400'],
            ['aboutBio', 'I specialize in building end-to-end solutions — from pixel-perfect React interfaces to robust Node.js APIs — with a focus on performance, security, and maintainability.']
          ];
          const stmt = db.prepare("INSERT INTO content (key, value) VALUES (?, ?)");
          initialContent.forEach(item => stmt.run(item));
          stmt.finalize();
        }
      });

      db.get("SELECT COUNT(*) as count FROM projects", (err, row) => {
        if (row.count === 0) {
          const initialProjects = [
            ["Enterprise CRM System", "A full-featured CRM with attendance tracking, performance analytics, and real-time supervisor dashboards build with Laravel & Vue.", "Laravel, Vue.js, MySQL, REST API", "Full-Stack", 1, "#", "#", "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"],
            ["React Portfolio Platform", "A dynamic, enterprise-grade portfolio website with glassmorphism design, advanced animations, and security hardening.", "React, Framer Motion, Zustand, CSS3", "Frontend", 1, "#", "#", "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)"],
            ["Real-Time Chat Application", "WebSocket-powered chat app with private rooms, file sharing, and message encryption for enterprise teams.", "Node.js, Socket.io, React, MongoDB", "Full-Stack", 0, "#", "#", "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)"]
          ];
          const stmt = db.prepare("INSERT INTO projects (title, description, tags, category, featured, liveUrl, repoUrl, gradient) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
          initialProjects.forEach(item => stmt.run(item));
          stmt.finalize();
        }
      });

      db.get("SELECT COUNT(*) as count FROM skills", (err, row) => {
        if (row.count === 0) {
          const initialSkills = [
            ["Frontend", "React / Next.js", 92],
            ["Frontend", "TypeScript", 85],
            ["Frontend", "CSS / Tailwind", 90],
            ["Backend", "Node.js / Express", 85],
            ["Backend", "PHP / Laravel", 88],
            ["Database", "MySQL / PostgreSQL", 84]
          ];
          const stmt = db.prepare("INSERT INTO skills (category_name, skill_name, level) VALUES (?, ?, ?)");
          initialSkills.forEach(item => stmt.run(item));
          stmt.finalize();
          console.log("Database initialized and seeded.");
          resolve();
        } else {
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initDb };
