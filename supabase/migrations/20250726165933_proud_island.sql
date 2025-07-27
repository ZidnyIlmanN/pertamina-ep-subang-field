/*
  # Initial Schema for Pertamina Work Report System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `role` (enum: admin, penanggung_jawab, pekerja)
      - `avatar_url` (text, nullable)
      - `phone` (text, nullable)
      - `department` (text, nullable)
      - `position` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `work_reports`
      - `id` (uuid, primary key)
      - `code` (text, unique)
      - `title` (text)
      - `description` (text)
      - `category` (enum)
      - `start_date` (date)
      - `end_date` (date)
      - `status` (enum)
      - `progress` (integer, 0-100)
      - `worker_count` (integer)
      - `responsible_persons` (text array)
      - `location_name` (text)
      - `location_latitude` (numeric, nullable)
      - `location_longitude` (numeric, nullable)
      - `risk_level` (enum)
      - `weather_condition` (enum)
      - `safety_incidents` (integer)
      - `photos` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `created_by` (uuid, references profiles)

    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `message` (text)
      - `type` (enum: info, success, warning, error)
      - `read` (boolean)
      - `data` (jsonb, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
    - Add policies for notifications per user
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'penanggung_jawab', 'pekerja');
CREATE TYPE work_category AS ENUM ('perawatan', 'pembangunan', 'upgrading', 'perbaikan');
CREATE TYPE work_status AS ENUM ('planning', 'ongoing', 'completed', 'delayed');
CREATE TYPE risk_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE weather_condition AS ENUM ('sunny', 'cloudy', 'rainy', 'stormy');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role DEFAULT 'pekerja',
  avatar_url text,
  phone text,
  department text,
  position text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create work_reports table
CREATE TABLE IF NOT EXISTS work_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category work_category NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status work_status DEFAULT 'planning',
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  worker_count integer NOT NULL CHECK (worker_count > 0),
  responsible_persons text[] NOT NULL,
  location_name text NOT NULL,
  location_latitude numeric,
  location_longitude numeric,
  risk_level risk_level NOT NULL,
  weather_condition weather_condition NOT NULL,
  safety_incidents integer DEFAULT 0 CHECK (safety_incidents >= 0),
  photos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES profiles(id) NOT NULL
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type DEFAULT 'info',
  read boolean DEFAULT false,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Work reports policies
CREATE POLICY "Users can read work reports"
  ON work_reports
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create work reports"
  ON work_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own work reports"
  ON work_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Admins and penanggung_jawab can update all work reports"
  ON work_reports
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'penanggung_jawab')
    )
  );

CREATE POLICY "Admins can delete work reports"
  ON work_reports
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Notifications policies
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create functions for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_reports_updated_at
  BEFORE UPDATE ON work_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_work_reports_created_by ON work_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_work_reports_status ON work_reports(status);
CREATE INDEX IF NOT EXISTS idx_work_reports_category ON work_reports(category);
CREATE INDEX IF NOT EXISTS idx_work_reports_dates ON work_reports(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);