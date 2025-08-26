-- Random Assignment SQL Script
-- This script randomly assigns teams, objectives, and modules to all roadmap items
-- Run this in your Supabase SQL Editor

-- Update all roadmap_items with random assignments
UPDATE roadmap_items 
SET 
  team_id = (
    SELECT id 
    FROM teams 
    WHERE teams.roadmap_id = roadmap_items.roadmap_id 
    ORDER BY RANDOM() 
    LIMIT 1
  ),
  objective_id = (
    SELECT id 
    FROM objectives 
    WHERE objectives.roadmap_id = roadmap_items.roadmap_id 
    ORDER BY RANDOM() 
    LIMIT 1
  ),
  module_id = (
    SELECT id 
    FROM modules 
    WHERE modules.roadmap_id = roadmap_items.roadmap_id 
    ORDER BY RANDOM() 
    LIMIT 1
  )
WHERE EXISTS (
  SELECT 1 FROM teams WHERE teams.roadmap_id = roadmap_items.roadmap_id
) 
AND EXISTS (
  SELECT 1 FROM objectives WHERE objectives.roadmap_id = roadmap_items.roadmap_id
) 
AND EXISTS (
  SELECT 1 FROM modules WHERE modules.roadmap_id = roadmap_items.roadmap_id
);

-- Optional: View the results
SELECT 
  ri.title as item_title,
  ri.status,
  t.title as team,
  o.title as objective, 
  m.title as module
FROM roadmap_items ri
LEFT JOIN teams t ON ri.team_id = t.id
LEFT JOIN objectives o ON ri.objective_id = o.id  
LEFT JOIN modules m ON ri.module_id = m.id
ORDER BY ri.title;