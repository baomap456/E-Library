-- =====================================================
-- E-Library Database - Sample Data Auto-Load Script
-- 30 Categories, 30 Books, Authors, Locations, and Book Items
-- This script runs automatically on application startup
-- =====================================================

-- Insert 30 Authors (IGNORE duplicates on restart)
INSERT IGNORE INTO authors (id, name) VALUES
(1, 'Martin Fowler'),
(2, 'Robert C. Martin'),
(3, 'Erich Gamma'),
(4, 'Andrew Hunt'),
(5, 'David Thomas'),
(6, 'Kent Beck'),
(7, 'Eric Evans'),
(8, 'Martin Kleppmann'),
(9, 'Thomas H. Cormen'),
(10, 'Brian W. Kernighan'),
(11, 'Dennis M. Ritchie'),
(12, 'Herbert Schildt'),
(13, 'Joshua Bloch'),
(14, 'Bjarne Stroustrup'),
(15, 'Kyle Simpson'),
(16, 'Douglas Crockford'),
(17, 'Addy Osmani'),
(18, 'Sebastian Raschka'),
(19, 'Aurélien Géron'),
(20, 'Ian Goodfellow'),
(21, 'François Chollet'),
(22, 'George Orwell'),
(23, 'J.K. Rowling'),
(24, 'Jane Austen'),
(25, 'Paulo Coelho'),
(26, 'Murakami Haruki'),
(27, 'Yuval Noah Harari'),
(28, 'Stephen Hawking'),
(29, 'Richard Stallman'),
(30, 'Linus Torvalds');

-- Insert 30 Categories
INSERT IGNORE INTO categories (id, name) VALUES
(1, 'Software Engineering'),
(2, 'Software Architecture'),
(3, 'Data Structures & Algorithms'),
(4, 'Artificial Intelligence'),
(5, 'Machine Learning'),
(6, 'Web Development'),
(7, 'Mobile Development'),
(8, 'Cloud Computing'),
(9, 'Cybersecurity'),
(10, 'DevOps'),
(11, 'Database Design'),
(12, 'Operating Systems'),
(13, 'Computer Networks'),
(14, 'Programming Paradigms'),
(15, 'Programming Languages'),
(16, 'Project Management'),
(17, 'Business Analysis'),
(18, 'Literature & Fiction'),
(19, 'Science Fiction'),
(20, 'Historical Fiction'),
(21, 'Economics & Business'),
(22, 'Psychology & Self-Help'),
(23, 'Mathematics'),
(24, 'Physics & Science'),
(25, 'Philosophy'),
(26, 'Education & Learning'),
(27, 'Design Thinking'),
(28, 'Digital Transformation'),
(29, 'Open Source'),
(30, 'Software Testing');

-- Insert 30 Locations
INSERT IGNORE INTO locations (id, room_name, shelf_number) VALUES
(1, 'Khu A', 'A1-01'),
(2, 'Khu A', 'A1-02'),
(3, 'Khu A', 'A1-03'),
(4, 'Khu A', 'A2-01'),
(5, 'Khu A', 'A2-02'),
(6, 'Khu B', 'B1-01'),
(7, 'Khu B', 'B1-02'),
(8, 'Khu B', 'B1-03'),
(9, 'Khu B', 'B2-01'),
(10, 'Khu B', 'B2-02'),
(11, 'Khu C', 'C1-01'),
(12, 'Khu C', 'C1-02'),
(13, 'Khu C', 'C1-03'),
(14, 'Khu C', 'C2-01'),
(15, 'Khu C', 'C2-02'),
(16, 'Khu D', 'D1-01'),
(17, 'Khu D', 'D1-02'),
(18, 'Khu D', 'D1-03'),
(19, 'Khu D', 'D2-01'),
(20, 'Khu D', 'D2-02'),
(21, 'Khu E', 'E1-01'),
(22, 'Khu E', 'E1-02'),
(23, 'Khu E', 'E1-03'),
(24, 'Khu E', 'E2-01'),
(25, 'Khu E', 'E2-02'),
(26, 'Kho số', 'DIGI-01'),
(27, 'Kho số', 'DIGI-02'),
(28, 'Kho số', 'DIGI-03'),
(29, 'Kho lưu trữ', 'ARC-01'),
(30, 'Kho lưu trữ', 'ARC-02');

-- Insert 30 Books
INSERT IGNORE INTO books (id, title, isbn, description, publisher, publish_year, cover_image_url, is_digital, can_take_home, discarded, category_id) VALUES
(1, 'Refactoring', '9780134757599', 'Improving the design of existing code through systematic refactoring techniques', 'Addison-Wesley', 2018, 'https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg', FALSE, TRUE, FALSE, 1),
(2, 'Clean Code', '9780132350884', 'A handbook of agile software craftsmanship and writing code that is maintainable and clean', 'Prentice Hall', 2008, 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg', FALSE, TRUE, FALSE, 2),
(3, 'Introduction to Algorithms', '9780262033848', 'Comprehensive guide to algorithms with detailed explanations and problem solutions', 'MIT Press', 2009, 'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg', FALSE, TRUE, FALSE, 3),
(4, 'Artificial Intelligence: A Modern Approach', '9780134610993', 'Comprehensive introduction to AI concepts and modern approaches in machine learning', 'Prentice Hall', 2020, 'https://covers.openlibrary.org/b/isbn/9780134610993-L.jpg', FALSE, TRUE, FALSE, 4),
(5, 'Python Machine Learning', '9781789955750', 'Machine learning and deep learning with Python using scikit-learn and TensorFlow', 'Packt', 2019, 'https://covers.openlibrary.org/b/isbn/9781789955750-L.jpg', FALSE, TRUE, FALSE, 5),
(6, 'Web Development with React', '9781491954622', 'Building modern web applications with React and JavaScript frameworks', 'O\'Reilly Media', 2017, 'https://covers.openlibrary.org/b/isbn/9781491954622-L.jpg', FALSE, TRUE, FALSE, 6),
(7, 'Swift Programming', '9781491952993', 'The official guide to Swift programming language for iOS and macOS development', 'O\'Reilly Media', 2016, 'https://covers.openlibrary.org/b/isbn/9781491952993-L.jpg', FALSE, TRUE, FALSE, 7),
(8, 'Designing AWS Cloud Solutions', '9781491993959', 'Building scalable and reliable applications on Amazon Web Services', 'O\'Reilly Media', 2018, 'https://covers.openlibrary.org/b/isbn/9781491993959-L.jpg', FALSE, TRUE, FALSE, 8),
(9, 'The Web Application Hacker\'s Handbook', '9781118026472', 'Discovering and exploiting security flaws in web applications', 'Wiley', 2011, 'https://covers.openlibrary.org/b/isbn/9781118026472-L.jpg', FALSE, TRUE, FALSE, 9),
(10, 'The Docker Book', '9781491915660', 'Containerization with Docker for reliable and scalable applications', 'Springer', 2014, 'https://covers.openlibrary.org/b/isbn/9781491915660-L.jpg', FALSE, TRUE, FALSE, 10),
(11, 'Database Design Manual', '9780262537742', 'Advanced techniques for designing databases that are normalized and efficient', 'MIT Press', 2005, 'https://covers.openlibrary.org/b/isbn/9780262537742-L.jpg', FALSE, TRUE, FALSE, 11),
(12, 'Operating System Concepts', '9781119456339', 'Understanding kernel design, process management, and memory management in modern OSes', 'Wiley', 2018, 'https://covers.openlibrary.org/b/isbn/9781119456339-L.jpg', FALSE, TRUE, FALSE, 12),
(13, 'Computer Networking: A Top-Down Approach', '9780133594140', 'Learning networks from application layer down to physical layer', 'Pearson', 2017, 'https://covers.openlibrary.org/b/isbn/9780133594140-L.jpg', FALSE, TRUE, FALSE, 13),
(14, 'What Every Programmer Should Know About Memory', '9781555582197', 'Understanding memory hierarchies and optimization for programming performance', 'ACM', 2007, 'https://covers.openlibrary.org/b/isbn/9781555582197-L.jpg', FALSE, TRUE, FALSE, 14),
(15, 'Concepts of Programming Languages', '9780134997262', 'Comparative analysis of programming paradigms and language design principles', 'Pearson', 2019, 'https://covers.openlibrary.org/b/isbn/9780134997262-L.jpg', FALSE, TRUE, FALSE, 15),
(16, 'The Mythical Man-Month', '9780201835953', 'Essays on software engineering, project management, and team dynamics in software development', 'Addison-Wesley', 1995, 'https://covers.openlibrary.org/b/isbn/9780201835953-L.jpg', FALSE, TRUE, FALSE, 16),
(17, 'Business Analysis for Business Analysts', '9781617292217', 'Techniques and best practices for gathering requirements and analyzing business needs', 'Manning', 2013, 'https://covers.openlibrary.org/b/isbn/9781617292217-L.jpg', FALSE, TRUE, FALSE, 17),
(18, '1984', '9780451524935', 'A dystopian novel exploring totalitarianism and government surveillance', 'Penguin Books', 2008, 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg', FALSE, TRUE, FALSE, 18),
(19, 'Dune', '9780441172719', 'Epic science fiction story set in a distant future with political intrigue and mystical powers', 'Ace Books', 2005, 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg', FALSE, TRUE, FALSE, 19),
(20, 'Pride and Prejudice', '9780141439518', 'Classic romance novel exploring social conventions and personal growth', 'Penguin Classics', 2003, 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg', FALSE, TRUE, FALSE, 20),
(21, 'Freakonomics', '9780060731328', 'Economic analysis of hidden side of everything from sumo wrestling to drug dealing', 'William Morrow', 2005, 'https://covers.openlibrary.org/b/isbn/9780060731328-L.jpg', FALSE, TRUE, FALSE, 21),
(22, 'Thinking, Fast and Slow', '9780374533557', 'Insights into the two systems of human thought and decision-making', 'Farrar, Straus and Giroux', 2011, 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg', FALSE, TRUE, FALSE, 22),
(23, 'A Brief History of Time', '9780553380163', 'Exploration of space, time, black holes, and the nature of the universe', 'Bantam', 1988, 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg', FALSE, TRUE, FALSE, 23),
(24, 'Quantum Mechanics: The Theoretical Minimum', '9780393340773', 'Understanding fundamental principles of quantum mechanics for the modern physicist', 'Basic Books', 2014, 'https://covers.openlibrary.org/b/isbn/9780393340773-L.jpg', FALSE, TRUE, FALSE, 24),
(25, 'Meditations', '9780140449334', 'Philosophical reflections from a Roman emperor on virtue and the good life', 'Penguin Classics', 2006, 'https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg', FALSE, TRUE, FALSE, 25),
(26, 'Learning How to Learn', '9780399165474', 'Powerful mental tools to master tough subjects and develop learning skills', 'Tarcher', 2014, 'https://covers.openlibrary.org/b/isbn/9780399165474-L.jpg', FALSE, TRUE, FALSE, 26),
(27, 'Design of Everyday Things', '9780465050659', 'Understanding how people interact with objects and principles of good design', 'Basic Books', 2013, 'https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg', FALSE, TRUE, FALSE, 27),
(28, 'Digital Transformation Handbook', '9781491983119', 'Strategies for digital transformation and modernizing legacy business processes', 'O\'Reilly Media', 2019, 'https://covers.openlibrary.org/b/isbn/9781491983119-L.jpg', FALSE, TRUE, FALSE, 28),
(29, 'The Cathedral and the Bazaar', '9780596001087', 'Insights into open source software development and collaborative community models', 'O\'Reilly Media', 1999, 'https://covers.openlibrary.org/b/isbn/9780596001087-L.jpg', FALSE, TRUE, FALSE, 29),
(30, 'The Art of Software Testing', '9780471469123', 'Comprehensive techniques for testing software and ensuring quality', 'Wiley', 2004, 'https://covers.openlibrary.org/b/isbn/9780471469123-L.jpg', FALSE, TRUE, FALSE, 30);

-- Insert Book-Author Relationships
INSERT IGNORE INTO book_authors (book_id, author_id) VALUES
(1, 1), (2, 2), (3, 9), (4, 20), (5, 18), (6, 17), (7, 14), (8, 19), (9, 16), (10, 30),
(11, 9), (12, 14), (13, 11), (14, 4), (15, 3), (16, 2), (17, 5), (18, 22), (19, 19), (20, 24),
(21, 27), (22, 15), (23, 28), (24, 28), (25, 6), (26, 12), (27, 17), (28, 29), (29, 30), (30, 13);

-- Insert Book Items - 5 items per book (30 books × 5 items = 150 total items)
INSERT IGNORE INTO book_items (id, barcode, status, book_id, location_id) VALUES
-- Book 1 - 5 items
(1, 'BK001-001', 'AVAILABLE', 1, 1), (2, 'BK001-002', 'BORROWING', 1, 2), (3, 'BK001-003', 'AVAILABLE', 1, 3), (4, 'BK001-004', 'RESERVED', 1, 4), (5, 'BK001-005', 'DAMAGED', 1, 5),
-- Book 2 - 5 items
(6, 'BK002-001', 'AVAILABLE', 2, 6), (7, 'BK002-002', 'RESERVED', 2, 7), (8, 'BK002-003', 'AVAILABLE', 2, 8), (9, 'BK002-004', 'BORROWING', 2, 9), (10, 'BK002-005', 'AVAILABLE', 2, 10),
-- Book 3 - 5 items
(11, 'BK003-001', 'AVAILABLE', 3, 11), (12, 'BK003-002', 'BORROWING', 3, 12), (13, 'BK003-003', 'DAMAGED', 3, 13), (14, 'BK003-004', 'AVAILABLE', 3, 14), (15, 'BK003-005', 'OVERDUE', 3, 15),
-- Book 4 - 5 items
(16, 'BK004-001', 'AVAILABLE', 4, 16), (17, 'BK004-002', 'AVAILABLE', 4, 17), (18, 'BK004-003', 'OVERDUE', 4, 18), (19, 'BK004-004', 'BORROWING', 4, 19), (20, 'BK004-005', 'AVAILABLE', 4, 20),
-- Book 5 - 5 items
(21, 'BK005-001', 'RESERVED', 5, 21), (22, 'BK005-002', 'AVAILABLE', 5, 22), (23, 'BK005-003', 'BORROWING', 5, 23), (24, 'BK005-004', 'AVAILABLE', 5, 24), (25, 'BK005-005', 'AVAILABLE', 5, 25),
-- Book 6 - 5 items
(26, 'BK006-001', 'AVAILABLE', 6, 26), (27, 'BK006-002', 'AVAILABLE', 6, 27), (28, 'BK006-003', 'LOST', 6, 28), (29, 'BK006-004', 'AVAILABLE', 6, 29), (30, 'BK006-005', 'AVAILABLE', 6, 30),
-- Book 7 - 5 items
(31, 'BK007-001', 'AVAILABLE', 7, 1), (32, 'BK007-002', 'BORROWING', 7, 2), (33, 'BK007-003', 'AVAILABLE', 7, 3), (34, 'BK007-004', 'RESERVED', 7, 4), (35, 'BK007-005', 'AVAILABLE', 7, 5),
-- Book 8 - 5 items
(36, 'BK008-001', 'AVAILABLE', 8, 6), (37, 'BK008-002', 'AVAILABLE', 8, 7), (38, 'BK008-003', 'BORROWING', 8, 8), (39, 'BK008-004', 'AVAILABLE', 8, 9), (40, 'BK008-005', 'AVAILABLE', 8, 10),
-- Book 9 - 5 items
(41, 'BK009-001', 'BORROWING', 9, 11), (42, 'BK009-002', 'AVAILABLE', 9, 12), (43, 'BK009-003', 'AVAILABLE', 9, 13), (44, 'BK009-004', 'RESERVED', 9, 14), (45, 'BK009-005', 'AVAILABLE', 9, 15),
-- Book 10 - 5 items
(46, 'BK010-001', 'AVAILABLE', 10, 16), (47, 'BK010-002', 'RESERVED', 10, 17), (48, 'BK010-003', 'AVAILABLE', 10, 18), (49, 'BK010-004', 'BORROWING', 10, 19), (50, 'BK010-005', 'AVAILABLE', 10, 20),
-- Book 11 - 5 items
(51, 'BK011-001', 'AVAILABLE', 11, 21), (52, 'BK011-002', 'BORROWING', 11, 22), (53, 'BK011-003', 'AVAILABLE', 11, 23), (54, 'BK011-004', 'AVAILABLE', 11, 24), (55, 'BK011-005', 'AVAILABLE', 11, 25),
-- Book 12 - 5 items
(56, 'BK012-001', 'AVAILABLE', 12, 26), (57, 'BK012-002', 'DAMAGED', 12, 27), (58, 'BK012-003', 'AVAILABLE', 12, 28), (59, 'BK012-004', 'BORROWING', 12, 29), (60, 'BK012-005', 'AVAILABLE', 12, 30),
-- Book 13 - 5 items
(61, 'BK013-001', 'AVAILABLE', 13, 1), (62, 'BK013-002', 'AVAILABLE', 13, 2), (63, 'BK013-003', 'BORROWING', 13, 3), (64, 'BK013-004', 'AVAILABLE', 13, 4), (65, 'BK013-005', 'RESERVED', 13, 5),
-- Book 14 - 5 items
(66, 'BK014-001', 'BORROWING', 14, 6), (67, 'BK014-002', 'AVAILABLE', 14, 7), (68, 'BK014-003', 'AVAILABLE', 14, 8), (69, 'BK014-004', 'AVAILABLE', 14, 9), (70, 'BK014-005', 'AVAILABLE', 14, 10),
-- Book 15 - 5 items
(71, 'BK015-001', 'AVAILABLE', 15, 11), (72, 'BK015-002', 'RESERVED', 15, 12), (73, 'BK015-003', 'AVAILABLE', 15, 13), (74, 'BK015-004', 'BORROWING', 15, 14), (75, 'BK015-005', 'AVAILABLE', 15, 15),
-- Book 16 - 5 items
(76, 'BK016-001', 'AVAILABLE', 16, 16), (77, 'BK016-002', 'BORROWING', 16, 17), (78, 'BK016-003', 'AVAILABLE', 16, 18), (79, 'BK016-004', 'AVAILABLE', 16, 19), (80, 'BK016-005', 'AVAILABLE', 16, 20),
-- Book 17 - 5 items
(81, 'BK017-001', 'AVAILABLE', 17, 21), (82, 'BK017-002', 'AVAILABLE', 17, 22), (83, 'BK017-003', 'BORROWING', 17, 23), (84, 'BK017-004', 'AVAILABLE', 17, 24), (85, 'BK017-005', 'AVAILABLE', 17, 25),
-- Book 18 - 5 items
(86, 'BK018-001', 'AVAILABLE', 18, 26), (87, 'BK018-002', 'BORROWING', 18, 27), (88, 'BK018-003', 'AVAILABLE', 18, 28), (89, 'BK018-004', 'RESERVED', 18, 29), (90, 'BK018-005', 'AVAILABLE', 18, 30),
-- Book 19 - 5 items
(91, 'BK019-001', 'AVAILABLE', 19, 1), (92, 'BK019-002', 'AVAILABLE', 19, 2), (93, 'BK019-003', 'RESERVED', 19, 3), (94, 'BK019-004', 'BORROWING', 19, 4), (95, 'BK019-005', 'AVAILABLE', 19, 5),
-- Book 20 - 5 items
(96, 'BK020-001', 'AVAILABLE', 20, 6), (97, 'BK020-002', 'BORROWING', 20, 7), (98, 'BK020-003', 'AVAILABLE', 20, 8), (99, 'BK020-004', 'AVAILABLE', 20, 9), (100, 'BK020-005', 'AVAILABLE', 20, 10),
-- Book 21 - 5 items
(101, 'BK021-001', 'AVAILABLE', 21, 11), (102, 'BK021-002', 'AVAILABLE', 21, 12), (103, 'BK021-003', 'OVERDUE', 21, 13), (104, 'BK021-004', 'BORROWING', 21, 14), (105, 'BK021-005', 'AVAILABLE', 21, 15),
-- Book 22 - 5 items
(106, 'BK022-001', 'RESERVED', 22, 16), (107, 'BK022-002', 'AVAILABLE', 22, 17), (108, 'BK022-003', 'BORROWING', 22, 18), (109, 'BK022-004', 'AVAILABLE', 22, 19), (110, 'BK022-005', 'AVAILABLE', 22, 20),
-- Book 23 - 5 items
(111, 'BK023-001', 'AVAILABLE', 23, 21), (112, 'BK023-002', 'AVAILABLE', 23, 22), (113, 'BK023-003', 'BORROWING', 23, 23), (114, 'BK023-004', 'AVAILABLE', 23, 24), (115, 'BK023-005', 'AVAILABLE', 23, 25),
-- Book 24 - 5 items
(116, 'BK024-001', 'BORROWING', 24, 26), (117, 'BK024-002', 'AVAILABLE', 24, 27), (118, 'BK024-003', 'AVAILABLE', 24, 28), (119, 'BK024-004', 'RESERVED', 24, 29), (120, 'BK024-005', 'AVAILABLE', 24, 30),
-- Book 25 - 5 items
(121, 'BK025-001', 'AVAILABLE', 25, 1), (122, 'BK025-002', 'AVAILABLE', 25, 2), (123, 'BK025-003', 'BORROWING', 25, 3), (124, 'BK025-004', 'AVAILABLE', 25, 4), (125, 'BK025-005', 'AVAILABLE', 25, 5),
-- Book 26 - 5 items
(126, 'BK026-001', 'AVAILABLE', 26, 6), (127, 'BK026-002', 'RESERVED', 26, 7), (128, 'BK026-003', 'AVAILABLE', 26, 8), (129, 'BK026-004', 'BORROWING', 26, 9), (130, 'BK026-005', 'AVAILABLE', 26, 10),
-- Book 27 - 5 items
(131, 'BK027-001', 'BORROWING', 27, 11), (132, 'BK027-002', 'AVAILABLE', 27, 12), (133, 'BK027-003', 'AVAILABLE', 27, 13), (134, 'BK027-004', 'AVAILABLE', 27, 14), (135, 'BK027-005', 'AVAILABLE', 27, 15),
-- Book 28 - 5 items
(136, 'BK028-001', 'AVAILABLE', 28, 16), (137, 'BK028-002', 'AVAILABLE', 28, 17), (138, 'BK028-003', 'BORROWING', 28, 18), (139, 'BK028-004', 'AVAILABLE', 28, 19), (140, 'BK028-005', 'AVAILABLE', 28, 20),
-- Book 29 - 5 items
(141, 'BK029-001', 'AVAILABLE', 29, 21), (142, 'BK029-002', 'BORROWING', 29, 22), (143, 'BK029-003', 'AVAILABLE', 29, 23), (144, 'BK029-004', 'RESERVED', 29, 24), (145, 'BK029-005', 'AVAILABLE', 29, 25),
-- Book 30 - 5 items
(146, 'BK030-001', 'AVAILABLE', 30, 26), (147, 'BK030-002', 'AVAILABLE', 30, 27), (148, 'BK030-003', 'DAMAGED', 30, 28), (149, 'BK030-004', 'BORROWING', 30, 29), (150, 'BK030-005', 'AVAILABLE', 30, 30);

-- Insert Roles for authentication/authorization
INSERT IGNORE INTO roles (name) VALUES
('ADMIN'),
('LIBRARIAN'),
('MEMBER'),
('GUEST');

-- Data healing for previously loaded legacy values
-- 1) Invalid legacy status in historical data
UPDATE book_items
SET status = 'BORROWING'
WHERE status = 'BORROWED';

-- 1b) Corrupted empty status values in historical data
UPDATE book_items
SET status = 'BORROWING'
WHERE status IS NULL OR status = '';

-- 2) Legacy ROLE_* names -> canonical names and preserve existing user-role links
UPDATE user_roles ur
JOIN roles oldr ON ur.role_id = oldr.id
JOIN roles newr ON newr.name = REPLACE(oldr.name, 'ROLE_', '')
SET ur.role_id = newr.id
WHERE oldr.name IN ('ROLE_ADMIN', 'ROLE_LIBRARIAN', 'ROLE_MEMBER', 'ROLE_GUEST');

DELETE FROM roles
WHERE name IN ('ROLE_ADMIN', 'ROLE_LIBRARIAN', 'ROLE_MEMBER', 'ROLE_GUEST');

-- Insert Membership Packages (Free + Premium)
INSERT IGNORE INTO membership_types (id, name, paid, max_books, borrow_duration_days, fine_rate_per_day, privilege_note) VALUES
(1, 'Free', FALSE, 3, 14, 5000, 'Goi mien phi phu hop nhu cau co ban'),
(2, 'Premium', TRUE, 10, 30, 2000, 'Goi tra phi voi han muc cao va uu tien dat cho');

-- Insert 4 user accounts (one account per role)
-- Passwords:
-- admin01 / Admin@123
-- librarian02 / Librarian@123
-- member02 / Member@123
-- guest01 / Guest@123
INSERT IGNORE INTO users (
	username,
	password,
	email,
	full_name,
	student_id,
	active,
	outstanding_debt,	
	borrowing_locked,
	created_at
) VALUES
('admin01', '$2y$10$n9gcb3vHf/IqGe5.2oOW5O75TumOuYRcgW0rsw8RRwrCXbsuilV76', 'admin01@elib.local', 'System Admin', NULL, TRUE, 0, FALSE, NOW()),
('librarian02', '$2y$10$v83I3Qxfl8ev4p54aoOq9Ofu36ccI4Jn15V4xnUvh7FKuEoBQY11O', 'librarian02@elib.local', 'Librarian Two', NULL, TRUE, 0, FALSE, NOW()),
('member02', '$2y$10$SyZMDSHNiMN5jOBM2xyTqeZ6gzBPUGKuzB.0VmV97XKhfcpKbBJpa', 'member02@elib.local', 'Member Two', 'SV30002', TRUE, 0, FALSE, NOW()),
('guest01', '$2y$10$bdZdkx7/s6VjMLWuhXCgJ.enLnUCfuaZYelPxO/35mUaaSIhnAs9C', 'guest01@elib.local', 'Guest One', NULL, TRUE, 0, FALSE, NOW());

-- Assign default membership package for sample member
UPDATE users u
JOIN membership_types m ON m.name = 'Free'
SET u.membership_type_id = m.id
WHERE u.username = 'member02'
	AND (u.membership_type_id IS NULL OR u.membership_type_id <> m.id);

-- Map each account to a different role
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'ADMIN'
WHERE u.username = 'admin01';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'LIBRARIAN'
WHERE u.username = 'librarian02';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'MEMBER'
WHERE u.username = 'member02';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.name = 'GUEST'
WHERE u.username = 'guest01';

-- =====================================================
-- Data Load Summary:
-- 30 Categories, 30 Authors, 30 Locations
-- 30 Books with ISBN and descriptions
-- 30 Book-Author relationships
-- 150 Book Items (5 items per book) with various statuses
-- 4 User Accounts with 4 different roles
-- This script is safe to run multiple times (INSERT IGNORE with explicit IDs)
-- =====================================================
