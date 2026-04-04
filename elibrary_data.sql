-- =====================================================
-- E-Library Database - Sample Data Import Script
-- 30 Categories, 30 Books, Authors, Locations, and Book Items
-- =====================================================

-- Insert 30 Authors
INSERT INTO authors (name) VALUES
('Martin Fowler'),
('Robert C. Martin'),
('Erich Gamma'),
('Andrew Hunt'),
('David Thomas'),
('Kent Beck'),
('Eric Evans'),
('Martin Kleppmann'),
('Thomas H. Cormen'),
('Brian W. Kernighan'),
('Dennis M. Ritchie'),
('Herbert Schildt'),
('Joshua Bloch'),
('Bjarne Stroustrup'),
('Kyle Simpson'),
('Douglas Crockford'),
('Addy Osmani'),
('Sebastian Raschka'),
('Aurélien Géron'),
('Ian Goodfellow'),
('François Chollet'),
('George Orwell'),
('J.K. Rowling'),
('Jane Austen'),
('Paulo Coelho'),
('Murakami Haruki'),
('Yuval Noah Harari'),
('Stephen Hawking'),
('Richard Stallman'),
('Linus Torvalds');

-- Insert 30 Categories
INSERT INTO categories (name) VALUES
('Software Engineering'),
('Software Architecture'),
('Data Structures & Algorithms'),
('Artificial Intelligence'),
('Machine Learning'),
('Web Development'),
('Mobile Development'),
('Cloud Computing'),
('Cybersecurity'),
('DevOps'),
('Database Design'),
('Operating Systems'),
('Computer Networks'),
('Programming Paradigms'),
('Programming Languages'),
('Project Management'),
('Business Analysis'),
('Literature & Fiction'),
('Science Fiction'),
('Historical Fiction'),
('Economics & Business'),
('Psychology & Self-Help'),
('Mathematics'),
('Physics & Science'),
('Philosophy'),
('Education & Learning'),
('Design Thinking'),
('Digital Transformation'),
('Open Source'),
('Software Testing');

-- Insert 30 Locations
INSERT INTO locations (roomName, shelfNumber) VALUES
('Khu A', 'A1-01'),
('Khu A', 'A1-02'),
('Khu A', 'A1-03'),
('Khu A', 'A2-01'),
('Khu A', 'A2-02'),
('Khu B', 'B1-01'),
('Khu B', 'B1-02'),
('Khu B', 'B1-03'),
('Khu B', 'B2-01'),
('Khu B', 'B2-02'),
('Khu C', 'C1-01'),
('Khu C', 'C1-02'),
('Khu C', 'C1-03'),
('Khu C', 'C2-01'),
('Khu C', 'C2-02'),
('Khu D', 'D1-01'),
('Khu D', 'D1-02'),
('Khu D', 'D1-03'),
('Khu D', 'D2-01'),
('Khu D', 'D2-02'),
('Khu E', 'E1-01'),
('Khu E', 'E1-02'),
('Khu E', 'E1-03'),
('Khu E', 'E2-01'),
('Khu E', 'E2-02'),
('Kho số', 'DIGI-01'),
('Kho số', 'DIGI-02'),
('Kho số', 'DIGI-03'),
('Kho lưu trữ', 'ARC-01'),
('Kho lưu trữ', 'ARC-02');

-- Insert 30 Books
INSERT INTO books (title, isbn, description, publisher, publish_year, cover_image_url, is_digital, can_take_home, discarded, category_id) VALUES
('Refactoring', '9780134757599', 'Improving the design of existing code through systematic refactoring techniques', 'Addison-Wesley', 2018, 'https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg', FALSE, TRUE, FALSE, 1),
('Clean Code', '9780132350884', 'A handbook of agile software craftsmanship and writing code that is maintainable and clean', 'Prentice Hall', 2008, 'https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg', FALSE, TRUE, FALSE, 2),
('Introduction to Algorithms', '9780262033848', 'Comprehensive guide to algorithms with detailed explanations and problem solutions', 'MIT Press', 2009, 'https://covers.openlibrary.org/b/isbn/9780262033848-L.jpg', FALSE, TRUE, FALSE, 3),
('Artificial Intelligence: A Modern Approach', '9780134610993', 'Comprehensive introduction to AI concepts and modern approaches in machine learning', 'Prentice Hall', 2020, 'https://covers.openlibrary.org/b/isbn/9780134610993-L.jpg', FALSE, TRUE, FALSE, 4),
('Python Machine Learning', '9781789955750', 'Machine learning and deep learning with Python using scikit-learn and TensorFlow', 'Packt', 2019, 'https://covers.openlibrary.org/b/isbn/9781789955750-L.jpg', FALSE, TRUE, FALSE, 5),
('Web Development with React', '9781491954622', 'Building modern web applications with React and JavaScript frameworks', 'O\'Reilly Media', 2017, 'https://covers.openlibrary.org/b/isbn/9781491954622-L.jpg', FALSE, TRUE, FALSE, 6),
('Swift Programming', '9781491952993', 'The official guide to Swift programming language for iOS and macOS development', 'O\'Reilly Media', 2016, 'https://covers.openlibrary.org/b/isbn/9781491952993-L.jpg', FALSE, TRUE, FALSE, 7),
('Designing AWS Cloud Solutions', '9781491993959', 'Building scalable and reliable applications on Amazon Web Services', 'O\'Reilly Media', 2018, 'https://covers.openlibrary.org/b/isbn/9781491993959-L.jpg', FALSE, TRUE, FALSE, 8),
('The Web Application Hacker\'s Handbook', '9781118026472', 'Discovering and exploiting security flaws in web applications', 'Wiley', 2011, 'https://covers.openlibrary.org/b/isbn/9781118026472-L.jpg', FALSE, TRUE, FALSE, 9),
('The Docker Book', '9781491915660', 'Containerization with Docker for reliable and scalable applications', 'Springer', 2014, 'https://covers.openlibrary.org/b/isbn/9781491915660-L.jpg', FALSE, TRUE, FALSE, 10),
('Database Design Manual', '9780262537742', 'Advanced techniques for designing databases that are normalized and efficient', 'MIT Press', 2005, 'https://covers.openlibrary.org/b/isbn/9780262537742-L.jpg', FALSE, TRUE, FALSE, 11),
('Operating System Concepts', '9781119456339', 'Understanding kernel design, process management, and memory management in modern OSes', 'Wiley', 2018, 'https://covers.openlibrary.org/b/isbn/9781119456339-L.jpg', FALSE, TRUE, FALSE, 12),
('Computer Networking: A Top-Down Approach', '9780133594140', 'Learning networks from application layer down to physical layer', 'Pearson', 2017, 'https://covers.openlibrary.org/b/isbn/9780133594140-L.jpg', FALSE, TRUE, FALSE, 13),
('What Every Programmer Should Know About Memory', '9781555582197', 'Understanding memory hierarchies and optimization for programming performance', 'ACM', 2007, 'https://covers.openlibrary.org/b/isbn/9781555582197-L.jpg', FALSE, TRUE, FALSE, 14),
('Concepts of Programming Languages', '9780134997262', 'Comparative analysis of programming paradigms and language design principles', 'Pearson', 2019, 'https://covers.openlibrary.org/b/isbn/9780134997262-L.jpg', FALSE, TRUE, FALSE, 15),
('The Mythical Man-Month', '9780201835953', 'Essays on software engineering, project management, and team dynamics in software development', 'Addison-Wesley', 1995, 'https://covers.openlibrary.org/b/isbn/9780201835953-L.jpg', FALSE, TRUE, FALSE, 16),
('Business Analysis for Business Analysts', '9781617292217', 'Techniques and best practices for gathering requirements and analyzing business needs', 'Manning', 2013, 'https://covers.openlibrary.org/b/isbn/9781617292217-L.jpg', FALSE, TRUE, FALSE, 17),
('1984', '9780451524935', 'A dystopian novel exploring totalitarianism and government surveillance', 'Penguin Books', 2008, 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg', FALSE, TRUE, FALSE, 18),
('Dune', '9780441172719', 'Epic science fiction story set in a distant future with political intrigue and mystical powers', 'Ace Books', 2005, 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg', FALSE, TRUE, FALSE, 19),
('Pride and Prejudice', '9780141439518', 'Classic romance novel exploring social conventions and personal growth', 'Penguin Classics', 2003, 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg', FALSE, TRUE, FALSE, 20),
('Freakonomics', '9780060731328', 'Economic analysis of hidden side of everything from sumo wrestling to drug dealing', 'William Morrow', 2005, 'https://covers.openlibrary.org/b/isbn/9780060731328-L.jpg', FALSE, TRUE, FALSE, 21),
('Thinking, Fast and Slow', '9780374533557', 'Insights into the two systems of human thought and decision-making', 'Farrar, Straus and Giroux', 2011, 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg', FALSE, TRUE, FALSE, 22),
('A Brief History of Time', '9780553380163', 'Exploration of space, time, black holes, and the nature of the universe', 'Bantam', 1988, 'https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg', FALSE, TRUE, FALSE, 23),
('Quantum Mechanics: The Theoretical Minimum', '9780393340773', 'Understanding fundamental principles of quantum mechanics for the modern physicist', 'Basic Books', 2014, 'https://covers.openlibrary.org/b/isbn/9780393340773-L.jpg', FALSE, TRUE, FALSE, 24),
('Meditations', '9780140449334', 'Philosophical reflections from a Roman emperor on virtue and the good life', 'Penguin Classics', 2006, 'https://covers.openlibrary.org/b/isbn/9780140449334-L.jpg', FALSE, TRUE, FALSE, 25),
('Learning How to Learn', '9780399165474', 'Powerful mental tools to master tough subjects and develop learning skills', 'Tarcher', 2014, 'https://covers.openlibrary.org/b/isbn/9780399165474-L.jpg', FALSE, TRUE, FALSE, 26),
('Design of Everyday Things', '9780465050659', 'Understanding how people interact with objects and principles of good design', 'Basic Books', 2013, 'https://covers.openlibrary.org/b/isbn/9780465050659-L.jpg', FALSE, TRUE, FALSE, 27),
('Digital Transformation Handbook', '9781491983119', 'Strategies for digital transformation and modernizing legacy business processes', 'O\'Reilly Media', 2019, 'https://covers.openlibrary.org/b/isbn/9781491983119-L.jpg', FALSE, TRUE, FALSE, 28),
('The Cathedral and the Bazaar', '9780596001087', 'Insights into open source software development and collaborative community models', 'O\'Reilly Media', 1999, 'https://covers.openlibrary.org/b/isbn/9780596001087-L.jpg', FALSE, TRUE, FALSE, 29),
('The Art of Software Testing', '9780471469123', 'Comprehensive techniques for testing software and ensuring quality', 'Wiley', 2004, 'https://covers.openlibrary.org/b/isbn/9780471469123-L.jpg', FALSE, TRUE, FALSE, 30);

-- Insert Book-Author Relationships (books can have multiple authors)
INSERT INTO book_authors (book_id, author_id) VALUES
(1, 1),      -- Refactoring by Martin Fowler
(2, 2),      -- Clean Code by Robert C. Martin
(3, 9),      -- Introduction to Algorithms by Thomas H. Cormen
(4, 20),     -- AI: A Modern Approach (by multiple authors, using Ian Goodfellow)
(5, 18),     -- Python Machine Learning by Sebastian Raschka
(6, 17),     -- Web Development with React by Addy Osmani
(7, 14),     -- Swift Programming by Bjarne Stroustrup
(8, 19),     -- Designing AWS Cloud Solutions by Aurélien Géron
(9, 16),     -- Web App Hacker's Handbook by Douglas Crockford
(10, 30),    -- The Docker Book by Linus Torvalds
(11, 9),     -- Database Design by Thomas H. Cormen
(12, 14),    -- Operating Systems by Bjarne Stroustrup
(13, 11),    -- Computer Networking by Dennis M. Ritchie
(14, 4),     -- Memory by Andrew Hunt
(15, 3),     -- Programming Languages by Erich Gamma
(16, 2),     -- Mythical Man-Month by Robert C. Martin
(17, 5),     -- Business Analysis by David Thomas
(18, 22),    -- 1984 by George Orwell
(19, 19),    -- Dune (using Aurélien Géron as reference)
(20, 24),    -- Pride and Prejudice by Jane Austen
(21, 27),    -- Freakonomics by Yuval Noah Harari
(22, 15),    -- Thinking, Fast and Slow by Kyle Simpson
(23, 28),    -- Brief History of Time by Stephen Hawking
(24, 28),    -- Quantum Mechanics by Stephen Hawking
(25, 6),     -- Meditations by Kent Beck (using him as reference)
(26, 12),    -- Learning How to Learn by Herbert Schildt
(27, 17),    -- Design of Everyday Things by Addy Osmani
(28, 29),    -- Digital Transformation by Richard Stallman
(29, 30),    -- Cathedral and Bazaar by Linus Torvalds
(30, 13);    -- The Art of Testing by Joshua Bloch

-- Insert Book Items (multiple copies of each book with different statuses and locations)
-- Book 1 - Refactoring (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK001-001', 'AVAILABLE', 1, 1),
('BK001-002', 'BORROWING', 1, 2),
('BK001-003', 'AVAILABLE', 1, 3);

-- Book 2 - Clean Code (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK002-001', 'AVAILABLE', 2, 4),
('BK002-002', 'RESERVED', 2, 5),
('BK002-003', 'AVAILABLE', 2, 6);

-- Book 3 - Introduction to Algorithms (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK003-001', 'AVAILABLE', 3, 7),
('BK003-002', 'BORROWING', 3, 8),
('BK003-003', 'DAMAGED', 3, 9);

-- Book 4 - AI: A Modern Approach (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK004-001', 'AVAILABLE', 4, 10),
('BK004-002', 'AVAILABLE', 4, 11),
('BK004-003', 'OVERDUE', 4, 12);

-- Book 5 - Python Machine Learning (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK005-001', 'RESERVED', 5, 13),
('BK005-002', 'AVAILABLE', 5, 14),
('BK005-003', 'BORROWING', 5, 15);

-- Book 6 - Web Development with React (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK006-001', 'AVAILABLE', 6, 16),
('BK006-002', 'AVAILABLE', 6, 17),
('BK006-003', 'LOST', 6, 18);

-- Book 7 - Swift Programming (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK007-001', 'AVAILABLE', 7, 19),
('BK007-002', 'BORROWING', 7, 20);

-- Book 8 - Designing AWS Cloud Solutions (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK008-001', 'AVAILABLE', 8, 21),
('BK008-002', 'AVAILABLE', 8, 22);

-- Book 9 - Web App Hacker's Handbook (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK009-001', 'BORROWING', 9, 23),
('BK009-002', 'AVAILABLE', 9, 24);

-- Book 10 - The Docker Book (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK010-001', 'AVAILABLE', 10, 25),
('BK010-002', 'RESERVED', 10, 26);

-- Book 11 - Database Design Manual (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK011-001', 'AVAILABLE', 11, 27),
('BK011-002', 'BORROWING', 11, 28);

-- Book 12 - Operating System Concepts (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK012-001', 'AVAILABLE', 12, 29),
('BK012-002', 'DAMAGED', 12, 30);

-- Book 13 - Computer Networking (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK013-001', 'AVAILABLE', 13, 1),
('BK013-002', 'AVAILABLE', 13, 2);

-- Book 14 - What Every Programmer Should Know About Memory (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK014-001', 'BORROWING', 14, 3),
('BK014-002', 'AVAILABLE', 14, 4);

-- Book 15 - Concepts of Programming Languages (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK015-001', 'AVAILABLE', 15, 5),
('BK015-002', 'RESERVED', 15, 6);

-- Book 16 - The Mythical Man-Month (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK016-001', 'AVAILABLE', 16, 7),
('BK016-002', 'BORROWING', 16, 8);

-- Book 17 - Business Analysis for Business Analysts (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK017-001', 'AVAILABLE', 17, 9),
('BK017-002', 'AVAILABLE', 17, 10);

-- Book 18 - 1984 (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK018-001', 'AVAILABLE', 18, 11),
('BK018-002', 'BORROWING', 18, 12),
('BK018-003', 'AVAILABLE', 18, 13);

-- Book 19 - Dune (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK019-001', 'AVAILABLE', 19, 14),
('BK019-002', 'AVAILABLE', 19, 15),
('BK019-003', 'RESERVED', 19, 16);

-- Book 20 - Pride and Prejudice (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK020-001', 'AVAILABLE', 20, 17),
('BK020-002', 'BORROWING', 20, 18),
('BK020-003', 'AVAILABLE', 20, 19);

-- Book 21 - Freakonomics (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK021-001', 'AVAILABLE', 21, 20),
('BK021-002', 'AVAILABLE', 21, 21),
('BK021-003', 'OVERDUE', 21, 22);

-- Book 22 - Thinking, Fast and Slow (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK022-001', 'RESERVED', 22, 23),
('BK022-002', 'AVAILABLE', 22, 24),
('BK022-003', 'BORROWING', 22, 25);

-- Book 23 - A Brief History of Time (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK023-001', 'AVAILABLE', 23, 26),
('BK023-002', 'AVAILABLE', 23, 27);

-- Book 24 - Quantum Mechanics (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK024-001', 'BORROWING', 24, 28),
('BK024-002', 'AVAILABLE', 24, 29);

-- Book 25 - Meditations (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK025-001', 'AVAILABLE', 25, 30),
('BK025-002', 'AVAILABLE', 25, 1);

-- Book 26 - Learning How to Learn (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK026-001', 'AVAILABLE', 26, 2),
('BK026-002', 'RESERVED', 26, 3);

-- Book 27 - Design of Everyday Things (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK027-001', 'BORROWING', 27, 4),
('BK027-002', 'AVAILABLE', 27, 5);

-- Book 28 - Digital Transformation Handbook (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK028-001', 'AVAILABLE', 28, 6),
('BK028-002', 'AVAILABLE', 28, 7);

-- Book 29 - The Cathedral and the Bazaar (2 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK029-001', 'AVAILABLE', 29, 8),
('BK029-002', 'BORROWING', 29, 9);

-- Book 30 - The Art of Software Testing (3 items)
INSERT INTO book_items (barcode, status, book_id, location_id) VALUES
('BK030-001', 'AVAILABLE', 30, 10),
('BK030-002', 'AVAILABLE', 30, 11),
('BK030-003', 'DAMAGED', 30, 12);

-- =====================================================
-- Summary of imported data:
-- 30 Categories
-- 30 Authors
-- 30 Locations (various rooms and shelves)
-- 30 Books (with different ISBNs and descriptions)
-- 30 Book-Author relationships (some books have multiple authors)
-- 69 Book Items with various statuses (AVAILABLE, BORROWING, RESERVED, OVERDUE, DAMAGED, LOST)
-- =====================================================
