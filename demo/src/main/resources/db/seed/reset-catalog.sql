-- Reset catalog seed data while preserving user and transaction tables.
-- Run this script only in development/testing environment.

DELETE FROM book_authors;
DELETE FROM book_items;
DELETE FROM books;
DELETE FROM authors;
DELETE FROM locations;
DELETE FROM categories;
