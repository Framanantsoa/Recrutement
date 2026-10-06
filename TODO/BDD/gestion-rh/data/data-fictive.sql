INSERT INTO role (role_id, name, description, created_at, updated_at)
VALUES
('ROLE_001', 'Admin', 'Administrateur avec accès complet au système', CURRENT_TIMESTAMP, NULL),
('ROLE_002', 'Ressources Humaines', 'Rôle du service des Ressources Humaines', CURRENT_TIMESTAMP, NULL),
('ROLE_003', 'Collaborateur', 'Rôle standard pour un employé', CURRENT_TIMESTAMP, NULL),
('ROLE_004', 'Responsable recrutement', 'Responsable de recrutement dans la direction RH', CURRENT_TIMESTAMP, NULL),
('ROLE_005', 'Directeur', 'Responsable d''une direction', CURRENT_TIMESTAMP, NULL);


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
    ('USR009', 'ROLE_003'),
    ('USR005', 'ROLE_004'),
    ('USR001', 'ROLE_005'),
    ('USR002', 'ROLE_005'),
    ('USR003', 'ROLE_005'),
    ('USR006', 'ROLE_005');


-- ============================
-- HABILITATIONS & HABILITATION ROLE
-- ============================
INSERT INTO habilitation_groups (group_id, label) VALUES
('HABG_001', 'Administration'),
('HABG_002', 'Gestion du recrutement'),
('HABG_003', 'Navigation et accès aux menus');

-- ================= ADMINISTRATION =================
INSERT INTO habilitations (habilitation_id, group_id, label, description) VALUES
('HAB_001', 'HABG_001', 'Consulter les utilisateurs', 'Autorise l’accès à la liste des utilisateurs.'),
('HAB_002', 'HABG_001', 'Modifier les utilisateurs', 'Permet de modifier les informations d’un utilisateur.'),
('HAB_003', 'HABG_001', 'Supprimer un utilisateur', 'Autorise la suppression d’un utilisateur.'),
('HAB_004', 'HABG_001', 'Consulter les logs', 'Autorise l’accès aux journaux d’activités.'),
('HAB_005', 'HABG_001', 'Modifier les habilitations d’un rôle', 'Permet d’ajouter ou retirer des habilitations à un rôle.'),
('HAB_006', 'HABG_001', 'Créer un rôle', 'Autorise la création d’un nouveau rôle.'),
('HAB_007', 'HABG_001', 'Modifier un rôle', 'Permet de modifier les informations d’un rôle existant.'),
('HAB_008', 'HABG_001', 'Supprimer un rôle', 'Autorise la suppression d’un rôle.'),
('HAB_009', 'HABG_001', 'Consulter les rôles', 'Permet d’afficher la liste des rôles.'),
('HAB_010', 'HABG_001', 'Consulter les habilitations', 'Permet d’afficher la liste des habilitations.');
-- ================= RECRUTEMENT =================
INSERT INTO habilitations (habilitation_id, group_id, label, description) VALUES
('HAB_011', 'HABG_002', 'Consulter les demandes', 'Autorise la consultation des demandes de recrutement.'),
('HAB_012', 'HABG_002', 'Créer une demande', 'Permet d’ajouter une nouvelle demande de recrutement.'),
('HAB_013', 'HABG_002', 'Modifier une demande', 'Permet de modifier une demande existante.'),
('HAB_014', 'HABG_002', 'Supprimer une demande', 'Autorise la suppression d’une demande.'),
('HAB_015', 'HABG_002', 'Consulter le détail d’une demande', 'Permet de voir les informations complètes d’une demande.'),
('HAB_016', 'HABG_002', 'Valider une demande', 'Autorise la validation d’une demande de recrutement.'),
('HAB_017', 'HABG_002', 'Consulter les demandes des collaborateurs', 'Permet de voir les demandes des collaborateurs (N-1).'),
('HAB_018', 'HABG_002', 'Gérer les paramétrages du recrutement', 'Autorise la configuration des paramètres liés au recrutement.'),
('HAB_028', 'HABG_002', 'Valider un TDR', 'Autorise la validation d’un TDR.'),
('HAB_029', 'HABG_002', 'Consulter des candidats présélectionnées', 'Permet d’afficher la liste des candidats présélectionnés.');
-- ================= NAVIGATION =================
INSERT INTO habilitations (habilitation_id, group_id, label, description) VALUES
('HAB_019', 'HABG_003', 'Accéder aux logs', 'Permet d’afficher le menu Logs.'),
('HAB_020', 'HABG_003', 'Accéder au tableau de bord', 'Permet d’accéder au tableau de bord.'),
('HAB_021', 'HABG_003', 'Accéder au module recrutement', 'Permet d’afficher le menu Recrutement.'),
('HAB_022', 'HABG_003', 'Accéder aux utilisateurs', 'Permet d’afficher le menu Utilisateurs.'),
('HAB_023', 'HABG_003', 'Accéder au module Droit & Accès', 'Permet d’afficher le menu Droit & Accès.'),
('HAB_024', 'HABG_003', 'Accéder aux rôles', 'Permet d’afficher le sous-menu Rôles.'),
('HAB_025', 'HABG_003', 'Accéder aux habilitations', 'Permet d’afficher le sous-menu Habilitations.'),
('HAB_026', 'HABG_003', 'Accéder au référentiel', 'Permet d’afficher le menu Référentiel.'),
('HAB_027', 'HABG_003', 'Accéder aux données', 'Permet d’afficher le menu Données.');


-- ============================
-- ROLE HABILITATION
-- ============================
INSERT INTO role_habilitation (habilitation_id, role_id)
SELECT h.habilitation_id, 'ROLE_001'
FROM habilitations h
WHERE NOT EXISTS (
    SELECT 1
    FROM role_habilitation rh
    WHERE rh.habilitation_id = h.habilitation_id
    AND rh.role_id = 'ROLE_001'
);

-- Insertion des modules (ajout du nouveau module 'tableau_de_bord' au-dessus de 'mission')
INSERT INTO module (module_id, module_name, description, created_at, updated_at) VALUES
('MOD_001', 'Tableau de bord', 'Gestion du tableau de bord et des indicateurs', GETDATE(), GETDATE()),
('MOD_002', 'Suivi de recrutement', 'Gestion des recrutements, validations et embauches', GETDATE(), GETDATE()),
('MOD_003', 'Utilisateurs', 'Gestion des utilisateurs et rôles', GETDATE(), GETDATE()),
('MOD_004', 'Droit & Accès', 'Gestion des droits et autorisations', GETDATE(), GETDATE()),
('MOD_005', 'Logs', 'Suivi et journalisation des actions utilisateurs et systèmes', GETDATE(), GETDATE()),
('MOD_006', 'Référentiel', 'Gestion des données référentielles', GETDATE(), GETDATE()),
('MOD_007', 'Données', 'Gestion des imports et réinitialisation', GETDATE(), GETDATE());


INSERT INTO menu (menu_id, menu_key, icon, link, is_enabled, position, module_id, section, is_visible, created_at, updated_at) VALUES
('MEN_001', 'Tableau de bord', 'fa-tachometer-alt', '/tableau-bord', 1, 1, 'MOD_001', 'navigation', 1, GETDATE(), GETDATE()),
('MEN_002', 'Suivi de recrutement', 'fa-briefcase', '/recrutement', 1, 2, 'MOD_002', 'navigation', 1, GETDATE(), GETDATE()),
('MEN_002_1', 'validations', 'fa-tasks', '/recrutement/a-valider', 1, 1, 'MOD_002', 'navigation', 1, GETDATE(), GETDATE()),
('MEN_002_2', 'Workflow des validateurs', 'fa-users-cog', '/recrutement/validateurs', 1, 2, 'MOD_002', 'navigation', 1, GETDATE(), GETDATE()),
('MEN_002_3', 'demandes', 'fa-list', '/recrutement/liste-demandes', 1, 3, 'MOD_002', 'navigation', 1, GETDATE(), GETDATE()),
('MEN_002_4', 'Entretiens', 'fa-reg-calendar', '/recrutement/liste-entretiens', 1, 5, 'MOD_002', 'navigation', 1, GETDATE(), GETDATE()),
-- Administration
('MEN_003', 'utilisateurs', 'fa-users', '/utilisateurs', 1, 1, 'MOD_003', 'administration', 1, GETDATE(), GETDATE()),
('MEN_004', 'Rôles & Habilitations', 'fa-shield-alt', '/droit-acces', 1, 2, 'MOD_004', 'administration', 1, GETDATE(), GETDATE()),
('MEN_004_1', 'roles', 'fa-user-tag', '/roles', 1, 1, 'MOD_004', 'administration', 1, GETDATE(), GETDATE()),
('MEN_004_2', 'habilitations', 'fa-key', '/habilitations', 1, 2, 'MOD_004', 'administration', 1, GETDATE(), GETDATE()),
('MEN_006', 'referentiel', 'fa-sliders-h', '/referentiels', 1, 3, 'MOD_006', 'administration', 1, GETDATE(), GETDATE()),
('MEN_007', 'donnees', 'fa-database', '/donnees', 1, 4, 'MOD_007', 'administration', 1, GETDATE(), GETDATE()),
('MEN_005', 'logs', 'fa-file-alt', '/logs', 1, 5, 'MOD_005', 'administration', 1, GETDATE(), GETDATE());


INSERT INTO menu_hierarchy (hierarchy_id, parent_menu_id, menu_id, created_at, updated_at) VALUES
-- MENUS RACINES
('H_001', NULL, 'MEN_001', GETDATE(), GETDATE()), -- Tableau de bord
('H_002', NULL, 'MEN_002', GETDATE(), GETDATE()), -- Suivi recrutement
('H_003', NULL, 'MEN_003', GETDATE(), GETDATE()), -- Utilisateurs
('H_004', NULL, 'MEN_004', GETDATE(), GETDATE()), -- Droit & Accès
('H_005', NULL, 'MEN_006', GETDATE(), GETDATE()), -- Référentiel
('H_006', NULL, 'MEN_007', GETDATE(), GETDATE()), -- Données
('H_007', NULL, 'MEN_005', GETDATE(), GETDATE()), -- Logs
-- SOUS-MENUS RECRUTEMENT
('H_002_1', 'MEN_002', 'MEN_002_1', GETDATE(), GETDATE()),
('H_002_2', 'MEN_002', 'MEN_002_2', GETDATE(), GETDATE()),
('H_002_3', 'MEN_002', 'MEN_002_3', GETDATE(), GETDATE()),
('H_002_4', 'MEN_002', 'MEN_002_4', GETDATE(), GETDATE()),
-- SOUS-MENUS DROIT & ACCÈS
('H_004_1', 'MEN_004', 'MEN_004_1', GETDATE(), GETDATE()),
('H_004_2', 'MEN_004', 'MEN_004_2', GETDATE(), GETDATE());
