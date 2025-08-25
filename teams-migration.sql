-- Migration SQL to add Teams functionality
-- Run this SQL in your Supabase SQL Editor after the initial database schema

-- Create teams table (similar to modules table)
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  color VARCHAR(7) DEFAULT '#06b6d4',
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Add team_id column to roadmap_items table
ALTER TABLE roadmap_items 
ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- Create indexes for teams
CREATE INDEX idx_teams_roadmap_id ON teams(roadmap_id);
CREATE INDEX idx_roadmap_items_team_id ON roadmap_items(team_id);

-- Set up Row Level Security (RLS) for teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Policies for teams (same pattern as modules)
CREATE POLICY "Users can view teams for accessible roadmaps" ON teams FOR SELECT 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = teams.roadmap_id AND (roadmaps.user_id = auth.uid() OR roadmaps.is_public = true)));
CREATE POLICY "Users can insert teams for their roadmaps" ON teams FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = teams.roadmap_id AND roadmaps.user_id = auth.uid()));
CREATE POLICY "Users can update teams for their roadmaps" ON teams FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = teams.roadmap_id AND roadmaps.user_id = auth.uid()));
CREATE POLICY "Users can delete teams for their roadmaps" ON teams FOR DELETE 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = teams.roadmap_id AND roadmaps.user_id = auth.uid()));

-- Create trigger for teams updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();