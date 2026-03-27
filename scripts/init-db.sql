-- Fan Creations Table
CREATE TABLE IF NOT EXISTS fan_creations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_name TEXT NOT NULL,
  twitter_handle TEXT,
  instagram_handle TEXT,
  category TEXT NOT NULL CHECK (category IN ('PEDDI Celebrations', 'Movie Edits', 'Photo Edits', 'Fan Art', 'Short Videos')),
  title TEXT,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  is_featured BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for status and featured
CREATE INDEX IF NOT EXISTS idx_fan_creations_status ON fan_creations(status);
CREATE INDEX IF NOT EXISTS idx_fan_creations_featured ON fan_creations(is_featured);
CREATE INDEX IF NOT EXISTS idx_fan_creations_category ON fan_creations(category);
CREATE INDEX IF NOT EXISTS idx_fan_creations_created_at ON fan_creations(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE fan_creations ENABLE ROW LEVEL SECURITY;

-- Public can view approved creations only
CREATE POLICY "approved_creations_are_public" ON fan_creations
  FOR SELECT USING (status = 'approved');

-- Admin can view all creations
CREATE POLICY "admin_can_view_all" ON fan_creations
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Anyone can insert (submissions)
CREATE POLICY "anyone_can_submit" ON fan_creations
  FOR INSERT WITH CHECK (true);

-- Admin can update creations
CREATE POLICY "admin_can_update" ON fan_creations
  FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Admin table for authorization
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(user_email);
