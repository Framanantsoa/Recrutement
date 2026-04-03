-- =============================
-- ALTERS
-- =============================
-- Organigram
ALTER TABLE direction
ADD is_active BIT NOT NULL
    CONSTRAINT DF_direction_is_active DEFAULT 1;
GO
ALTER TABLE department
ADD is_active BIT NOT NULL
    CONSTRAINT DF_department_is_active DEFAULT 1;
GO
ALTER TABLE service
ADD is_active BIT NOT NULL
    CONSTRAINT DF_service_is_active DEFAULT 1;
GO

-- Request
ALTER TABLE recruitment_requests
ADD created_by VARCHAR(250) NOT NULL;

ALTER TABLE recruitment_requests
ADD CONSTRAINT FK_recruitment_requests_created_by
FOREIGN KEY (created_by)
REFERENCES users(user_id);
GO
ALTER TABLE recruitment_requests
ALTER COLUMN not_planned_reason VARCHAR(MAX)
GO

-- Job description
ALTER TABLE job_descriptions ADD last_status VARCHAR(50);
GO

ALTER TABLE job_descriptions ADD post_type_id VARCHAR(50) NOT NULL;
GO
ALTER TABLE job_descriptions
ADD CONSTRAINT FK_JobDescriptions_PostTypes
FOREIGN KEY (post_type_id) REFERENCES posts_types(post_type_id);
GO

-- =============================
-- INDEXES
-- =============================
IF EXISTS (
    SELECT 1 
    FROM sys.indexes 
    WHERE name = 'idx_candidatures_preselected_total'
    AND object_id = OBJECT_ID('candidatures')
)
BEGIN
    DROP INDEX idx_candidatures_preselected_total ON candidatures;
END

CREATE INDEX idx_candidatures_preselected_total
ON candidatures(is_preselected)
INCLUDE(created_at);
