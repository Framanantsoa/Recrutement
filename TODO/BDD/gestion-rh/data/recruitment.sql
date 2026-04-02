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



INSERT INTO level_educations (level_education_id, level_education_name) VALUES
('NIV_ETU_0001', 'Secondaire'),
('NIV_ETU_0002', 'Baccalauréat'),
('NIV_ETU_0003', 'Universitaire');


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
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id) VALUES
('SP_FR_0001', 'LAN_001', 'NIV_LAN_0001'),
('SP_FR_0002', 'LAN_001', 'NIV_LAN_0002'),
('SP_FR_0003', 'LAN_001', 'NIV_LAN_0003'),
('SP_FR_0004', 'LAN_001', 'NIV_LAN_0004'),
('SP_FR_0005', 'LAN_001', 'NIV_LAN_0005'),
('SP_FR_0006', 'LAN_001', 'NIV_LAN_0006');
-- Anglais
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id) VALUES
('SP_EN_0001', 'LAN_002', 'NIV_LAN_0001'),
('SP_EN_0002', 'LAN_002', 'NIV_LAN_0002'),
('SP_EN_0003', 'LAN_002', 'NIV_LAN_0003'),
('SP_EN_0004', 'LAN_002', 'NIV_LAN_0004'),
('SP_EN_0005', 'LAN_002', 'NIV_LAN_0005'),
('SP_EN_0006', 'LAN_002', 'NIV_LAN_0006');
-- Espagnol
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id) VALUES
('SP_ES_0001', 'LAN_003', 'NIV_LAN_0001'),
('SP_ES_0002', 'LAN_003', 'NIV_LAN_0002'),
('SP_ES_0003', 'LAN_003', 'NIV_LAN_0003'),
('SP_ES_0004', 'LAN_003', 'NIV_LAN_0004'),
('SP_ES_0005', 'LAN_003', 'NIV_LAN_0005'),
('SP_ES_0006', 'LAN_003', 'NIV_LAN_0006');
-- Italien
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id) VALUES
('SP_IT_0001', 'LAN_004', 'NIV_LAN_0001'),
('SP_IT_0002', 'LAN_004', 'NIV_LAN_0002'),
('SP_IT_0003', 'LAN_004', 'NIV_LAN_0003'),
('SP_IT_0004', 'LAN_004', 'NIV_LAN_0004'),
('SP_IT_0005', 'LAN_004', 'NIV_LAN_0005'),
('SP_IT_0006', 'LAN_004', 'NIV_LAN_0006');
-- Allemand
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id) VALUES
('SP_DE_0001', 'LAN_005', 'NIV_LAN_0001'),
('SP_DE_0002', 'LAN_005', 'NIV_LAN_0002'),
('SP_DE_0003', 'LAN_005', 'NIV_LAN_0003'),
('SP_DE_0004', 'LAN_005', 'NIV_LAN_0004'),
('SP_DE_0005', 'LAN_005', 'NIV_LAN_0005'),
('SP_DE_0006', 'LAN_005', 'NIV_LAN_0006');
-- Chinois
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id) VALUES
('SP_CN_0001', 'LAN_006', 'NIV_LAN_0001'),
('SP_CN_0002', 'LAN_006', 'NIV_LAN_0002'),
('SP_CN_0003', 'LAN_006', 'NIV_LAN_0003'),
('SP_CN_0004', 'LAN_006', 'NIV_LAN_0004'),
('SP_CN_0005', 'LAN_006', 'NIV_LAN_0005'),
('SP_CN_0006', 'LAN_006', 'NIV_LAN_0006');
-- Japonais
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id) VALUES
('SP_JP_0001', 'LAN_007', 'NIV_LAN_0001'),
('SP_JP_0002', 'LAN_007', 'NIV_LAN_0002'),
('SP_JP_0003', 'LAN_007', 'NIV_LAN_0003'),
('SP_JP_0004', 'LAN_007', 'NIV_LAN_0004'),
('SP_JP_0005', 'LAN_007', 'NIV_LAN_0005'),
('SP_JP_0006', 'LAN_007', 'NIV_LAN_0006');
-- Russe
INSERT INTO langages_speakings (langage_speaking_id, langage_id, speaking_level_id) VALUES
('SP_RU_0001', 'LAN_008', 'NIV_LAN_0001'),
('SP_RU_0002', 'LAN_008', 'NIV_LAN_0002'),
('SP_RU_0003', 'LAN_008', 'NIV_LAN_0003'),
('SP_RU_0004', 'LAN_008', 'NIV_LAN_0004'),
('SP_RU_0005', 'LAN_008', 'NIV_LAN_0005'),
('SP_RU_0006', 'LAN_008', 'NIV_LAN_0006');


INSERT INTO preselection_criteria (preselection_criteria_id, criteria) VALUES
('CRIT_001', 'Niveau d’etude'),
('CRIT_002', 'Diplômes et/ou formations'),
('CRIT_003', 'Années d’expérience professionnelle'),
('CRIT_004', 'Compétences linguistiques'),
('CRIT_005', 'Clarté et qualité du CV');
