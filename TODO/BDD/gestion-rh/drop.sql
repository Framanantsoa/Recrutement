/* Désactiver temporairement les contraintes FK */
EXEC sp_msforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT ALL";

DECLARE @sql NVARCHAR(MAX) = '';
SELECT @sql += '
ALTER TABLE ' + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) +
'.' + QUOTENAME(OBJECT_NAME(parent_object_id)) +
' DROP CONSTRAINT ' + QUOTENAME(name)
FROM sys.foreign_keys;
EXEC sp_executesql @sql;


/* --- Supprimer toutes les procédures --- */
DROP PROCEDURE IF EXISTS sp_update_all_mission_status;
DROP PROCEDURE IF EXISTS sp_upsert_general_director;
DROP PROCEDURE IF EXISTS sp_upsert_department_directors;
DROP PROCEDURE IF EXISTS sp_upsert_drh;
DROP PROCEDURE IF EXISTS sp_upsert_department_chiefs;
DROP PROCEDURE IF EXISTS sp_upsert_all_validators_main;
DROP PROCEDURE IF EXISTS sp_reset_validators_flow;
/* --- Supprimer les triggers --- */
DROP TRIGGER IF EXISTS trg_UpdateLastStatus;
/* --- Supprimer les fonctions --- */
DROP FUNCTION IF EXISTS fn_pending_recruitment_requests;
/* --- Supprimer les vues --- */
DROP VIEW IF EXISTS v_postes_par_dir;


DROP TABLE IF EXISTS tmp_employee;
DROP TABLE IF EXISTS notification_recipients;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS prevision_price;
DROP TABLE IF EXISTS logs;
DROP TABLE IF EXISTS mission_comments;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS mission_report_attachments;
DROP TABLE IF EXISTS mission_report;
DROP TABLE IF EXISTS expense_report_attachments;
DROP TABLE IF EXISTS expense_report;
DROP TABLE IF EXISTS mission_budget;
DROP TABLE IF EXISTS mission_validation;
DROP TABLE IF EXISTS compensation;
DROP TABLE IF EXISTS mission_assignation;
DROP TABLE IF EXISTS compensation_scale;
DROP TABLE IF EXISTS expense_compensation_scale;
DROP TABLE IF EXISTS employee_nationalities;
DROP TABLE IF EXISTS user_habilitations;
DROP TABLE IF EXISTS role_habilitation;
DROP TABLE IF EXISTS user_availability; 
DROP TABLE IF EXISTS user_role;
DROP TABLE IF EXISTS categories_of_employee;
DROP TABLE IF EXISTS mission;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS units;
DROP TABLE IF EXISTS service;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS menu_hierarchy;
DROP TABLE IF EXISTS menu_role;
DROP TABLE IF EXISTS menu;
DROP TABLE IF EXISTS module;
DROP TABLE IF EXISTS direction;
DROP TABLE IF EXISTS site;
DROP TABLE IF EXISTS lieu;
DROP TABLE IF EXISTS geo_zones;
DROP TABLE IF EXISTS transport;
DROP TABLE IF EXISTS expense_type;
DROP TABLE IF EXISTS expense_report_type;
DROP TABLE IF EXISTS habilitations;
DROP TABLE IF EXISTS habilitation_groups;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS employee_categories;
DROP TABLE IF EXISTS contract_types;
DROP TABLE IF EXISTS genders;
DROP TABLE IF EXISTS nationalities;

DROP TABLE IF EXISTS candidatures_comments;
DROP TABLE IF EXISTS candidatures;
DROP TABLE IF EXISTS job_skills;
DROP TABLE IF EXISTS job_experiences;
DROP TABLE IF EXISTS validators_flow;
DROP TABLE IF EXISTS job_formations;
DROP TABLE IF EXISTS job_validations;
DROP TABLE IF EXISTS job_attributions;
DROP TABLE IF EXISTS job_descriptions;
DROP TABLE IF EXISTS requests_per_validators;
DROP TABLE IF EXISTS requests_validations;
DROP TABLE IF EXISTS sites_requests;
DROP TABLE IF EXISTS job_descriptions_status;
DROP TABLE IF EXISTS recruitment_requests;
DROP TABLE IF EXISTS posts_types;
DROP TABLE IF EXISTS job_soft_skills;
DROP TABLE IF EXISTS level_educations;
DROP TABLE IF EXISTS requests_status;
DROP TABLE IF EXISTS replacement_reasons;
DROP TABLE IF EXISTS business_sequences;
DROP TABLE IF EXISTS candidatures_details;
DROP TABLE IF EXISTS langages;
DROP TABLE IF EXISTS speaking_levels;
DROP TABLE IF EXISTS candidatures_langages;
DROP TABLE IF EXISTS preselection_criteria;
DROP TABLE IF EXISTS langages_speakings;
DROP TABLE IF EXISTS candidatures_formations;
DROP TABLE IF EXISTS candidatures_points;
DROP TABLE IF EXISTS experiences_points;
DROP TABLE IF EXISTS job_interviews;
DROP TABLE IF EXISTS planifications;
DROP TABLE IF EXISTS criteria_thresholds;
DROP TABLE IF EXISTS speaking_criteria_thresholds;
DROP TABLE IF EXISTS job_descriptions_criteria;

/* Réactiver les contraintes FK */
EXEC sp_msforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT ALL";
