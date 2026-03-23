-- schema.sql
-- Run these commands in your Turso CLI or Dashboard to create the tables

-- 1. Table for the Landing Page
CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_page TEXT
);

-- 2. Table for the Book Details Page
CREATE TABLE IF NOT EXISTS book_details (
  book_id TEXT PRIMARY KEY,
  detailed_description TEXT,
  author_name TEXT NOT NULL,
  publication_date TEXT,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- 3. Table for Book Chapters
CREATE TABLE IF NOT EXISTS book_chapters (
  id TEXT PRIMARY KEY,
  book_id TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  chapter_title TEXT NOT NULL,
  content TEXT, -- Storing the actual text of the story chapter
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Example Insert Data
INSERT INTO books (id, title, description, cover_page) VALUES 
('b1', 'The Forgotten Kingdom', 'A thrilling fantasy epic about a lost realm.', 'https://images.unsplash.com/photo-1628102491629-778571d893a3?auto=format&fit=crop&q=80&w=400'),
('b2', 'Echoes of Time', 'A sci-fi adventure exploring the mysteries of time travel.', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400');

INSERT INTO book_details (book_id, detailed_description, author_name, publication_date) VALUES 
('b1', 'When an ancient crown is discovered in the ruins of Eldoria, a young farm boy realizes he is the last heir to the throne. Together with a band of unlikely heroes, he must reclaim his kingdom from the shadow lord.', 'Alan V. Fantasy', '2023-01-15'),
('b2', 'In the year 2145, time travel is outlawed. But when Detective Sarah Jenkins finds a watch that flows backward, she finds herself drawn into a conspiracy that spans millennia.', 'Sarah C. Fiction', '2022-09-10');

INSERT INTO book_chapters (id, book_id, chapter_number, chapter_title, content) VALUES 
('c1', 'b1', 1, 'The Crown', 'It was a dark and stormy night when the ancient artifact was unearthed.\n\nElias wiped the sweat from his brow. The metal glowed remarkably despite the mud, whispering secrets of an empire forgotten by all.'),
('c2', 'b1', 2, 'The Journey', 'The next morning, the sun broke through the gray sky.\n\nElias knew he had to leave his quiet life. He packed a satchel and mounted his steed, ready to face whatever lay ahead.'),
('c3', 'b2', 1, 'The Watch', 'The ticking was not rhythmic; it felt almost alive.\n\nDetective Sarah Jenkins turned it over in her hands, watching the hands spin counter-clockwise. Suddenly, the room shifted, and the city outside the window morphed into a lush forest.');
