CREATE DATABASE IF NOT EXISTS CineDB;

USE CineDB;

CREATE TABLE Peliculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    director VARCHAR(100) NOT NULL,
    genero VARCHAR(50) NOT NULL,
    anio_estreno INT CHECK (anio_estreno >= 1888),
    duracion_min SMALLINT UNSIGNED NOT NULL,
    calificacion DECIMAL(3, 1) DEFAULT 0.0,
    sinopsis TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Consulta para verificar los datos de la tabla
SELECT * FROM Peliculas;





INSERT INTO Peliculas (titulo, director, genero, anio_estreno, duracion_min, calificacion, sinopsis) 
VALUES 
    ('El Padrino', 'Francis Ford Coppola', 'Crimen', 1972, 175, 9.2, 'El envejecido don de una dinastía del crimen organizado trasfiere el control de su imperio clandestino a su hijo reacio.'),
    ('El Señor de los Anillos: El Retorno del Rey', 'Peter Jackson', 'Fantasía', 2003, 201, 9.0, 'Gandalf y Aragon lideran el mundo de los hombres contra el ejército de Sauron para distractor su atención de Frodo y Sam.'),
    ('Pulp Fiction', 'Quentin Tarantino', 'Crimen', 1994, 154, 8.9, 'Las vidas de dos matones, un boxeador y la esposa de un gánster se entrelazan en cuatro historias de violencia y redención.'),
    ('El Caballero de la Noche', 'Christopher Nolan', 'Acción', 2008, 152, 9.0, 'Batman debe aceptar una de las mayores pruebas psicológicas y físicas para luchar contra el Joker.'),
    ('Origen (Inception)', 'Christopher Nolan', 'Ciencia Ficción', 2010, 148, 8.8, 'A un ladrón que roba secretos corporativos a través del uso de la tecnología de intercambio de sueños se le da la tarea inversa.'),
    ('Matrix', 'Lana Wachowski, Lilly Wachowski', 'Ciencia Ficción', 1999, 136, 8.7, 'Un hacker aprende de misteriosos rebeldes sobre la verdadera naturaleza de su realidad y su rol en la guerra contra sus controladores.'),
    ('Interstellar', 'Christopher Nolan', 'Ciencia Ficción', 2014, 169, 8.7, 'Un equipo de exploradores viaja a través de un agujero de gusano en el espacio en un intento por garantizar la supervivencia de la humanidad.'),
    ('Parasite', 'Bong Joon Ho', 'Drama', 2019, 132, 8.5, 'La codicia y la discriminación de clase amenazan la relación simbiótica recién formada entre la adinerada familia Park y el indigente clan Kim.'),
    ('Gladiador', 'Ridley Scott', 'Acción', 2000, 155, 8.5, 'Un ex general romano busca venganza contra el corrupto emperador que asesinó a su familia y lo condenó a la esclavitud.'),
    ('Coco', 'Lee Unkrich, Adrian Molina', 'Animación', 2017, 105, 8.4, 'El aspirante a músico Miguel se enfrenta a la prohibición ancestral de la música en su familia y entra en la Tierra de los Muertos.');