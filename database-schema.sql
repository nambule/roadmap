-- Create tables for the roadmap application
-- Run this SQL in your Supabase SQL Editor

-- Create roadmaps table
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT FALSE,
  share_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create objectives table
CREATE TABLE objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  color VARCHAR(7) DEFAULT '#6366f1',
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create modules table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  color VARCHAR(7) DEFAULT '#8b5cf6',
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create roadmap_items table
CREATE TABLE roadmap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_id UUID NOT NULL REFERENCES roadmaps(id) ON DELETE CASCADE,
  objective_id UUID REFERENCES objectives(id) ON DELETE SET NULL,
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(10) CHECK (category IN ('tech', 'business', 'mixed')) DEFAULT 'business',
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status VARCHAR(10) CHECK (status IN ('now', 'next', 'later')) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  roadmap_item_id UUID NOT NULL REFERENCES roadmap_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_roadmaps_user_id ON roadmaps(user_id);
CREATE INDEX idx_roadmaps_share_token ON roadmaps(share_token);
CREATE INDEX idx_objectives_roadmap_id ON objectives(roadmap_id);
CREATE INDEX idx_modules_roadmap_id ON modules(roadmap_id);
CREATE INDEX idx_roadmap_items_roadmap_id ON roadmap_items(roadmap_id);
CREATE INDEX idx_roadmap_items_objective_id ON roadmap_items(objective_id);
CREATE INDEX idx_roadmap_items_module_id ON roadmap_items(module_id);
CREATE INDEX idx_roadmap_items_status ON roadmap_items(status);
CREATE INDEX idx_comments_roadmap_item_id ON comments(roadmap_item_id);

-- Set up Row Level Security (RLS)
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policies for roadmaps
CREATE POLICY "Users can view their own roadmaps" ON roadmaps FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view public roadmaps" ON roadmaps FOR SELECT USING (is_public = true);
CREATE POLICY "Users can insert their own roadmaps" ON roadmaps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own roadmaps" ON roadmaps FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own roadmaps" ON roadmaps FOR DELETE USING (auth.uid() = user_id);

-- Policies for objectives
CREATE POLICY "Users can view objectives for accessible roadmaps" ON objectives FOR SELECT 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = objectives.roadmap_id AND (roadmaps.user_id = auth.uid() OR roadmaps.is_public = true)));
CREATE POLICY "Users can insert objectives for their roadmaps" ON objectives FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = objectives.roadmap_id AND roadmaps.user_id = auth.uid()));
CREATE POLICY "Users can update objectives for their roadmaps" ON objectives FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = objectives.roadmap_id AND roadmaps.user_id = auth.uid()));
CREATE POLICY "Users can delete objectives for their roadmaps" ON objectives FOR DELETE 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = objectives.roadmap_id AND roadmaps.user_id = auth.uid()));

-- Policies for modules
CREATE POLICY "Users can view modules for accessible roadmaps" ON modules FOR SELECT 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = modules.roadmap_id AND (roadmaps.user_id = auth.uid() OR roadmaps.is_public = true)));
CREATE POLICY "Users can insert modules for their roadmaps" ON modules FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = modules.roadmap_id AND roadmaps.user_id = auth.uid()));
CREATE POLICY "Users can update modules for their roadmaps" ON modules FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = modules.roadmap_id AND roadmaps.user_id = auth.uid()));
CREATE POLICY "Users can delete modules for their roadmaps" ON modules FOR DELETE 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = modules.roadmap_id AND roadmaps.user_id = auth.uid()));

-- Policies for roadmap_items
CREATE POLICY "Users can view items for accessible roadmaps" ON roadmap_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_items.roadmap_id AND (roadmaps.user_id = auth.uid() OR roadmaps.is_public = true)));
CREATE POLICY "Users can insert items for their roadmaps" ON roadmap_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_items.roadmap_id AND roadmaps.user_id = auth.uid()));
CREATE POLICY "Users can update items for their roadmaps" ON roadmap_items FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_items.roadmap_id AND roadmaps.user_id = auth.uid()));
CREATE POLICY "Users can delete items for their roadmaps" ON roadmap_items FOR DELETE 
  USING (EXISTS (SELECT 1 FROM roadmaps WHERE roadmaps.id = roadmap_items.roadmap_id AND roadmaps.user_id = auth.uid()));

-- Policies for comments
CREATE POLICY "Users can view comments for accessible roadmap items" ON comments FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM roadmap_items 
    JOIN roadmaps ON roadmaps.id = roadmap_items.roadmap_id 
    WHERE roadmap_items.id = comments.roadmap_item_id 
    AND (roadmaps.user_id = auth.uid() OR roadmaps.is_public = true)
  ));
CREATE POLICY "Authenticated users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_roadmaps_updated_at BEFORE UPDATE ON roadmaps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_objectives_updated_at BEFORE UPDATE ON objectives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roadmap_items_updated_at BEFORE UPDATE ON roadmap_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();