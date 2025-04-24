-- Drop tables if they exist (you already have this in your schema)
-- DROP TABLE IF EXISTS group_members;
-- DROP TABLE IF EXISTS groups;
-- DROP TABLE IF EXISTS events;

-- Seed data for events table
INSERT INTO events (id, name, date_time, group_size_limit, location)
VALUES ('event-2023-12-01', 'Winter Hackathon 2023', '2023-12-01 09:00:00', 5, 'Tech Campus Building A');

-- Seed data for groups table
INSERT INTO groups (event_id, creator_name, creator_email, group_name, accepts_others, project_description) VALUES
('event-2023-12-01', 'Alice Johnson', 'alice.j@example.com', 'Code Wizards', 1, 'Building a real-time collaboration tool'),
('event-2023-12-01', 'Bob Smith', 'bob.smith@example.com', 'Data Miners', 0, 'Developing a predictive analytics dashboard'),
('event-2023-12-01', 'Carlos Rodriguez', 'carlos.r@example.com', 'UI Experts', 1, 'Creating an accessible UI component library'),
('event-2023-12-01', 'Diana Chen', 'diana.c@example.com', 'Cloud Squad', 0, 'Implementing serverless architecture for IoT devices'),
('event-2023-12-01', 'Eva Mueller', 'eva.m@example.com', 'AI Enthusiasts', 1, 'Training a model for sentiment analysis'),
('event-2023-12-01', 'Frank Lee', 'frank.l@example.com', 'Mobile Devs', 0, 'Building a cross-platform fitness app'),
('event-2023-12-01', 'Grace Kim', 'grace.k@example.com', 'Security Team', 1, 'Developing an encryption tool for messaging'),
('event-2023-12-01', 'Hector Gomez', 'hector.g@example.com', 'Game Changers', 0, 'Creating an educational puzzle game'),
('event-2023-12-01', 'Irene Patel', 'irene.p@example.com', 'Database Pros', 1, 'Optimizing query performance for large datasets'),
('event-2023-12-01', 'Jack Wilson', 'jack.w@example.com', 'DevOps Crew', 0, 'Setting up CI/CD pipeline for microservices'),
('event-2023-12-01', 'Kelly Brown', 'kelly.b@example.com', 'Web Wizards', 1, 'Developing a progressive web app'),
('event-2023-12-01', 'Leo Chang', 'leo.c@example.com', 'Blockchain Pioneers', 0, 'Building a decentralized voting system'),
('event-2023-12-01', 'Maria Garcia', 'maria.g@example.com', 'UX Researchers', 1, 'Designing user-friendly interfaces for elderly users'),
('event-2023-12-01', 'Noah Williams', 'noah.w@example.com', 'API Crafters', 0, 'Creating a RESTful API for content management'),
('event-2023-12-01', 'Olivia Taylor', 'olivia.t@example.com', 'ML Engineers', 1, 'Implementing image recognition for plant species'),
('event-2023-12-01', 'Paul Martinez', 'paul.m@example.com', 'Backend Ninjas', 0, 'Developing a high-performance caching system'),
('event-2023-12-01', 'Quinn Adams', 'quinn.a@example.com', 'Frontend Experts', 1, 'Building an accessible component library'),
('event-2023-12-01', 'Rachel Singh', 'rachel.s@example.com', 'AR/VR Innovators', 0, 'Creating an augmented reality educational app'),
('event-2023-12-01', 'Sam Thompson', 'sam.t@example.com', 'IoT Builders', 1, 'Developing smart home monitoring system'),
('event-2023-12-01', 'Tina Jackson', 'tina.j@example.com', 'Tech Writers', 0, 'Creating an interactive documentation platform');

-- Seed data for group_members table
INSERT INTO group_members (group_id, name, email) VALUES
-- Group 1: Code Wizards (5 members including creator)
(1, 'Alice Johnson', 'alice.j@example.com'),
(1, 'David Park', 'david.p@example.com'),
(1, 'Sarah Lee', 'sarah.l@example.com'),
(1, 'Michael Chen', 'michael.c@example.com'),
(1, 'Emma Watson', 'emma.w@example.com'),

-- Group 2: Data Miners (3 members including creator)
(2, 'Bob Smith', 'bob.smith@example.com'),
(2, 'Sophia Nguyen', 'sophia.n@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),
(2, 'James Wilson', 'james.w@example.com'),

-- Group 3: UI Experts (4 members including creator)
(3, 'Carlos Rodriguez', 'carlos.r@example.com'),
(3, 'Ava Martinez', 'ava.m@example.com'),
(3, 'Nathan Kim', 'nathan.k@example.com'),
(3, 'Julia Roberts', 'julia.r@example.com'),

-- Group 4: Cloud Squad (2 members including creator)
(4, 'Diana Chen', 'diana.c@example.com'),
(4, 'Ryan Patel', 'ryan.p@example.com'),

-- Group 5: AI Enthusiasts (5 members including creator)
(5, 'Eva Mueller', 'eva.m@example.com'),
(5, 'Tom Jackson', 'tom.j@example.com'),
(5, 'Linda Garcia', 'linda.g@example.com'),
(5, 'Kevin Zhang', 'kevin.z@example.com'),
(5, 'Olivia Brown', 'olivia.b@example.com'),

-- Group 6: Mobile Devs (3 members including creator)
(6, 'Frank Lee', 'frank.l@example.com'),
(6, 'Zoe Taylor', 'zoe.t@example.com'),
(6, 'Alex Johnson', 'alex.j@example.com'),

-- Group 7: Security Team (4 members including creator)
(7, 'Grace Kim', 'grace.k@example.com'),
(7, 'Daniel Williams', 'daniel.w@example.com'),
(7, 'Ella Davis', 'ella.d@example.com'),
(7, 'Isaac Martin', 'isaac.m@example.com'),

-- Group 8: Game Changers (5 members including creator)
(8, 'Hector Gomez', 'hector.g@example.com'),
(8, 'Mia Thompson', 'mia.t@example.com'),
(8, 'Noah Clark', 'noah.c@example.com'),
(8, 'Sophie Anderson', 'sophie.a@example.com'),
(8, 'Lucas Wright', 'lucas.w@example.com'),

-- Group 9: Database Pros (2 members including creator)
(9, 'Irene Patel', 'irene.p@example.com'),
(9, 'Victor Lee', 'victor.l@example.com'),
-- Group 10: DevOps Crew (3 members including creator)
(10, 'Jack Wilson', 'jack.w@example.com'),
(10, 'Beth Moore', 'beth.m@example.com'),
(10, 'Chris Evans', 'chris.e@example.com'),

-- Group 11: Web Wizards (4 members including creator)
(11, 'Kelly Brown', 'kelly.b@example.com'),
(11, 'Peter Grant', 'peter.g@example.com'),
(11, 'Hannah Lopez', 'hannah.l@example.com'),
(11, 'Omar Khan', 'omar.k@example.com'),

-- Group 12: Blockchain Pioneers (1 member - just creator)
(12, 'Leo Chang', 'leo.c@example.com'),

-- Group 13: UX Researchers (3 members including creator)
(13, 'Maria Garcia', 'maria.g@example.com'),
(13, 'Steven Rogers', 'steven.r@example.com'),
(13, 'Rebecca Jones', 'rebecca.j@example.com'),

-- Group 14: API Crafters (5 members including creator)
(14, 'Noah Williams', 'noah.w@example.com'),
(14, 'Fiona White', 'fiona.w@example.com'),
(14, 'Gabriel Torres', 'gabriel.t@example.com'),
(14, 'Denise Miller', 'denise.m@example.com'),
(14, 'Larry Scott', 'larry.s@example.com'),

-- Group 15: ML Engineers (2 members including creator)
(15, 'Olivia Taylor', 'olivia.t@example.com'),
(15, 'Ethan Young', 'ethan.y@example.com'),

-- Group 16: Backend Ninjas (4 members including creator)
(16, 'Paul Martinez', 'paul.m@example.com'),
(16, 'Natalie Reed', 'natalie.r@example.com'),
(16, 'Ian Cooper', 'ian.c@example.com'),
(16, 'Sandra Diaz', 'sandra.d@example.com'),

-- Group 17: Frontend Experts (3 members including creator)
(17, 'Quinn Adams', 'quinn.a@example.com'),
(17, 'Kyle Henderson', 'kyle.h@example.com'),
(17, 'Monica Shah', 'monica.s@example.com'),

-- Group 18: AR/VR Innovators (5 members including creator)
(18, 'Rachel Singh', 'rachel.s@example.com'),
(18, 'Travis Wood', 'travis.w@example.com'),
(18, 'Jasmine Chen', 'jasmine.c@example.com'),
(18, 'Brandon Lee', 'brandon.l@example.com'),
(18, 'Chloe Fisher', 'chloe.f@example.com'),

-- Group 19: IoT Builders (4 members including creator)
(19, 'Sam Thompson', 'sam.t@example.com'),
(19, 'Vanessa Park', 'vanessa.p@example.com'),
(19, 'Derek Wilson', 'derek.w@example.com'),
(19, 'Alicia Ramirez', 'alicia.r@example.com'),

-- Group 20: Tech Writers (2 members including creator)
(20, 'Tina Jackson', 'tina.j@example.com'),
(20, 'Marcus Johnson', 'marcus.j@example.com');
