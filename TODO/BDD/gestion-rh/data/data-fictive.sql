INSERT INTO Users(user_id, Matricule, Name, Email, position, Department, superior_id, superior_name, Status, Signature, user_type) 
VALUES 
('USR001', '01431', 'Jean DUPONT (DGE)', 'jean.dupont@gmail.com', 'Directeur Général', 'DGE', NULL, NULL, NULL, NULL, NULL),
('USR002', '01182', 'Marie RAKOTO (DRH)', 'marie.rakoto@gmail.com', 'Directrice des Ressources Humaines', 'DRH', 'USR001', 'Jean DUPONT (DGE)', NULL, NULL, NULL),
('USR003', '01425', 'Paul MARTIN (DAF)', 'paul.martin@gmail.com', 'Directeur Administratif et Financier', 'DAF', 'USR001', 'Jean DUPONT (DGE)', NULL, NULL, NULL),
('USR004', '01358', 'Luc ANDRIANA (DRH)', 'luc.andriana@gmail.com', 'Chef de Département Développement RH et Rémunération', 'DRH', 'USR002', 'Marie RAKOTO (DRH)', NULL, NULL, NULL),
('USR005', '01383', 'Sophie RABEHARISOA (DRH)', 'sophie.rabeharisoa@gmail.com', 'Responsable Administratif RH et Recrutement', 'DRH', 'USR004', 'Luc ANDRIANA (DRH)', NULL, NULL, NULL),
('USR006', '01386', 'Nicolas RAZAFINDRAKOTO (DSI)', 'nicolas.razafindrakoto@gmail.com', 'Directeur des Systèmes d''Information', 'DSI', 'USR001', 'Jean DUPONT (DGE)', NULL, NULL, NULL),
('USR007', '01418', 'Eric RANDRIANARISOA (DSI)', 'eric.randrianarisoa@gmail.com', 'Chef de département Transformation Digitale', 'DSI', 'USR006', 'Nicolas RAZAFINDRAKOTO (DSI)', NULL, NULL, NULL),
('USR008', '01446', 'Laura RAKOTONIRINA (DSI)', 'laura.rakotonirina@gmail.com', 'Cheffe de Projet SI et Innovation', 'DSI', 'USR007', 'Eric RANDRIANARISOA (DSI)', NULL, NULL, NULL),
('USR009', '01416', 'Hery RAZANAKOTO (DAF)', 'hery.razanakoto@gmail.com', 'Chef Comptable', 'DAF', 'USR003', 'Paul MARTIN (DAF)', NULL, NULL, NULL),
('USR010', '01024', 'Honorine BAKOMALALA (DAF)', 'honorine.bakomalala@gmail.com', 'Assistante Comptable', 'DAF', 'USR009', 'Hery RAZANAKOTO (DAF)', NULL, NULL, NULL);

INSERT INTO user_availability (user_id, status, changed_at)
SELECT 
    u.user_id, 
    'disponible' AS status, 
    CURRENT_TIMESTAMP AS changed_at
FROM users u
WHERE NOT EXISTS (
    SELECT 1 
    FROM user_availability ua 
    WHERE ua.user_id = u.user_id
);

INSERT INTO user_role (user_id, role_id)
VALUES
    ('USR009', 'ROLE_001'),
    ('USR009', 'ROLE_002'),
    ('USR009', 'ROLE_003');
