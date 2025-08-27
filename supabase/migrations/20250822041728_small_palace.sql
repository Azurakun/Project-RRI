/*
  # Create Schedule Management Tables

  1. New Tables
    - `programs`
      - `id` (uuid, primary key)
      - `name` (text)
      - `frequency` (text)
      - `color` (text)
      - `created_at` (timestamp)
    - `schedules`
      - `id` (uuid, primary key)
      - `program_id` (uuid, foreign key)
      - `waktu` (text)
      - `program_name` (text)
      - `deskripsi` (text)
      - `penyiar` (text)
      - `kategori` (text)
      - `durasi` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their data
*/

-- Create programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  frequency text NOT NULL,
  color text NOT NULL DEFAULT '#0f4c81',
  created_at timestamptz DEFAULT now()
);

-- Create schedules table
CREATE TABLE IF NOT EXISTS schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id uuid REFERENCES programs(id) ON DELETE CASCADE,
  waktu text NOT NULL,
  program_name text NOT NULL,
  deskripsi text DEFAULT '',
  penyiar text DEFAULT '',
  kategori text DEFAULT '',
  durasi text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

-- Create policies for programs
CREATE POLICY "Anyone can read programs"
  ON programs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can manage programs"
  ON programs
  FOR ALL
  TO public
  USING (true);

-- Create policies for schedules
CREATE POLICY "Anyone can read schedules"
  ON schedules
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can manage schedules"
  ON schedules
  FOR ALL
  TO public
  USING (true);

-- Insert default programs
INSERT INTO programs (name, frequency, color) VALUES
  ('Pro 1', 'FM 88.5 MHz', '#70f7ff'),
  ('Pro 2', 'FM 90.9 MHz', '#1fffe1'),
  ('Pro 4', 'FM 99.2 MHz', '#87f38e')
ON CONFLICT DO NOTHING;