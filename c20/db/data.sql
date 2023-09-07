CREATE TABLE data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR (100) NOT NULL,
    height INTEGER,
    weight FLOAT,
    birthdate DATE,
    married BOOLEAN DEFAULT false
);

INSERT INTO data (name, height, weight, birthdate) VALUES
('Rizal', 164, 65.00, '2005-04-13');