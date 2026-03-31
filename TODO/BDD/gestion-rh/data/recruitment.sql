-- STATUTS DE DEMANDE
INSERT INTO requests_status (status_id, status_name) VALUES
('STD_001', 'En attente'),
('STD_002', 'En cours'),
('STD_003', 'Validée'),
('STD_004', 'Refusée');

-- STATUTS DE TDR
INSERT INTO job_descriptions_status (status_id, status_name) VALUES
('STF_001', 'En attente'),
('STF_002', 'Validée'),
('STF_003', 'Publiée');


INSERT INTO replacement_reasons (replacement_reason_id, reason_name) VALUES
('RR_001', 'Démission'),
('RR_002', 'Décès'),
('RR_003', 'Essai non concluant'),
('RR_004', 'Retraite'),
('RR_005', 'Licenciement'),
('RR_006', 'Rupture de contrat à l’amiable'),
('RR_007', 'Mobilité interne');

INSERT INTO experiences_points (experience_point_id, minimum_year, maximum_year, points)
VALUES
('EXP_PTS-001', 0, 1, 3),
('EXP_PTS-002', 2, 3, 5),
('EXP_PTS-003', 4, 5, 7),
('EXP_PTS-004', 6, 100, 10);


INSERT INTO level_educations (level_education_id, level_education_name, points) VALUES
('NIV_ETU_0001', 'Lycée', 2.00),
('NIV_ETU_0002', 'Baccalauréat', 3.00),
('NIV_ETU_0003', 'DTS', 5.00),
('NIV_ETU_0004', 'Licence', 6.00),
('NIV_ETU_0005', 'Master 1', 7.00),
('NIV_ETU_0006', 'Master 2', 8.00),
('NIV_ETU_0007', 'Doctorat', 10.00);


INSERT INTO posts_types (post_type_id, post_type_name) VALUES
('TYP_POS-0001', 'Poste à responsabilité'),
('TYP_POS-0002', 'Poste technique');


INSERT INTO speaking_levels (speaking_level_id, speaking_level_code, speaking_level_name) VALUES
('NIV_LAN_0001', 'A1', 'Débutant'),
('NIV_LAN_0002', 'A2', 'Élémentaire'),
('NIV_LAN_0003', 'B1', 'Intermédiaire'),
('NIV_LAN_0004', 'B2', 'Intermédiaire avancé'),
('NIV_LAN_0005', 'C1', 'Avancé'),
('NIV_LAN_0006', 'C2', 'Professionnel');

INSERT INTO langages (langage_id, langage_name) VALUES
('LAN_001', 'Français'),
('LAN_002', 'Anglais'),
('LAN_003', 'Espagnol'),
('LAN_004', 'Italien'),
('LAN_005', 'Allemand'),
('LAN_006', 'Chinois'),
('LAN_007', 'Japonais'),
('LAN_008', 'Russe');

-- Français
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_FR_0001', 'LAN_001', 'NIV_LAN_0001', 2),
('SP_FR_0002', 'LAN_001', 'NIV_LAN_0002', 4),
('SP_FR_0003', 'LAN_001', 'NIV_LAN_0003', 5),
('SP_FR_0004', 'LAN_001', 'NIV_LAN_0004', 7),
('SP_FR_0005', 'LAN_001', 'NIV_LAN_0005', 9),
('SP_FR_0006', 'LAN_001', 'NIV_LAN_0006', 10);
-- Anglais
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_EN_0001', 'LAN_002', 'NIV_LAN_0001', 2),
('SP_EN_0002', 'LAN_002', 'NIV_LAN_0002', 4),
('SP_EN_0003', 'LAN_002', 'NIV_LAN_0003', 5),
('SP_EN_0004', 'LAN_002', 'NIV_LAN_0004', 7),
('SP_EN_0005', 'LAN_002', 'NIV_LAN_0005', 9),
('SP_EN_0006', 'LAN_002', 'NIV_LAN_0006', 10);
-- Espagnol
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_ES_0001', 'LAN_003', 'NIV_LAN_0001', 2),
('SP_ES_0002', 'LAN_003', 'NIV_LAN_0002', 4),
('SP_ES_0003', 'LAN_003', 'NIV_LAN_0003', 5),
('SP_ES_0004', 'LAN_003', 'NIV_LAN_0004', 7),
('SP_ES_0005', 'LAN_003', 'NIV_LAN_0005', 9),
('SP_ES_0006', 'LAN_003', 'NIV_LAN_0006', 10);
-- Italien
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_IT_0001', 'LAN_004', 'NIV_LAN_0001', 2),
('SP_IT_0002', 'LAN_004', 'NIV_LAN_0002', 4),
('SP_IT_0003', 'LAN_004', 'NIV_LAN_0003', 5),
('SP_IT_0004', 'LAN_004', 'NIV_LAN_0004', 7),
('SP_IT_0005', 'LAN_004', 'NIV_LAN_0005', 9),
('SP_IT_0006', 'LAN_004', 'NIV_LAN_0006', 10);
-- Allemand
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_DE_0001', 'LAN_005', 'NIV_LAN_0001', 2),
('SP_DE_0002', 'LAN_005', 'NIV_LAN_0002', 4),
('SP_DE_0003', 'LAN_005', 'NIV_LAN_0003', 5),
('SP_DE_0004', 'LAN_005', 'NIV_LAN_0004', 7),
('SP_DE_0005', 'LAN_005', 'NIV_LAN_0005', 9),
('SP_DE_0006', 'LAN_005', 'NIV_LAN_0006', 10);
-- Chinois
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_CN_0001', 'LAN_006', 'NIV_LAN_0001', 2),
('SP_CN_0002', 'LAN_006', 'NIV_LAN_0002', 4),
('SP_CN_0003', 'LAN_006', 'NIV_LAN_0003', 5),
('SP_CN_0004', 'LAN_006', 'NIV_LAN_0004', 7),
('SP_CN_0005', 'LAN_006', 'NIV_LAN_0005', 9),
('SP_CN_0006', 'LAN_006', 'NIV_LAN_0006', 10);
-- Japonais
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_JP_0001', 'LAN_007', 'NIV_LAN_0001', 2),
('SP_JP_0002', 'LAN_007', 'NIV_LAN_0002', 4),
('SP_JP_0003', 'LAN_007', 'NIV_LAN_0003', 5),
('SP_JP_0004', 'LAN_007', 'NIV_LAN_0004', 7),
('SP_JP_0005', 'LAN_007', 'NIV_LAN_0005', 9),
('SP_JP_0006', 'LAN_007', 'NIV_LAN_0006', 10);
-- Russe
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_RU_0001', 'LAN_008', 'NIV_LAN_0001', 2),
('SP_RU_0002', 'LAN_008', 'NIV_LAN_0002', 4),
('SP_RU_0003', 'LAN_008', 'NIV_LAN_0003', 5),
('SP_RU_0004', 'LAN_008', 'NIV_LAN_0004', 7),
('SP_RU_0005', 'LAN_008', 'NIV_LAN_0005', 9),
('SP_RU_0006', 'LAN_008', 'NIV_LAN_0006', 10);


INSERT INTO preselection_criteria (preselection_criteria_id, criteria) VALUES
('CRIT_001', 'Niveau d’etude'),
('CRIT_002', 'Diplômes et/ou formations'),
('CRIT_003', 'Années d’expérience professionnelle'),
('CRIT_004', 'Compétences linguistiques'),
('CRIT_005', 'Clarté et qualité du CV');
