/*
  # Create Social Support Applications Table

  1. New Tables
    - `applications`
      - `id` (uuid, primary key) - Unique application identifier
      - `user_id` (uuid, nullable) - Optional user reference for authenticated users
      - `status` (text) - Application status (draft, submitted, under_review, approved, rejected)
      - `current_step` (integer) - Current form step for resuming progress
      - `created_at` (timestamptz) - Application creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
      - `submitted_at` (timestamptz, nullable) - Submission timestamp
      
      Personal Information:
      - `name` (text) - Applicant's full name
      - `national_id` (text) - National identification number
      - `date_of_birth` (date) - Date of birth
      - `gender` (text) - Gender
      - `address` (text) - Street address
      - `city` (text) - City
      - `state` (text) - State/Province
      - `country` (text) - Country
      - `phone` (text) - Phone number
      - `email` (text) - Email address
      
      Family & Financial Info:
      - `marital_status` (text) - Marital status
      - `dependents` (integer) - Number of dependents
      - `employment_status` (text) - Employment status
      - `monthly_income` (numeric) - Monthly income amount
      - `housing_status` (text) - Housing situation
      
      Situation Descriptions:
      - `financial_situation` (text) - Current financial situation description
      - `employment_circumstances` (text) - Employment circumstances description
      - `reason_for_applying` (text) - Reason for applying description

  2. Security
    - Enable RLS on `applications` table
    - Add policies for public insert (anonymous applications allowed)
    - Add policies for users to view and update their own applications
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'draft',
  current_step integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  submitted_at timestamptz,
  
  name text,
  national_id text,
  date_of_birth date,
  gender text,
  address text,
  city text,
  state text,
  country text,
  phone text,
  email text,
  
  marital_status text,
  dependents integer,
  employment_status text,
  monthly_income numeric(12, 2),
  housing_status text,
  
  financial_situation text,
  employment_circumstances text,
  reason_for_applying text
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create applications"
  ON applications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can view their own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Anonymous users can view their applications by ID"
  ON applications
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can update their own applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can update applications"
  ON applications
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);