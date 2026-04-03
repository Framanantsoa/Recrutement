-- -----------------------------
--  Demande de recrutement
-- -----------------------------
CREATE TABLE replacement_reasons(
   replacement_reason_id VARCHAR(50) NOT NULL,
   reason_name VARCHAR(70)  NOT NULL,
   is_deleted BIT DEFAULT 0,
   PRIMARY KEY(replacement_reason_id)
);
 
CREATE TABLE requests_status(
   status_id VARCHAR(50) NOT NULL,
   status_name VARCHAR(50)  NOT NULL,
   PRIMARY KEY(status_id)
);
 
CREATE TABLE recruitment_requests(
   request_id VARCHAR(50) NOT NULL,
   post_name VARCHAR(70)  NOT NULL,
   effective SMALLINT NOT NULL,
   month_duration SMALLINT,
   contract_precision VARCHAR(70),
   is_replacement BIT NOT NULL,
   replacement_date DATE,
   begining_date DATE NOT NULL,
   is_deleted BIT NOT NULL DEFAULT 0,
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   applicant_user_id VARCHAR(250) NOT NULL,
   functional_manager_id VARCHAR(250) NOT NULL,
   hierarchical_manager_id VARCHAR(250) NOT NULL,
   replacement_reason_id VARCHAR(50),
   reason_precision VARCHAR(70),
   contract_type_id VARCHAR(50),
   last_titular_user VARCHAR(250),
   is_planned BIT,
   not_planned_reason VARCHAR(70),
   last_status VARCHAR(50),
   PRIMARY KEY(request_id),
   FOREIGN KEY(applicant_user_id) REFERENCES users(user_id),
   FOREIGN KEY(functional_manager_id) REFERENCES users(user_id),
   FOREIGN KEY(hierarchical_manager_id) REFERENCES users(user_id),
   FOREIGN KEY(replacement_reason_id) REFERENCES replacement_reasons(replacement_reason_id),
   FOREIGN KEY(contract_type_id) REFERENCES contract_types(contract_type_id),
   FOREIGN KEY(last_titular_user) REFERENCES users(user_id)
);

CREATE TABLE sites_requests(
   id_site_request VARCHAR(50) NOT NULL,
   site_id VARCHAR(50) NOT NULL,
   request_id VARCHAR(50) NOT NULL,
   PRIMARY KEY(id_site_request),
   FOREIGN KEY(site_id) REFERENCES site(site_id),
   FOREIGN KEY(request_id) REFERENCES recruitment_requests(request_id)
);
 
CREATE TABLE requests_validations(
   request_validation_id VARCHAR(50) NOT NULL,
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   comments VARCHAR(max),
   user_id VARCHAR(250) NOT NULL,
   status_id VARCHAR(50) NOT NULL,
   request_id VARCHAR(50) NOT NULL,
   PRIMARY KEY(request_validation_id),
   FOREIGN KEY(user_id) REFERENCES users(user_id),
   FOREIGN KEY(status_id) REFERENCES requests_status(status_id),
   FOREIGN KEY(request_id) REFERENCES recruitment_requests(request_id)
);

CREATE TABLE requests_per_validators(
   requests_per_validator_id VARCHAR(50) NOT NULL,
   request_id VARCHAR(50) NOT NULL,
   validator_id VARCHAR(250) NOT NULL,
   is_validated BIT NOT NULL DEFAULT 0,
   PRIMARY KEY(requests_per_validator_id),
   FOREIGN KEY(request_id) REFERENCES recruitment_requests(request_id),
   FOREIGN KEY(validator_id) REFERENCES users(user_id)
);

-- -----------------------------
--  TDR
-- -----------------------------
CREATE TABLE job_descriptions_status(
   status_id VARCHAR(50) NOT NULL,
   status_name VARCHAR(50)  NOT NULL,
   PRIMARY KEY(status_id)
);

CREATE TABLE posts_types(
   post_type_id VARCHAR(50) NOT NULL,
   post_type_name VARCHAR(50)  NOT NULL,
   is_deleted BIT NOT NULL DEFAULT 0,
   PRIMARY KEY(post_type_id)
);

CREATE TABLE job_descriptions(
   job_description_id VARCHAR(50) NOT NULL,
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   mission VARCHAR(1000) NOT NULL,
   request_id VARCHAR(50) NOT NULL,
   PRIMARY KEY(job_description_id),
   UNIQUE(request_id),
   FOREIGN KEY(request_id) REFERENCES recruitment_requests(request_id)
);

CREATE TABLE job_attributions(
   job_attribution_id VARCHAR(50) NOT NULL,
   job_attribution VARCHAR(1000)  NOT NULL,
   job_description_id VARCHAR(50) NOT NULL,
   PRIMARY KEY(job_attribution_id),
   FOREIGN KEY(job_description_id) REFERENCES job_descriptions(job_description_id)
);
 
CREATE TABLE job_validations(
   job_validation_id VARCHAR(50) NOT NULL,
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   user_id VARCHAR(250) NOT NULL,
   status_id VARCHAR(50) NOT NULL,
   job_description_id VARCHAR(50) NOT NULL,
   PRIMARY KEY(job_validation_id),
   FOREIGN KEY(user_id) REFERENCES users(user_id),
   FOREIGN KEY(status_id) REFERENCES job_descriptions_status(status_id),
   FOREIGN KEY(job_description_id) REFERENCES job_descriptions(job_description_id)
);
 
CREATE TABLE job_formations(
   job_formation_id VARCHAR(50) NOT NULL,
   job_formation VARCHAR(1000) NOT NULL,
   job_description_id VARCHAR(50) NOT NULL,
   PRIMARY KEY(job_formation_id),
   FOREIGN KEY(job_description_id) REFERENCES job_descriptions(job_description_id)
);
 
CREATE TABLE job_experiences(
   job_experience_id VARCHAR(50) NOT NULL,
   job_experience_years SMALLINT NOT NULL DEFAULT 0,
   job_experience_post VARCHAR(1000)  NOT NULL,
   job_description_id VARCHAR(50) NOT NULL,
   PRIMARY KEY(job_experience_id),
   FOREIGN KEY(job_description_id) REFERENCES job_descriptions(job_description_id)
);
 
CREATE TABLE job_soft_skills(
   job_soft_skill_id VARCHAR(50) NOT NULL,
   job_description_id VARCHAR(50) NOT NULL,
   soft_skill VARCHAR(1000) NOT NULL,
   PRIMARY KEY(job_soft_skill_id),
   FOREIGN KEY(job_description_id) REFERENCES job_descriptions(job_description_id)
);
 
CREATE TABLE job_skills(
   job_skill_id VARCHAR(50) NOT NULL,
   job_description_id VARCHAR(50) NOT NULL,
   skill VARCHAR(1000) NOT NULL,
   PRIMARY KEY(job_skill_id),
   FOREIGN KEY(job_description_id) REFERENCES job_descriptions(job_description_id)
);

-- -----------------------------
--  Candidatures
-- -----------------------------
CREATE TABLE level_educations(
   level_education_id VARCHAR(50) NOT NULL,
   level_education_name VARCHAR(50)  NOT NULL,
   PRIMARY KEY(level_education_id)
);

CREATE TABLE langages(
   langage_id VARCHAR(50) NOT NULL,
   langage_name VARCHAR(50)  NOT NULL,
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   PRIMARY KEY(langage_id)
);

CREATE TABLE speaking_levels(
   speaking_level_id VARCHAR(50) NOT NULL,
   speaking_level_code VARCHAR(5)  NOT NULL,
   speaking_level_name VARCHAR(50)  NOT NULL,
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   PRIMARY KEY(speaking_level_id)
);

CREATE TABLE langages_speakings(
   langage_speaking_id VARCHAR(50) NOT NULL,
   langage_id VARCHAR(50) NOT NULL,
   speaking_level_id VARCHAR(50),
   PRIMARY KEY(langage_speaking_id),
   FOREIGN KEY(langage_id) REFERENCES langages(langage_id),
   FOREIGN KEY(speaking_level_id) REFERENCES speaking_levels(speaking_level_id)
);

CREATE TABLE preselection_criteria(
   preselection_criteria_id VARCHAR(50) NOT NULL,
   criteria VARCHAR(max) NOT NULL,
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   PRIMARY KEY(preselection_criteria_id)
);

CREATE TABLE job_criteria (
   job_criteria_id VARCHAR(50) NOT NULL,
   job_description_id VARCHAR(50) NOT NULL,
   preselection_criteria_id VARCHAR(50) NOT NULL,
   max_points DECIMAL(5,2) NOT NULL CHECK (max_points > 0 AND max_points <= 100),
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   PRIMARY KEY(job_criteria_id),
   FOREIGN KEY(job_description_id) REFERENCES job_descriptions(job_description_id),
   FOREIGN KEY(preselection_criteria_id) REFERENCES preselection_criteria(preselection_criteria_id),
   UNIQUE(job_description_id, preselection_criteria_id)
);

-- Les 5 critères
CREATE TABLE job_criteria_formations(
   id VARCHAR(50) NOT NULL,
   job_criteria_id VARCHAR(50) NOT NULL,
   points DECIMAL(5,2) NOT NULL CHECK (points >= 0 AND points <= 100),
   PRIMARY KEY(id),
   FOREIGN KEY(job_criteria_id) REFERENCES job_criteria(job_criteria_id)
);

CREATE TABLE job_criteria_experiences(
   id VARCHAR(50) NOT NULL,
   job_criteria_id VARCHAR(50) NOT NULL,
   min_year SMALLINT NOT NULL,
   max_year SMALLINT NOT NULL,
   points DECIMAL(5,2) NOT NULL CHECK (points >= 0 AND points <= 100),
   PRIMARY KEY(id),
   FOREIGN KEY(job_criteria_id) REFERENCES job_criteria(job_criteria_id),
   CHECK (min_year <= max_year)
);

CREATE TABLE job_criteria_level_educations(
   id VARCHAR(50) NOT NULL,
   job_criteria_id VARCHAR(50) NOT NULL,
   level_education_id VARCHAR(50) NOT NULL,
   points DECIMAL(5,2) NOT NULL CHECK (points >= 0 AND points <= 100),
   PRIMARY KEY(id),
   FOREIGN KEY(job_criteria_id) REFERENCES job_criteria(job_criteria_id),
   FOREIGN KEY(level_education_id) REFERENCES level_educations(level_education_id),
   UNIQUE(job_criteria_id, level_education_id)
);

CREATE TABLE job_criteria_presentations(
   id VARCHAR(50) NOT NULL,
   job_criteria_id VARCHAR(50) NOT NULL,
   points DECIMAL(5,2) NOT NULL CHECK (points >= 0 AND points <= 100),
   PRIMARY KEY(id),
   FOREIGN KEY(job_criteria_id) REFERENCES job_criteria(job_criteria_id)
);

CREATE TABLE job_criteria_speakings(
   id VARCHAR(50) NOT NULL,
   job_criteria_id VARCHAR(50) NOT NULL,
   langage_speaking_id VARCHAR(50) NOT NULL,
   points DECIMAL(5,2) NOT NULL CHECK (points >= 0 AND points <= 100),
   PRIMARY KEY(id),
   FOREIGN KEY(job_criteria_id) REFERENCES job_criteria(job_criteria_id),
   FOREIGN KEY(langage_speaking_id) REFERENCES langages_speakings(langage_speaking_id),
   UNIQUE(job_criteria_id, langage_speaking_id)
);

CREATE TABLE candidatures(
   candidature_id VARCHAR(50) NOT NULL,
   first_name VARCHAR(50)  NOT NULL,
   last_name VARCHAR(50)  NOT NULL,
   email_contact VARCHAR(50)  NOT NULL,
   cv_url VARCHAR(150),
   lm_url VARCHAR(150),
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   job_description_id VARCHAR(50) NOT NULL,
   is_treated BIT NOT NULL DEFAULT 0,
   treated_at  DATETIME2,
   is_preselected BIT,
   PRIMARY KEY(candidature_id),
   FOREIGN KEY(job_description_id) REFERENCES job_descriptions(job_description_id)
);

CREATE TABLE candidatures_formations(
   candidature_formation_id VARCHAR(50) NOT NULL,
   candidature_id VARCHAR(50) NOT NULL,
   formation VARCHAR(max) NOT NULL,
   PRIMARY KEY(candidature_formation_id),
   FOREIGN KEY(candidature_id) REFERENCES candidatures(candidature_id)
);

CREATE TABLE candidatures_comments(
   comment_id VARCHAR(50) NOT NULL,
   comment VARCHAR(max) NOT NULL,
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   user_id VARCHAR(250) NOT NULL,
   candidature_id VARCHAR(50) NOT NULL,
   is_deleted BIT NOT NULL DEFAULT 0, 
   deleted_at DATETIME2,
   PRIMARY KEY(comment_id),
   FOREIGN KEY(user_id) REFERENCES users(user_id),
   FOREIGN KEY(candidature_id) REFERENCES candidatures(candidature_id)
);

CREATE TABLE candidatures_details(
   candidature_detail_id VARCHAR(50) NOT NULL,
   candidature_id VARCHAR(50) NOT NULL,
   level_education_id VARCHAR(50) NOT NULL,
   years_of_experience SMALLINT NOT NULL DEFAULT 0,
   PRIMARY KEY(candidature_detail_id),
   FOREIGN KEY(candidature_id) REFERENCES candidatures(candidature_id),
   FOREIGN KEY(level_education_id) REFERENCES level_educations(level_education_id)
);

CREATE TABLE candidatures_langages(
   candidature_langage_id VARCHAR(50) NOT NULL,
   candidature_detail_id VARCHAR(50) NOT NULL,
   langage_speaking_id VARCHAR(50) NOT NULL,
   PRIMARY KEY(candidature_langage_id),
   FOREIGN KEY(candidature_detail_id) REFERENCES candidatures_details(candidature_detail_id),
   FOREIGN KEY(langage_speaking_id) REFERENCES langages_speakings(langage_speaking_id)
);

CREATE TABLE candidatures_scores (
   candidature_score_id VARCHAR(50) NOT NULL,
   candidature_id VARCHAR(50) NOT NULL,
   job_criteria_id VARCHAR(50) NOT NULL,
   points DECIMAL(5,2) NOT NULL,
   PRIMARY KEY(candidature_score_id),
   FOREIGN KEY(candidature_id) REFERENCES candidatures(candidature_id),
   FOREIGN KEY(job_criteria_id) REFERENCES job_criteria(job_criteria_id)
);

-- -----------------------------
-- Entretiens
-- -----------------------------
CREATE TABLE planifications(
   planification_id VARCHAR(50) NOT NULL,
   candidature_id VARCHAR(50) NOT NULL,
   planified_datetime DATETIME2,
   validator_id VARCHAR(250) NOT NULL,
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   PRIMARY KEY(planification_id),
   FOREIGN KEY(validator_id) REFERENCES users(user_id),
   FOREIGN KEY(candidature_id) REFERENCES candidatures(candidature_id)
);

CREATE TABLE job_interviews(
   job_interview_id VARCHAR(50) NOT NULL,
   job_interview_datetime DATETIME2 NOT NULL,
   planification_id VARCHAR(50) NOT NULL,
   is_done BIT NOT NULL DEFAULT 0,
   done_at DATETIME2,
   created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
   updated_at DATETIME2,
   PRIMARY KEY(job_interview_id),
   FOREIGN KEY(planification_id) REFERENCES planifications(planification_id)
);

-- -------------------------------
--  Séquences métier
-- -------------------------------
CREATE TABLE business_sequences (
   sequence_key NVARCHAR(100) PRIMARY KEY,
   current_value INT NOT NULL,
   updated_at DATETIME2 NOT NULL
);
GO

-- =============================
-- FUNCTIONS
-- =============================
CREATE FUNCTION dbo.fn_pending_recruitment_requests ( 
   @validator_id NVARCHAR(50) 
) 
RETURNS TABLE AS RETURN 
( 
   WITH ranked_validators AS ( 
      SELECT rpv.*, ROW_NUMBER() OVER (
         PARTITION BY rpv.request_id ORDER BY rpv.requests_per_validator_id 
      ) 
      AS v_order 
      FROM requests_per_validators rpv 
      WHERE rpv.is_validated = 0 
   ) 
   SELECT rv.* FROM ranked_validators rv 
   WHERE rv.validator_id = @validator_id AND NOT EXISTS ( 
      SELECT 1 FROM ranked_validators p 
      WHERE p.request_id = rv.request_id AND p.v_order < rv.v_order 
   )
);
GO
