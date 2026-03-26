IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_direction_id')
    DROP SEQUENCE seq_direction_id;
-- GO
CREATE SEQUENCE seq_direction_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_department_id')
    DROP SEQUENCE seq_department_id;
-- GO
CREATE SEQUENCE seq_department_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_service_id')
    DROP SEQUENCE seq_service_id;
-- GO
CREATE SEQUENCE seq_service_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_site_id')
    DROP SEQUENCE seq_site_id;
-- GO
CREATE SEQUENCE seq_site_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_nationality_id')
    DROP SEQUENCE seq_nationality_id;
-- GO
CREATE SEQUENCE seq_nationality_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_gender_id')
    DROP SEQUENCE seq_gender_id;
-- GO
CREATE SEQUENCE seq_gender_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_contract_type_id')
    DROP SEQUENCE seq_contract_type_id;
-- GO
CREATE SEQUENCE seq_contract_type_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_employee_category_id')
    DROP SEQUENCE seq_employee_category_id;
-- GO

CREATE SEQUENCE seq_employee_category_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_unit_id')
    DROP SEQUENCE seq_unit_id;
-- GO
CREATE SEQUENCE seq_unit_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_employee_id')
    DROP SEQUENCE seq_employee_id;
-- GO
CREATE SEQUENCE seq_employee_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_user_id')
    DROP SEQUENCE seq_user_id;
-- GO
CREATE SEQUENCE seq_user_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_role_id')
    DROP SEQUENCE seq_role_id; -- Corrected: was seq_user_id
-- GO
CREATE SEQUENCE seq_role_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_habilitation_id')
    DROP SEQUENCE seq_habilitation_id; -- Corrected: was seq_user_id
-- GO
CREATE SEQUENCE seq_habilitation_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO

IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_role_habilitation_id')
    DROP SEQUENCE seq_role_habilitation_id; -- Corrected: was seq_user_id
-- GO
CREATE SEQUENCE seq_role_habilitation_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_log_id')
    DROP SEQUENCE seq_log_id;
-- GO
CREATE SEQUENCE seq_log_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_notifications_id')
    DROP SEQUENCE seq_notifications_id;
-- GO
CREATE SEQUENCE seq_notifications_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_tmp_employee_id')
    DROP SEQUENCE seq_tmp_employee_id;
-- GO
CREATE SEQUENCE seq_tmp_employee_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


-- RECRUTEMENT
IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_replacement_reason_id')
    DROP SEQUENCE seq_replacement_reason_id;
-- GO
CREATE SEQUENCE seq_replacement_reason_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_req_status_id')
    DROP SEQUENCE seq_req_status_id;
-- GO
CREATE SEQUENCE seq_req_status_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_job_status_id')
    DROP SEQUENCE seq_job_status_id;
-- GO
CREATE SEQUENCE seq_job_status_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_level_education_id')
    DROP SEQUENCE seq_level_education_id;
-- GO
CREATE SEQUENCE seq_level_education_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO



IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_evaluation_type_id')
    DROP SEQUENCE seq_evaluation_type_id;
-- GO
CREATE SEQUENCE seq_evaluation_type_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_request_id')
    DROP SEQUENCE seq_request_id;
-- GO
CREATE SEQUENCE seq_request_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_site_request_id')
    DROP SEQUENCE seq_site_request_id;
-- GO
CREATE SEQUENCE seq_site_request_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_request_validation_id')
    DROP SEQUENCE seq_request_validation_id;
-- GO
CREATE SEQUENCE seq_request_validation_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_job_attribution_id')
    DROP SEQUENCE seq_job_attribution_id;
-- GO
CREATE SEQUENCE seq_job_attribution_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_job_validation_id')
    DROP SEQUENCE seq_job_validation_id;
-- GO
CREATE SEQUENCE seq_job_validation_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_job_formation_id')
    DROP SEQUENCE seq_job_formation_id;
-- GO
CREATE SEQUENCE seq_job_formation_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_job_experience_id')
    DROP SEQUENCE seq_job_experience_id;
-- GO
CREATE SEQUENCE seq_job_experience_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_job_soft_skill_id')
    DROP SEQUENCE seq_job_soft_skill_id;
-- GO
CREATE SEQUENCE seq_job_soft_skill_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_skill_id')
    DROP SEQUENCE seq_skill_id;
-- GO
CREATE SEQUENCE seq_skill_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_candidature_id')
    DROP SEQUENCE seq_candidature_id;
-- GO
CREATE SEQUENCE seq_candidature_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_evaluation_id')
    DROP SEQUENCE seq_evaluation_id;
-- GO
CREATE SEQUENCE seq_evaluation_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_comment_id')
    DROP SEQUENCE seq_comment_id;
-- GO
CREATE SEQUENCE seq_comment_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
-- GO


IF EXISTS (SELECT * FROM sys.sequences WHERE name = 'seq_requests_per_validator_id')
    DROP SEQUENCE seq_requests_per_validator_id;
-- GO
CREATE SEQUENCE seq_requests_per_validator_id
    AS INT
    START WITH 1
    INCREMENT BY 1
    MINVALUE 1
    NO CYCLE
    CACHE 50;
