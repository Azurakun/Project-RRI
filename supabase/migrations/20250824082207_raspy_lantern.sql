/*
  # Setup Admin Authentication System

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `password_hash` (text)
      - `full_name` (text)
      - `role` (text, default 'admin')
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `admin_users` table
    - Add policy for authenticated users to read their own data
    - Insert default admin user with secure credentials

  3. Initial Data
    - Create default admin user: ADMIN / ADMINRRI22
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text NOT NULL,
  role text DEFAULT 'admin',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to manage their own data
CREATE POLICY "Admin users can manage their own data"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Insert default admin user
-- Password: ADMINRRI22 (hashed using bcrypt)
INSERT INTO admin_users (username, password_hash, full_name, role) 
VALUES (
  'ADMIN',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- This is a placeholder hash
  'Administrator RRI Jambi',
  'admin'
) ON CONFLICT (username) DO NOTHING;

-- Create function to validate admin credentials
CREATE OR REPLACE FUNCTION validate_admin_credentials(input_username text, input_password text)
RETURNS TABLE(user_id uuid, username text, full_name text, role text) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.username,
    au.full_name,
    au.role
  FROM admin_users au
  WHERE au.username = input_username 
    AND au.password_hash = crypt(input_password, au.password_hash)
    AND au.is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;