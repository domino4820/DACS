-- W3Schools-like educational content for IT Roadmap Application
-- This file contains SQL INSERT statements to populate the database with educational content

-- Categories (Main learning areas from W3Schools)
INSERT INTO "categories" ("name", "color", "description", "created_at", "updated_at") 
VALUES 
  ('HTML and CSS', '#0A7029', 'Web markup and styling fundamentals', NOW(), NOW()),
  ('JavaScript', '#F7DF1E', 'Client-side programming language for web development', NOW(), NOW()),
  ('Backend', '#3776AB', 'Server-side programming and database management', NOW(), NOW()),
  ('Data Analytics', '#FF6F00', 'Data processing, analysis and visualization', NOW(), NOW()),
  ('Web Building', '#4CAF50', 'Comprehensive web development and deployment', NOW(), NOW());

-- Skills (Programming languages and technologies)
INSERT INTO "skills" ("name", "type", "description", "created_at", "updated_at")
VALUES
  -- HTML and CSS category
  ('HTML', 'markup', 'The standard markup language for Web pages', NOW(), NOW()),
  ('CSS', 'styling', 'The language for styling web pages', NOW(), NOW()),
  ('RWD', 'styling', 'Responsive Web Design principles and techniques', NOW(), NOW()),
  ('Bootstrap', 'framework', 'Popular CSS framework for responsive websites', NOW(), NOW()),
  ('W3.CSS', 'framework', 'Modern CSS framework with built-in responsiveness', NOW(), NOW()),
  ('Sass', 'preprocessor', 'CSS preprocessor that adds power and elegance to CSS', NOW(), NOW()),
  ('Colors', 'styling', 'Color theory, selection, and implementation in web design', NOW(), NOW()),
  ('Icons', 'styling', 'Implementation and usage of icons in web development', NOW(), NOW()),
  ('SVG', 'graphics', 'Scalable Vector Graphics for the web', NOW(), NOW()),
  ('Canvas', 'graphics', 'HTML5 canvas for drawing graphics on a web page', NOW(), NOW()),
  ('Graphics', 'media', 'Web graphics implementation and optimization', NOW(), NOW()),
  
  -- JavaScript category
  ('JavaScript', 'programming', 'The programming language of the Web', NOW(), NOW()),
  ('React', 'framework', 'A JavaScript library for building user interfaces', NOW(), NOW()),
  ('jQuery', 'library', 'A JavaScript library that simplifies HTML DOM manipulation', NOW(), NOW()),
  ('Vue', 'framework', 'Progressive JavaScript Framework for building UIs', NOW(), NOW()),
  ('AngularJS', 'framework', 'JavaScript-based web framework for dynamic web apps', NOW(), NOW()),
  ('JSON', 'data', 'JavaScript Object Notation for data interchange', NOW(), NOW()),
  ('AJAX', 'technique', 'Asynchronous JavaScript and XML for dynamic content', NOW(), NOW()),
  ('W3.JS', 'library', 'JavaScript library for web development', NOW(), NOW()),
  
  -- Backend category
  ('Python', 'programming', 'A popular programming language for backend development', NOW(), NOW()),
  ('SQL', 'database', 'Structured Query Language for database management', NOW(), NOW()),
  ('MySQL', 'database', 'An open-source relational database management system', NOW(), NOW()),
  ('PHP', 'programming', 'A popular server scripting language', NOW(), NOW()),
  ('Java', 'programming', 'A class-based, object-oriented programming language', NOW(), NOW()),
  ('C', 'programming', 'A general-purpose programming language', NOW(), NOW()),
  ('C++', 'programming', 'An extension of the C programming language with OOP', NOW(), NOW()),
  ('C#', 'programming', 'A versatile programming language from Microsoft', NOW(), NOW()),
  ('R', 'programming', 'Programming language for statistical computing', NOW(), NOW()),
  ('Kotlin', 'programming', 'A modern programming language for Android and more', NOW(), NOW()),
  ('Rust', 'programming', 'A language focused on performance and memory safety', NOW(), NOW()),
  ('Go', 'programming', 'A statically typed language by Google', NOW(), NOW()),
  ('Django', 'framework', 'A Python web framework', NOW(), NOW()),
  ('PostgreSQL', 'database', 'An advanced open source relational database', NOW(), NOW()),
  ('TypeScript', 'programming', 'JavaScript with syntax for types', NOW(), NOW()),
  ('ASP', 'framework', 'Microsoft technology for dynamic web applications', NOW(), NOW()),
  ('Node.js', 'runtime', 'JavaScript runtime for server-side programming', NOW(), NOW()),
  ('Git', 'version-control', 'Distributed version control system', NOW(), NOW()),
  ('Bash', 'scripting', 'Unix shell and command language', NOW(), NOW()),
  ('MongoDB', 'database', 'NoSQL document database', NOW(), NOW()),
  ('XML', 'markup', 'Extensible Markup Language for storing and transporting data', NOW(), NOW()),

  -- Data Analytics category
  ('DSA', 'algorithm', 'Data Structures and Algorithms', NOW(), NOW()),
  ('AI', 'machine-learning', 'Artificial Intelligence concepts and applications', NOW(), NOW()),
  ('Machine Learning', 'machine-learning', 'Systems that can learn from data', NOW(), NOW()),
  ('Data Science', 'analysis', 'Scientific methods to extract insights from data', NOW(), NOW()),
  ('NumPy', 'library', 'Python library for numerical computing', NOW(), NOW()),
  ('Pandas', 'library', 'Python data analysis library', NOW(), NOW()),
  ('SciPy', 'library', 'Python library for scientific computing', NOW(), NOW()),
  ('Matplotlib', 'library', 'Python plotting library', NOW(), NOW()),
  ('Statistics', 'analysis', 'Collection and analysis of numerical data', NOW(), NOW()),
  ('Excel', 'software', 'Spreadsheet program for data analysis', NOW(), NOW()),
  ('Generative AI', 'machine-learning', 'AI systems that can generate new content', NOW(), NOW());

-- Tags (keywords for content categorization)
INSERT INTO "tags" ("name", "color", "created_at", "updated_at")
VALUES
  -- General tags
  ('Beginner', '#4CAF50', NOW(), NOW()),
  ('Intermediate', '#2196F3', NOW(), NOW()),
  ('Advanced', '#F44336', NOW(), NOW()),
  ('Tutorial', '#9C27B0', NOW(), NOW()),
  ('Reference', '#FF9800', NOW(), NOW()),
  ('Certificate', '#607D8B', NOW(), NOW()),
  ('Exercise', '#795548', NOW(), NOW()),
  ('Quiz', '#009688', NOW(), NOW()),
  ('Project', '#673AB7', NOW(), NOW()),
  ('Course', '#FFEB3B', NOW(), NOW()),
  ('Example', '#03A9F4', NOW(), NOW()),
  
  -- Domain-specific tags
  ('Web Development', '#E91E63', NOW(), NOW()),
  ('Frontend', '#3F51B5', NOW(), NOW()),
  ('Backend', '#00BCD4', NOW(), NOW()),
  ('Mobile', '#FFC107', NOW(), NOW()),
  ('Database', '#8BC34A', NOW(), NOW()),
  ('Cloud', '#9E9E9E', NOW(), NOW()),
  ('Security', '#FF5722', NOW(), NOW()),
  ('API', '#CDDC39', NOW(), NOW()),
  ('UI/UX', '#4DB6AC', NOW(), NOW()),
  ('Testing', '#7E57C2', NOW(), NOW()),
  ('DevOps', '#26A69A', NOW(), NOW()),
  ('Game Development', '#AB47BC', NOW(), NOW()),
  
  -- Technology-specific tags
  ('HTML5', '#E34F26', NOW(), NOW()),
  ('CSS3', '#1572B6', NOW(), NOW()),
  ('ES6', '#F7DF1E', NOW(), NOW()),
  ('ReactJS', '#61DAFB', NOW(), NOW()),
  ('Angular', '#DD0031', NOW(), NOW()),
  ('Vue.js', '#4FC08D', NOW(), NOW()),
  ('Node.js', '#339933', NOW(), NOW()),
  ('Python3', '#3776AB', NOW(), NOW()),
  ('Django', '#092E20', NOW(), NOW()),
  ('Flask', '#000000', NOW(), NOW()),
  ('SQL Database', '#336791', NOW(), NOW()),
  ('NoSQL Database', '#4DB33D', NOW(), NOW()),
  ('REST API', '#FF6C37', NOW(), NOW()),
  ('GraphQL', '#E10098', NOW(), NOW()),
  ('Docker', '#2496ED', NOW(), NOW()),
  ('Kubernetes', '#326CE5', NOW(), NOW()),
  ('AWS', '#FF9900', NOW(), NOW()),
  ('Azure', '#0089D6', NOW(), NOW()),
  ('GCP', '#4285F4', NOW(), NOW()),
  ('Machine Learning', '#FF6F00', NOW(), NOW()),
  ('Data Science', '#F37626', NOW(), NOW()),
  ('Big Data', '#E86333', NOW(), NOW()),
  ('Blockchain', '#F7931A', NOW(), NOW()),
  ('Cybersecurity', '#FF5252', NOW(), NOW()),
  ('Artificial Intelligence', '#00B4D8', NOW(), NOW()),
  ('IoT', '#007C89', NOW(), NOW());

-- Example of linking tags to roadmaps (you'll need to adjust IDs based on your data)
-- INSERT INTO "roadmap_tags" ("roadmap_id", "tag_id")
-- VALUES
--   (1, 1),  -- Assuming roadmap_id 1 and tag_id for 'Beginner' is 1
--   (1, 12); -- Linking the same roadmap with 'Web Development' tag 