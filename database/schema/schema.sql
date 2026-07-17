-- K-School Database Schema
-- Run this file to initialize the database

CREATE DATABASE IF NOT EXISTS kschool_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kschool_db;

-- ── USERS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  profile_picture VARCHAR(500),
  theme VARCHAR(20) DEFAULT 'light',
  language VARCHAR(10) DEFAULT 'en',
  font_size VARCHAR(20) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── ROLES ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- Seed roles
INSERT IGNORE INTO roles (name) VALUES
  ('student'),
  ('teacher'),
  ('pastor'),
  ('editor'),
  ('developer'),
  ('admin');

-- ── USER ROLES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Demo Admin Account
INSERT IGNORE INTO users (full_name, email, password_hash) VALUES
  ('Admin User', 'admin@kebenasdachurch.org', '$2a$12$duZbf2RAlHrEfSt2GPK6ZOlhQIkqVxB7mIqjmVWE7IVslbws5PGpq'),
  ('Pastor User', 'pastor@kebenasdachurch.org', '$2a$12$LEQq.uBjtBjubHbKM5PgCOvNg5ee9Q5IHUHAeTuOBMSK1W3EqwaLm'),
  ('Editor User', 'editor@kebenasdachurch.org', '$2a$12$EOQ6GSEFZVTc3GAlvja4SOnODFyhzoc6itJwZkX5oAvHCZsOpEAve'),
  ('Teacher User', 'teacher@kebenasdachurch.org', '$2a$12$FL6ohOknsajFwS0AevCnAOult5yE8U7ZUQvNadx/pK3TRDodB2KyG'),
  ('Developer User', 'developer@kebenasdachurch.org', '$2a$12$JQT7jCVQDv1ayX/wUuZaxOtHjYJK2Yvet0D0LGOiQTf8HZKOmMetW'),
  ('Student User', 'student@kebenasdachurch.org', '$2a$12$.ftABpIhk3cCMoGynP8QCuNHqNpHLldq3t4vhdYuJ8SyFrIqK91Ja');

INSERT IGNORE INTO user_roles (user_id, role_id)
  SELECT u.id, r.id
  FROM users u
  JOIN roles r ON r.name IN ('admin', 'student')
  WHERE u.email = 'Admin@kebenasdachurch.org';

INSERT IGNORE INTO user_roles (user_id, role_id)
  SELECT u.id, r.id
  FROM users u
  JOIN roles r ON r.name IN ('pastor', 'student')
  WHERE u.email = 'Pastor@kebenasdachurch.org';

INSERT IGNORE INTO user_roles (user_id, role_id)
  SELECT u.id, r.id
  FROM users u
  JOIN roles r ON r.name IN ('editor', 'student')
  WHERE u.email = 'Editor@kebenasdachurch.org';

INSERT IGNORE INTO user_roles (user_id, role_id)
  SELECT u.id, r.id
  FROM users u
  JOIN roles r ON r.name IN ('teacher', 'student')
  WHERE u.email = 'Teacher@kebenasdachurch.org';

INSERT IGNORE INTO user_roles (user_id, role_id)
  SELECT u.id, r.id
  FROM users u
  JOIN roles r ON r.name IN ('developer', 'student')
  WHERE u.email = 'Developer@kebenasdachurch.org';

INSERT IGNORE INTO user_roles (user_id, role_id)
  SELECT u.id, r.id
  FROM users u
  JOIN roles r ON r.name = 'student'
  WHERE u.email = 'Student@kebenasdachurch.org';

-- ── COURSES ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  teacher_id INT,
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── LESSONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  video_url VARCHAR(500),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ── ASSIGNMENTS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  due_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ── SUBMISSIONS ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  assignment_id INT NOT NULL,
  student_id INT NOT NULL,
  content TEXT,
  file_url VARCHAR(500),
  grade INT,
  feedback TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── ENROLLMENTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active','completed','cancelled') DEFAULT 'active',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (user_id, course_id)
);

-- ── MESSAGES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  content TEXT NOT NULL,
  attachment_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── NOTIFICATIONS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── POSTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  content LONGTEXT,
  category VARCHAR(100),
  status ENUM('draft', 'published') DEFAULT 'draft',
  author_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── PODCASTS ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS podcasts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  audio_url VARCHAR(500),
  duration INT COMMENT 'Duration in seconds',
  author_id INT,
  status ENUM('draft', 'published') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── MEMBERS (PASTOR) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(20),
  address TEXT,
  membership_date DATE,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── AUDIT LOGS ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(200) NOT NULL,
  resource VARCHAR(100),
  resource_id INT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);


-- ── PASSWORD RESET TOKENS ──────────────────────────────
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ── EVENTS / ANNOUNCEMENTS ────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  title_am VARCHAR(300),
  title_or VARCHAR(300),
  description TEXT,
  description_am TEXT,
  description_or TEXT,
  event_date DATE,
  event_time VARCHAR(50),
  category VARCHAR(100),
  image_url VARCHAR(500),
  link VARCHAR(500),
  status ENUM('draft','published') DEFAULT 'published',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ── WEEKLY PROGRAMS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS programs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  day_en VARCHAR(50) NOT NULL,
  day_am VARCHAR(50),
  day_or VARCHAR(50),
  name_en VARCHAR(200) NOT NULL,
  name_am VARCHAR(200),
  name_or VARCHAR(200),
  time_display VARCHAR(100),
  description TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── DAILY QUOTES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  text_en TEXT NOT NULL,
  text_am TEXT,
  text_or TEXT,
  reference VARCHAR(200),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── SITE SETTINGS (for editor to manage) ─────────────
CREATE TABLE IF NOT EXISTS site_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed default site settings
INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES
  ('church_phone', '+251911772660'),
  ('church_email', 'info@kebenasdachurch.org'),
  ('telegram_link', 'https://t.me/+c0aL2WBX7L5iNWI0'),
  ('pastor_name', 'ፓ/ር ወርቁ ፀጋዬ'),
  ('facebook_url', 'https://www.facebook.com/kebenasda'),
  ('youtube_url', 'https://www.youtube.com/@kebenasda'),
  ('instagram_url', 'https://www.instagram.com/kebenasda'),
  ('tiktok_url', 'https://www.tiktok.com/@kebenasda');

-- Seed weekly programs
INSERT IGNORE INTO programs (day_en, day_am, day_or, name_en, name_am, name_or, time_display, description, order_index) VALUES
('Saturday','ሰንበት (ቅዳሜ)','Sanbata','Prayer Meeting','የጸሎት አገልግሎት','Sagantaa Kadhannaa','ከ ጠዋቱ 2:00-3:00','የጠወት የፀሎት ጊዜ',1),
('Saturday','ሰንበት (ቅዳሜ)','Sanbata','Sabbath School','የሰንበት ትምህርት','Mana Barnootaa Sanbataa','ከ ጠዋቱ 3:00-4:30','የመፅሀፍ ቅዱስ ጥናት',2),
('Saturday','ሰንበት (ቅዳሜ)','Sanbata','Worship Service','የአምልኮ ግዜ','Tajaajila Waaqeffannaa','ከ ጠዋቱ 4:45-6:30','የአምልኮ ጊዜ',3),
('Saturday','ሰንበት (ቅዳሜ)','Sanbata','Youth Service','የወጣቶች አገልግሎት','Sagantaalee Dargaggoota','ከሰዓት 8:30-10:00','የወጣቶች አገልግሎት',4),
('Wednesday','ረቡዕ','Roobii','Prayer Meeting','የጸሎት ጊዜ','Walgahii Kadhannaa','ከምሽቱ 12:00-1:30','የፀሎት ጊዜ',5),
('Friday','ዓርብ','Jimaata','Vespers Service','የምሽት አምልኮ','Tajaajila Galgalaa','ከምሽቱ 12:00-1:30','የመፅሀፍ ቅዱስ ጥናት እና የአምልኮ ጊዜ',6);

-- Seed daily quotes
INSERT IGNORE INTO quotes (text_en, text_am, reference) VALUES
('For God so loved the world that he gave his one and only Son','እግዚአብሔር ዓለሙን እጅግ ወዶ አንድ ልጁን ሰጠ','John 3:16'),
('I can do all things through Christ who strengthens me','ሁሉን ነገር በሚያበረታኝ ክርስቶስ ማድረግ እችላለሁ','Philippians 4:13'),
('The Lord is my shepherd; I shall not want','እግዚአብሔር እረኛዬ ነው፤ የሚጎድለኝ ምንም የለም','Psalm 23:1');

-- Seed sample events
INSERT IGNORE INTO events (title, title_am, description, description_am, event_date, event_time, category, status) VALUES
('Sabbath Worship Service','የሰንበት አምልኮ አገልግሎት','Join us every Saturday for worship','በየሰንበቱ ለአምልኮ ይቀላቀሉን','2025-12-06','4:45 AM','Worship','published'),
('Youth Program','የወጣቶች ፕሮግራም','Special youth program and activities','ልዩ የወጣቶች ፕሮግራም','2025-12-13','8:30 AM','Youth','published');
