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


INSERT INTO level_educations (level_education_id, level_education_name, points) VALUES
('NIV_ETU_0001', 'Collège', 1.00),
('NIV_ETU_0002', 'Baccalauréat', 2.00),
('NIV_ETU_0003', 'Bac+2', 3.00),
('NIV_ETU_0004', 'Licence', 3.50),
('NIV_ETU_0005', 'Master', 4.00),
('NIV_ETU_0006', 'Doctorat', 5.00);


INSERT INTO posts_types (post_type_id, post_type_name) VALUES
('TYP_POS-0001', 'Poste à responsabilité'),
('TYP_POS-0002', 'Poste technique');


INSERT INTO speaking_levels (speaking_level_id, speaking_level_name) VALUES
('NIV_LAN_0001', 'Débutant'),
('NIV_LAN_0002', 'Intermédiaire'),
('NIV_LAN_0003', 'Avancé'),
('NIV_LAN_0004', 'Professionnel');

INSERT INTO langages (langage_id, langage_name, is_other_langage) VALUES
('LAN_001', 'Français', 0),
('LAN_002', 'Anglais', 0),
('LAN_003', 'Espagnol', 1),
('LAN_004', 'Italien', 1),
('LAN_005', 'Allemand', 1),
('LAN_006', 'Chinois', 1),
('LAN_007', 'Japonais', 1),
('LAN_008', 'Russe', 1);

-- Français
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_FR_0001', 'LAN_001', 'NIV_LAN_0001', 0.5),
('SP_FR_0002', 'LAN_001', 'NIV_LAN_0002', 1.0),
('SP_FR_0003', 'LAN_001', 'NIV_LAN_0003', 1.5),
('SP_FR_0004', 'LAN_001', 'NIV_LAN_0004', 2.0);
-- Anglais
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_EN_0001', 'LAN_002', 'NIV_LAN_0001', 0.5),
('SP_EN_0002', 'LAN_002', 'NIV_LAN_0002', 1.0),
('SP_EN_0003', 'LAN_002', 'NIV_LAN_0003', 1.5),
('SP_EN_0004', 'LAN_002', 'NIV_LAN_0004', 2.0);
-- Espagnol
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_ES_0001', 'LAN_003', 'NIV_LAN_0001', 0.5),
('SP_ES_0002', 'LAN_003', 'NIV_LAN_0002', 0.5),
('SP_ES_0003', 'LAN_003', 'NIV_LAN_0003', 1.0),
('SP_ES_0004', 'LAN_003', 'NIV_LAN_0004', 1.0);
-- Italien
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_IT_0001', 'LAN_004', 'NIV_LAN_0001', 0.5),
('SP_IT_0002', 'LAN_004', 'NIV_LAN_0002', 0.5),
('SP_IT_0003', 'LAN_004', 'NIV_LAN_0003', 1.0),
('SP_IT_0004', 'LAN_004', 'NIV_LAN_0004', 1.0);
-- Allemand
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_DE_0001', 'LAN_005', 'NIV_LAN_0001', 0.5),
('SP_DE_0002', 'LAN_005', 'NIV_LAN_0002', 0.5),
('SP_DE_0003', 'LAN_005', 'NIV_LAN_0003', 1.0),
('SP_DE_0004', 'LAN_005', 'NIV_LAN_0004', 1.0);
-- Chinois
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_CN_0001', 'LAN_006', 'NIV_LAN_0001', 0.5),
('SP_CN_0002', 'LAN_006', 'NIV_LAN_0002', 0.5),
('SP_CN_0003', 'LAN_006', 'NIV_LAN_0003', 1.0),
('SP_CN_0004', 'LAN_006', 'NIV_LAN_0004', 1.0);
-- Japonais
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_JP_0001', 'LAN_007', 'NIV_LAN_0001', 0.5),
('SP_JP_0002', 'LAN_007', 'NIV_LAN_0002', 0.5),
('SP_JP_0003', 'LAN_007', 'NIV_LAN_0003', 1.0),
('SP_JP_0004', 'LAN_007', 'NIV_LAN_0004', 1.0);
-- Russe
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id, points) VALUES
('SP_RU_0001', 'LAN_008', 'NIV_LAN_0001', 0.5),
('SP_RU_0002', 'LAN_008', 'NIV_LAN_0002', 0.5),
('SP_RU_0003', 'LAN_008', 'NIV_LAN_0003', 1.0),
('SP_RU_0004', 'LAN_008', 'NIV_LAN_0004', 1.0);

INSERT INTO preselection_criterion (preselection_criterion_id, criterion) VALUES
('CRIT_001', 'Niveau d’etude'),
('CRIT_002', 'Diplômes ou formations'),
('CRIT_003', 'Années d’expérience professionnelle'),
('CRIT_004', 'Compétences linguistiques'),
('CRIT_005', 'Clarté et qualité du CV');


INSERT INTO experiences_points (experience_point_id, minimum_year, maximum_year, points)
VALUES
-- [0, 2] : 2pts
('EXP_PTS-001', 0, 2, 2),
-- [3, 5] : 3pts
('EXP_PTS-002', 3, 5, 4),
-- [6, 100] : 5pts
('EXP_PTS-003', 6, 100, 5);
