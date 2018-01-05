--create stories table


DROP TABLE IF EXISTS stories;


CREATE TABLE stories (
  id SERIAL PRIMARY KEY,
  title text NOT NULL,
  content text
);

INSERT INTO stories (title, content) VALUES
('What the government doesn''t want you to know about cats', '1st post - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
('The most boring article about cats you''ll ever read', '2nd post - Etc Etc'),
('7 things lady gaga has in common with cats', '3rd post - lots of cats meow');