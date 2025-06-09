-- W3Schools-like Roadmaps for IT Learning Paths
-- This file contains SQL INSERT statements to create educational roadmaps

-- Web Development Roadmap
INSERT INTO "roadmaps" ("title", "description", "category_id", "skill_id", "user_id", "created_at", "updated_at")
VALUES 
('Frontend Web Developer Path', 'Complete learning path to become a frontend web developer', 1, NULL, 1, NOW(), NOW()),
('Backend Developer Path', 'Complete learning path to become a backend developer', 3, NULL, 1, NOW(), NOW()),
('Full Stack Web Development', 'Master both frontend and backend development', 5, NULL, 1, NOW(), NOW()),
('Python Developer Path', 'Complete learning path to master Python development', 3, 20, 1, NOW(), NOW()),
('Data Science Career Path', 'Learn the essential skills for data science and analysis', 4, NULL, 1, NOW(), NOW()),
('JavaScript Programming', 'Comprehensive guide to master JavaScript programming', 2, 12, 1, NOW(), NOW()),
('Responsive Web Design', 'Learn to create websites that work on all devices', 1, 3, 1, NOW(), NOW()),
('Database Expert Path', 'Master SQL and database management', 3, 21, 1, NOW(), NOW());

-- Example of nodes for the Frontend Web Developer Path (assuming roadmap_id 1)
-- Each node represents a course or learning step
INSERT INTO "nodes" ("nodeIdentifier", "positionX", "positionY", "data", "roadmap_id", "course_id", "created_at", "updated_at")
VALUES
-- HTML Basics
('node-1', 100, 100, '{"label":"HTML Fundamentals","description":"Learn the basics of HTML","type":"course"}', 1, 1, NOW(), NOW()),
-- HTML Elements
('node-2', 100, 200, '{"label":"HTML Elements","description":"Learn about HTML elements and structure","type":"course"}', 1, 2, NOW(), NOW()),
-- CSS Fundamentals
('node-3', 300, 100, '{"label":"CSS Fundamentals","description":"Learn CSS basics for styling web pages","type":"course"}', 1, 3, NOW(), NOW()),
-- CSS Box Model
('node-4', 300, 200, '{"label":"CSS Box Model","description":"Master CSS layout with the box model","type":"course"}', 1, 4, NOW(), NOW()),
-- JavaScript Basics
('node-5', 500, 150, '{"label":"JavaScript Basics","description":"Introduction to JavaScript programming","type":"course"}', 1, 5, NOW(), NOW()),
-- Frontend Project
('node-6', 700, 150, '{"label":"Frontend Project","description":"Build a complete website applying HTML, CSS and JavaScript","type":"project"}', 1, NULL, NOW(), NOW());

-- Example of edges connecting the nodes (assuming roadmap_id 1)
INSERT INTO "edges" ("edgeIdentifier", "source", "target", "sourceHandle", "targetHandle", "type", "animated", "roadmap_id", "created_at", "updated_at")
VALUES
('edge-1', 'node-1', 'node-2', 'bottom', 'top', 'straight', true, 1, NOW(), NOW()),
('edge-2', 'node-2', 'node-3', 'right', 'left', 'straight', true, 1, NOW(), NOW()),
('edge-3', 'node-3', 'node-4', 'bottom', 'top', 'straight', true, 1, NOW(), NOW()),
('edge-4', 'node-4', 'node-5', 'right', 'left', 'straight', true, 1, NOW(), NOW()),
('edge-5', 'node-5', 'node-6', 'right', 'left', 'straight', true, 1, NOW(), NOW());

-- Link roadmaps with relevant tags
INSERT INTO "roadmap_tags" ("roadmap_id", "tag_id")
VALUES
-- Frontend Web Developer Path
(1, 1),  -- Beginner tag
(1, 12), -- Web Development tag
(1, 13), -- Frontend tag
(1, 24), -- HTML5 tag
(1, 25), -- CSS3 tag
-- Backend Developer Path
(2, 2),  -- Intermediate tag
(2, 12), -- Web Development tag
(2, 14), -- Backend tag
(2, 16), -- Database tag
-- Full Stack Development
(3, 3),  -- Advanced tag
(3, 12), -- Web Development tag
(3, 13), -- Frontend tag
(3, 14), -- Backend tag
-- Python Developer Path
(4, 1),  -- Beginner tag
(4, 14), -- Backend tag
(4, 29), -- Python3 tag
-- Data Science Career Path
(5, 2),  -- Intermediate tag
(5, 46), -- Data Science tag
(5, 45), -- Machine Learning tag
-- JavaScript Programming
(6, 1),  -- Beginner tag
(6, 13), -- Frontend tag
(6, 26), -- ES6 tag
-- Responsive Web Design
(7, 1),  -- Beginner tag
(7, 13), -- Frontend tag
(7, 20), -- UI/UX tag
-- Database Expert Path
(8, 2),  -- Intermediate tag
(8, 16), -- Database tag
(8, 32); -- SQL Database tag 