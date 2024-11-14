DO
$$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM patients) THEN
        INSERT INTO patients (name, surname, gender, date_of_birth, age, embg, active, deleted, created_at)
        VALUES 
            ('Tamara', 'Kostova', 'Female', '1980-01-01', 44, '1234567890123', TRUE, FALSE, CURRENT_DATE),
            ('Aleksandra', 'Nastoska', 'Female', '1985-05-10', 39, '1234567890124', TRUE, FALSE, CURRENT_DATE),
            ('Ilija', 'Bozoski', 'Male', '1990-02-15', 34, '1234567890125', TRUE, FALSE, CURRENT_DATE),
            ('Boris', 'Smokovski', 'Male', '1975-08-22', 49, '1234567890126', TRUE, FALSE, CURRENT_DATE),
            ('Dimitar', 'Trajanov', 'Male', '2000-11-30', 23, '1234567890127', TRUE, FALSE, CURRENT_DATE),
            ('Ema', 'Petreska', 'Female', '1995-07-07', 29, '1234567890128', TRUE, FALSE, CURRENT_DATE),
            ('Marija', 'Stefanovska', 'Female', '1998-04-25', 26, '1234567890129', TRUE, FALSE, CURRENT_DATE),
            ('Ana', 'Stojanovska', 'Female', '2003-12-12', 20, '1234567890130', TRUE, FALSE, CURRENT_DATE),
            ('Trajko', 'Trajkovsi', 'Male', '1992-06-19', 32, '1234567890131', TRUE, FALSE, CURRENT_DATE),
            ('Petar', 'Petrovski', 'Male', '1988-09-29', 36, '1234567890132', TRUE, FALSE, CURRENT_DATE);
    END IF;
END
$$;
