/*
  # Create Schedule Management Tables
*/

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  frequency VARCHAR(255) NOT NULL,
  color VARCHAR(255) NOT NULL DEFAULT '#0f4c81',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  program_id CHAR(36),
  waktu VARCHAR(255) NOT NULL,
  program_name VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  penyiar VARCHAR(255),
  kategori VARCHAR(255),
  durasi VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- Insert default programs
INSERT INTO programs (name, frequency, color) VALUES
  ('Pro 1', 'FM 88.5 MHz', '#70f7ff'),
  ('Pro 2', 'FM 90.9 MHz', '#1fffe1'),
  ('Pro 4', 'FM 99.2 MHz', '#87f38e');

/*
  # Admin Panel Database Schema
*/

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  `role` VARCHAR(255) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Organization Members Table
CREATE TABLE IF NOT EXISTS organization_members (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  department VARCHAR(255) DEFAULT '',
  email VARCHAR(255) DEFAULT '',
  phone VARCHAR(255) DEFAULT '',
  photo_url VARCHAR(255) DEFAULT '',
  bio TEXT,
  order_index INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TIME DEFAULT '00:00:00',
  location VARCHAR(255) DEFAULT '',
  image_url VARCHAR(255) DEFAULT '',
  category VARCHAR(255) DEFAULT 'general',
  status VARCHAR(255) DEFAULT 'upcoming',
  max_participants INT DEFAULT 0,
  contact_info VARCHAR(255) DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample organization data
INSERT INTO organization_members (name, position, department, photo_url, order_index) VALUES
('Drs. Ahmad Suryadi, M.Si', 'Kepala Stasiun', 'Pimpinan', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 1),
('Ir. Siti Nurhaliza, M.M', 'Kepala Seksi Programa', 'Programa', 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 2),
('Budi Santoso, S.T', 'Kepala Seksi Teknik', 'Teknik', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 3),
('Dra. Maya Sari, M.Kom', 'Kepala Seksi Berita', 'Berita', 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 4),
('H. Bambang Wijaya, S.E', 'Kepala Seksi Administrasi', 'Administrasi', 'https://images.pexels.com/photos/2182973/pexels-photo-2182973.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 5),
('Dra. Rina Kartika, M.Ak', 'Kepala Seksi Keuangan', 'Keuangan', 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop', 6);

-- Insert sample events
INSERT INTO events (title, description, event_date, event_time, location, image_url, category, status) VALUES
('Festival Musik Tradisional Jambi', 'Pertunjukan musik tradisional Jambi dengan berbagai alat musik khas daerah', '2025-02-15', '19:00:00', 'Gedung Kesenian Jambi', 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop', 'music', 'upcoming'),
('Talk Show Ekonomi Kreatif', 'Diskusi tentang pengembangan ekonomi kreatif di Provinsi Jambi', '2025-02-22', '10:00:00', 'Studio RRI Jambi', 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop', 'talk-show', 'upcoming'),
('Peringatan Hari Radio Nasional', 'Perayaan Hari Radio Nasional dengan berbagai kegiatan menarik', '2024-09-11', '08:00:00', 'Kantor RRI Jambi', 'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop', 'celebration', 'past');

/*
  # Setup Admin Authentication System
*/

-- Insert default admin user
-- Password: ADMINRRI22 (hashed using bcrypt)
INSERT INTO admin_users (username, password_hash, full_name, role)
VALUES (
  'ADMIN',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- This is a placeholder hash for 'ADMINRRI22'
  'Administrator RRI Jambi',
  'admin'
);