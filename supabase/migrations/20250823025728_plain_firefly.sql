/*
  # Admin Panel Database Schema

  1. New Tables
    - `admin_users` - Admin authentication
    - `organization_members` - Staff/organizational structure
    - `events` - Event management
    - Update existing tables with admin features

  2. Security
    - Enable RLS on all tables
    - Add admin-specific policies
    - Secure admin authentication
*/

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Organization Members Table
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  department text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  photo_url text DEFAULT '',
  bio text DEFAULT '',
  order_index integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  event_date date NOT NULL,
  event_time time DEFAULT '00:00:00',
  location text DEFAULT '',
  image_url text DEFAULT '',
  category text DEFAULT 'general',
  status text DEFAULT 'upcoming',
  max_participants integer DEFAULT 0,
  contact_info text DEFAULT '',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Admin Users Policies
CREATE POLICY "Admin users can manage their own data"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Organization Members Policies
CREATE POLICY "Anyone can read organization members"
  ON organization_members
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage organization members"
  ON organization_members
  FOR ALL
  TO authenticated
  USING (true);

-- Events Policies
CREATE POLICY "Anyone can read active events"
  ON events
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (true);

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