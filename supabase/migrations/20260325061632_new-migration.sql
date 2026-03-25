-- 1. Content Table
CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    description TEXT,
    tags TEXT,
    category TEXT,
    featured BOOLEAN DEFAULT false,
    liveUrl TEXT,
    repoUrl TEXT,
    gradient TEXT
);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_name TEXT NOT NULL,
    skill_name TEXT NOT NULL,
    level INTEGER DEFAULT 0
);

-- 4. Users (Admin)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- 5. Messages (Contact Form)
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial data
INSERT INTO users (username, password) 
VALUES ('admin', '$2a$10$CwTycUXWue0Thq9StjUM0uEn6GStYvE0S4h7yG1yE0S4h7yG1yE0S') -- Placeholder hash for 'admin123'
ON CONFLICT (username) DO NOTHING;

INSERT INTO content (key, value)
VALUES 
    ('heroTitle', 'Philip John Cidro'),
    ('heroBio', 'I craft digital experiences that merge clean architecture with stunning design. Passionate about building scalable, secure, and high-performance web applications.'),
    ('heroTaglines', '["Full-Stack Developer", "Problem Solving", "Collaboration"]'),
    ('location', 'Philippines'),
    ('available', 'true'),
    ('resumeUrl', '#'),
    ('profilePicture', 'https://via.placeholder.com/400'),
    ('aboutBio', 'I specialize in building end-to-end solutions — from pixel-perfect React interfaces to robust Node.js APIs — with a focus on performance, security, and maintainability.')
ON CONFLICT (key) DO NOTHING;

INSERT INTO projects (title, description, tags, category, featured, liveUrl, repoUrl, gradient)
VALUES 
    ('Enterprise CRM System', 'A full-featured CRM with attendance tracking, performance analytics, and real-time supervisor dashboards build with Laravel & Vue.', 'Laravel, Vue.js, MySQL, REST API', 'Full-Stack', true, '#', '#', 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'),
    ('React Portfolio Platform', 'A dynamic, enterprise-grade portfolio website with glassmorphism design, advanced animations, and security hardening.', 'React, Framer Motion, Zustand, CSS3', 'Frontend', true, '#', '#', 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)'),
    ('Real-Time Chat Application', 'WebSocket-powered chat app with private rooms, file sharing, and message encryption for enterprise teams.', 'Node.js, Socket.io, React, MongoDB', 'Full-Stack', false, '#', '#', 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)')
ON CONFLICT DO NOTHING;

INSERT INTO skills (category_name, skill_name, level)
VALUES 
    ('Frontend', 'React / Next.js', 92),
    ('Frontend', 'TypeScript', 85),
    ('Frontend', 'CSS / Tailwind', 90),
    ('Backend', 'Node.js / Express', 85),
    ('Backend', 'PHP / Laravel', 88),
    ('Database', 'MySQL / PostgreSQL', 84)
ON CONFLICT DO NOTHING;
