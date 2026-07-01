-- CompanyVoice Database Schema

-- Drop tables if they exist (for clean initialization)
-- Note: These are created automatically by Sequelize, this is for reference

DROP TABLE IF EXISTS solution_links;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS post_tags;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS settings;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('employee', 'admin') DEFAULT 'employee',
  xp INT DEFAULT 0,
  tier ENUM('Newcomer', 'Contributor', 'Champion', 'Innovator') DEFAULT 'Newcomer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Posts table
CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  type ENUM('challenge', 'solution', 'both') NOT NULL,
  title VARCHAR(200) NOT NULL,
  body LONGTEXT NOT NULL,
  department VARCHAR(100) NOT NULL,
  status ENUM('open', 'in_progress', 'resolved') DEFAULT 'open',
  is_anonymous BOOLEAN DEFAULT FALSE,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  xp_awarded INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Post Tags table
CREATE TABLE post_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  tag VARCHAR(50) NOT NULL,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  INDEX idx_post_id (post_id),
  INDEX idx_tag (tag)
);

-- Votes table
CREATE TABLE votes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  direction ENUM('up', 'down') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_post_vote (user_id, post_id),
  INDEX idx_post_id (post_id)
);

-- Comments table
CREATE TABLE comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT NOT NULL,
  user_id INT,
  body LONGTEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_post_id (post_id)
);

-- Solution Links table
CREATE TABLE solution_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  challenge_post_id INT NOT NULL,
  solution_post_id INT NOT NULL,
  FOREIGN KEY (challenge_post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (solution_post_id) REFERENCES posts(id) ON DELETE CASCADE,
  UNIQUE KEY unique_link (challenge_post_id, solution_post_id),
  INDEX idx_challenge (challenge_post_id),
  INDEX idx_solution (solution_post_id)
);

-- Settings table
CREATE TABLE settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  key VARCHAR(100) NOT NULL UNIQUE,
  value LONGTEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_xp ON users(xp);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_department ON posts(department);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
