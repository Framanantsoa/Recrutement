INSERT INTO Users(user_id, Matricule, Name, Email, position, Department, superior_id, superior_name, Status, Signature, user_type) 
VALUES 
('USR001', 'mat431', 'Jean DUPONT (DGE)', 'jean.dupont@gmail.com', 'Directeur Général', 'DGE', null, null, null, null, null),
('USR002', 'mat182', 'Marie RAKOTO (DRH)', 'marie.rakoto@gmail.com', 'Directrice des Ressources Humaines', 'DRH', 'ec738732-6e94-4288-be4a-c098408d199d', 'Jean DUPONT (DGE)', null, null, null),
('USR003', 'mat425', 'Paul MARTIN (DAF)', 'paul.martin@gmail.com', 'Directeur Administratif et Financier', 'DAF', 'ec738732-6e94-4288-be4a-c098408d199d', 'Jean DUPONT (DGE)', null, null, null),
('USR004', 'mat358', 'Luc ANDRIANA (DRH)', 'luc.andriana@gmail.com', 'Chef de Département Développement RH et Rémunération', 'DRH', '002b1f12-e8c5-4a30-81ca-e8532855de71', 'Marie RAKOTO (DRH)', null, null, null),
('USR005', 'mat383', 'Sophie RABEHARISOA (DRH)', 'sophie.rabeharisoa@gmail.com', 'Responsable Administratif RH et Recrutement', 'DRH', '76c25f37-2089-4e81-8329-1b63d880b71a', 'Luc ANDRIANA (DRH)', null, null, null),
('USR006', 'mat418', 'Eric RANDRIANARISOA (DSI)', 'eric.randrianarisoa@gmail.com', 'Chef de département Transformation Digitale', 'DSI', 'c894ab8a-7e91-41c9-8102-5eef8d8e99a0', 'Nicolas RAZAFINDRAKOTO (DSI)', null, null, null),
('USR007', 'mat446', 'Laura RAKOTONIRINA (DSI)', 'laura.rakotonirina@gmail.com', 'Cheffe de Projet SI et Innovation', 'DSI', 'ba5d519e-3b23-4201-a6a6-1d3760f6b214', 'Eric RANDRIANARISOA (DSI)', null, null, null),
('USR008', 'mat416', 'Hery RAZANAKOTO (DAF)', 'hery.razanakoto@gmail.com', 'Chef Comptable', 'DAF', '9c2ac066-01de-49a4-86a1-0d1153cb14e8', 'Claude RAMANANTSOA (DAF)', null, null, null),
('USR009', 'stg173', 'Mathias MANANTSOA (DRH)', 'mathias.manantsoa@gmail.com', 'Stagiaire DRH', 'DRH', '76c25f37-2089-4e81-8329-1b63d880b71a', 'Luc ANDRIANA (DRH)', null, null, null),
('USR010', 'mat386', 'Nicolas RAZAFINDRAKOTO (DSI)', 'nicolas.razafindrakoto@gmail.com', 'Directeur des Systèmes d''Information', 'DSI', 'ec738732-6e94-4288-be4a-c098408d199d', 'Jean DUPONT (DGE)', null, null, null);

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
