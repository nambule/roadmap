-- HRIS Roadmap Data Population Script
-- This script populates the database with realistic HRIS roadmap data
-- Run this in your Supabase SQL Editor

-- First, let's assume you have a roadmap already created. If not, create one:
-- INSERT INTO roadmaps (title, description, user_id) 
-- VALUES ('HRIS Platform Development', 'Comprehensive Human Resource Information System roadmap', auth.uid());

-- Get the roadmap ID (replace with your actual roadmap ID if different)
-- For this script, we'll use a variable approach

DO $$
DECLARE
    roadmap_uuid UUID;
    
    -- Objective IDs
    core_hr_obj UUID;
    talent_mgmt_obj UUID;
    payroll_obj UUID;
    analytics_obj UUID;
    compliance_obj UUID;
    
    -- Module IDs
    employee_mod UUID;
    recruitment_mod UUID;
    payroll_mod UUID;
    performance_mod UUID;
    learning_mod UUID;
    
    -- Team IDs
    backend_team UUID;
    frontend_team UUID;
    mobile_team UUID;
    devops_team UUID;
    qa_team UUID;
    
BEGIN
    -- Get or create a roadmap (assumes you have one, or creates a new one)
    SELECT id INTO roadmap_uuid FROM roadmaps LIMIT 1;
    
    IF roadmap_uuid IS NULL THEN
        INSERT INTO roadmaps (title, description, user_id) 
        VALUES ('HRIS Platform Development', 'Comprehensive Human Resource Information System roadmap', auth.uid())
        RETURNING id INTO roadmap_uuid;
    END IF;
    
    -- Clear existing data for this roadmap
    DELETE FROM roadmap_items WHERE roadmap_id = roadmap_uuid;
    DELETE FROM teams WHERE roadmap_id = roadmap_uuid;
    DELETE FROM modules WHERE roadmap_id = roadmap_uuid;
    DELETE FROM objectives WHERE roadmap_id = roadmap_uuid;
    
    -- Create Objectives
    INSERT INTO objectives (title, color, order_index, roadmap_id) VALUES
    ('Core HR Operations', '#2563eb', 0, roadmap_uuid),
    ('Talent Management', '#7c3aed', 1, roadmap_uuid),
    ('Payroll & Benefits', '#059669', 2, roadmap_uuid),
    ('Analytics & Reporting', '#dc2626', 3, roadmap_uuid),
    ('Compliance & Security', '#ea580c', 4, roadmap_uuid);
    
    -- Get objective IDs
    SELECT id INTO core_hr_obj FROM objectives WHERE title = 'Core HR Operations' AND roadmap_id = roadmap_uuid;
    SELECT id INTO talent_mgmt_obj FROM objectives WHERE title = 'Talent Management' AND roadmap_id = roadmap_uuid;
    SELECT id INTO payroll_obj FROM objectives WHERE title = 'Payroll & Benefits' AND roadmap_id = roadmap_uuid;
    SELECT id INTO analytics_obj FROM objectives WHERE title = 'Analytics & Reporting' AND roadmap_id = roadmap_uuid;
    SELECT id INTO compliance_obj FROM objectives WHERE title = 'Compliance & Security' AND roadmap_id = roadmap_uuid;
    
    -- Create Modules
    INSERT INTO modules (title, color, description, order_index, roadmap_id) VALUES
    ('Employee Management', '#3b82f6', 'Core employee data, profiles, and lifecycle management', 0, roadmap_uuid),
    ('Recruitment & Onboarding', '#8b5cf6', 'Hiring process, applicant tracking, and new hire onboarding', 1, roadmap_uuid),
    ('Payroll Engine', '#10b981', 'Salary calculation, tax management, and payment processing', 2, roadmap_uuid),
    ('Performance Management', '#f59e0b', 'Goal setting, reviews, and performance tracking', 3, roadmap_uuid),
    ('Learning & Development', '#ef4444', 'Training programs, skill tracking, and career development', 4, roadmap_uuid);
    
    -- Get module IDs
    SELECT id INTO employee_mod FROM modules WHERE title = 'Employee Management' AND roadmap_id = roadmap_uuid;
    SELECT id INTO recruitment_mod FROM modules WHERE title = 'Recruitment & Onboarding' AND roadmap_id = roadmap_uuid;
    SELECT id INTO payroll_mod FROM modules WHERE title = 'Payroll Engine' AND roadmap_id = roadmap_uuid;
    SELECT id INTO performance_mod FROM modules WHERE title = 'Performance Management' AND roadmap_id = roadmap_uuid;
    SELECT id INTO learning_mod FROM modules WHERE title = 'Learning & Development' AND roadmap_id = roadmap_uuid;
    
    -- Create Teams
    INSERT INTO teams (title, color, description, order_index, roadmap_id) VALUES
    ('Backend Development', '#1e40af', 'API development, database design, and server-side logic', 0, roadmap_uuid),
    ('Frontend Development', '#7c2d12', 'Web interface, user experience, and client-side functionality', 1, roadmap_uuid),
    ('Mobile Development', '#065f46', 'iOS and Android applications for HR mobile access', 2, roadmap_uuid),
    ('DevOps & Infrastructure', '#7c1d6f', 'Cloud infrastructure, deployment, and system monitoring', 3, roadmap_uuid),
    ('QA & Testing', '#92400e', 'Quality assurance, automated testing, and user acceptance testing', 4, roadmap_uuid);
    
    -- Get team IDs
    SELECT id INTO backend_team FROM teams WHERE title = 'Backend Development' AND roadmap_id = roadmap_uuid;
    SELECT id INTO frontend_team FROM teams WHERE title = 'Frontend Development' AND roadmap_id = roadmap_uuid;
    SELECT id INTO mobile_team FROM teams WHERE title = 'Mobile Development' AND roadmap_id = roadmap_uuid;
    SELECT id INTO devops_team FROM teams WHERE title = 'DevOps & Infrastructure' AND roadmap_id = roadmap_uuid;
    SELECT id INTO qa_team FROM teams WHERE title = 'QA & Testing' AND roadmap_id = roadmap_uuid;
    
    -- Create Roadmap Items
    
    -- NOW items (Current Sprint/Quarter)
    INSERT INTO roadmap_items (roadmap_id, objective_id, module_id, team_id, title, description, category, tags, status, order_index) VALUES
    
    -- Core HR Operations - Now
    (roadmap_uuid, core_hr_obj, employee_mod, backend_team, 'Employee Database Schema', 'Design and implement core employee data model with fields for personal info, job details, and organizational hierarchy', 'tech', ARRAY['database', 'schema', 'backend'], 'now', 0),
    (roadmap_uuid, core_hr_obj, employee_mod, frontend_team, 'Employee Profile Pages', 'Create responsive employee profile pages with editable fields and photo upload functionality', 'business', ARRAY['frontend', 'ui', 'profiles'], 'now', 1),
    (roadmap_uuid, core_hr_obj, employee_mod, qa_team, 'Employee Data Validation', 'Implement comprehensive validation rules for employee data entry and updates', 'tech', ARRAY['validation', 'security', 'testing'], 'now', 2),
    
    -- Talent Management - Now
    (roadmap_uuid, talent_mgmt_obj, recruitment_mod, backend_team, 'Job Posting API', 'RESTful API endpoints for creating, updating, and managing job postings with approval workflows', 'tech', ARRAY['api', 'jobs', 'workflow'], 'now', 3),
    (roadmap_uuid, talent_mgmt_obj, recruitment_mod, frontend_team, 'Candidate Application Form', 'User-friendly application form with file upload, auto-save, and progress tracking', 'business', ARRAY['forms', 'applications', 'ux'], 'now', 4),
    
    -- NEXT items (Next Sprint/Quarter)
    
    -- Payroll & Benefits - Next
    (roadmap_uuid, payroll_obj, payroll_mod, backend_team, 'Salary Calculation Engine', 'Core payroll processing engine with support for multiple pay frequencies and deduction types', 'tech', ARRAY['payroll', 'calculations', 'engine'], 'next', 0),
    (roadmap_uuid, payroll_obj, payroll_mod, frontend_team, 'Payroll Dashboard', 'Administrative dashboard for HR to review, approve, and process payroll runs', 'business', ARRAY['dashboard', 'payroll', 'admin'], 'next', 1),
    (roadmap_uuid, payroll_obj, payroll_mod, devops_team, 'Tax Calculation Service', 'Integration with tax calculation services for automated tax withholding and reporting', 'tech', ARRAY['tax', 'integration', 'compliance'], 'next', 2),
    
    -- Performance Management - Next
    (roadmap_uuid, talent_mgmt_obj, performance_mod, backend_team, 'Goal Management System', 'CRUD operations for employee goals with progress tracking and alignment features', 'business', ARRAY['goals', 'performance', 'tracking'], 'next', 3),
    (roadmap_uuid, talent_mgmt_obj, performance_mod, frontend_team, 'Performance Review Interface', 'Interactive forms for conducting 360-degree reviews with rating scales and comment sections', 'business', ARRAY['reviews', 'feedback', 'ui'], 'next', 4),
    
    -- Analytics & Reporting - Next
    (roadmap_uuid, analytics_obj, employee_mod, backend_team, 'HR Analytics Data Pipeline', 'ETL pipeline for aggregating HR metrics and generating insights from employee data', 'tech', ARRAY['analytics', 'etl', 'data'], 'next', 5),
    (roadmap_uuid, analytics_obj, employee_mod, frontend_team, 'Executive HR Dashboard', 'Real-time dashboard showing key HR metrics like turnover, hiring rates, and employee satisfaction', 'business', ARRAY['dashboard', 'metrics', 'executive'], 'next', 6),
    
    -- LATER items (Future Releases)
    
    -- Mobile Applications
    (roadmap_uuid, core_hr_obj, employee_mod, mobile_team, 'Employee Mobile App', 'Native mobile app for employees to view profiles, request time off, and access company directory', 'business', ARRAY['mobile', 'employee', 'self-service'], 'later', 0),
    (roadmap_uuid, talent_mgmt_obj, recruitment_mod, mobile_team, 'Manager Mobile Dashboard', 'Mobile interface for managers to approve requests, view team info, and conduct quick reviews', 'business', ARRAY['mobile', 'manager', 'approvals'], 'later', 1),
    
    -- Advanced Features
    (roadmap_uuid, talent_mgmt_obj, learning_mod, backend_team, 'Learning Management System', 'Comprehensive LMS with course creation, progress tracking, and certification management', 'business', ARRAY['lms', 'training', 'certification'], 'later', 2),
    (roadmap_uuid, talent_mgmt_obj, learning_mod, frontend_team, 'Skills Assessment Portal', 'Interactive platform for skill assessments, career path planning, and development recommendations', 'business', ARRAY['skills', 'assessment', 'career'], 'later', 3),
    (roadmap_uuid, analytics_obj, performance_mod, backend_team, 'Predictive Analytics Engine', 'Machine learning models for predicting employee turnover, performance trends, and hiring needs', 'tech', ARRAY['ml', 'predictive', 'analytics'], 'later', 4),
    
    -- Compliance & Security
    (roadmap_uuid, compliance_obj, employee_mod, backend_team, 'GDPR Compliance Module', 'Data privacy controls, consent management, and right-to-be-forgotten functionality', 'tech', ARRAY['gdpr', 'privacy', 'compliance'], 'later', 5),
    (roadmap_uuid, compliance_obj, employee_mod, devops_team, 'Advanced Security Features', 'Multi-factor authentication, role-based access control, and audit logging', 'tech', ARRAY['security', 'audit', 'access'], 'later', 6),
    (roadmap_uuid, compliance_obj, payroll_mod, backend_team, 'Regulatory Reporting', 'Automated generation of government-required HR and payroll reports', 'business', ARRAY['reporting', 'compliance', 'automation'], 'later', 7),
    
    -- Integration & Automation
    (roadmap_uuid, core_hr_obj, employee_mod, backend_team, 'Third-party Integrations', 'Connectors for popular tools like Slack, Microsoft 365, and benefits providers', 'tech', ARRAY['integration', 'api', 'connectors'], 'later', 8),
    (roadmap_uuid, payroll_obj, payroll_mod, backend_team, 'Automated Workflows', 'Workflow engine for automating HR processes like onboarding, offboarding, and approvals', 'business', ARRAY['workflow', 'automation', 'processes'], 'later', 9),
    
    -- Advanced Analytics
    (roadmap_uuid, analytics_obj, performance_mod, frontend_team, 'Advanced Reporting Builder', 'Drag-and-drop report builder for custom HR reports and data visualization', 'business', ARRAY['reporting', 'visualization', 'custom'], 'later', 10),
    (roadmap_uuid, analytics_obj, employee_mod, backend_team, 'Employee Engagement Analytics', 'Sentiment analysis and engagement scoring based on surveys and interaction data', 'mixed', ARRAY['engagement', 'sentiment', 'analytics'], 'later', 11);
    
END $$;

-- Verify the data was inserted correctly
SELECT 
    'Summary of inserted data:' as info,
    (SELECT COUNT(*) FROM objectives WHERE roadmap_id = (SELECT id FROM roadmaps LIMIT 1)) as objectives_count,
    (SELECT COUNT(*) FROM modules WHERE roadmap_id = (SELECT id FROM roadmaps LIMIT 1)) as modules_count,
    (SELECT COUNT(*) FROM teams WHERE roadmap_id = (SELECT id FROM roadmaps LIMIT 1)) as teams_count,
    (SELECT COUNT(*) FROM roadmap_items WHERE roadmap_id = (SELECT id FROM roadmaps LIMIT 1)) as items_count,
    (SELECT COUNT(*) FROM roadmap_items WHERE roadmap_id = (SELECT id FROM roadmaps LIMIT 1) AND status = 'now') as now_items,
    (SELECT COUNT(*) FROM roadmap_items WHERE roadmap_id = (SELECT id FROM roadmaps LIMIT 1) AND status = 'next') as next_items,
    (SELECT COUNT(*) FROM roadmap_items WHERE roadmap_id = (SELECT id FROM roadmaps LIMIT 1) AND status = 'later') as later_items;

-- Display all the created items by status
SELECT 
    ri.title,
    ri.status,
    o.title as objective,
    m.title as module,
    t.title as team,
    ri.category,
    ri.tags
FROM roadmap_items ri
LEFT JOIN objectives o ON ri.objective_id = o.id
LEFT JOIN modules m ON ri.module_id = m.id
LEFT JOIN teams t ON ri.team_id = t.id
WHERE ri.roadmap_id = (SELECT id FROM roadmaps LIMIT 1)
ORDER BY ri.status, ri.order_index;