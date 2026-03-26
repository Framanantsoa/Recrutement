CREATE TABLE genders(
   gender_id VARCHAR(50),
   code VARCHAR(50) NOT NULL,
   label VARCHAR(50) NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME,
   PRIMARY KEY(gender_id),
   UNIQUE(code)
);

CREATE TABLE employee_categories(
   employee_category_id VARCHAR(50),
   code VARCHAR(50) NOT NULL,
   label VARCHAR(50) NOT NULL,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME,
   PRIMARY KEY(employee_category_id),
   UNIQUE(code)
);



CREATE TABLE employees(
   employee_id VARCHAR(50),
   employee_code VARCHAR(50),
   last_name VARCHAR(50) NOT NULL,
   first_name VARCHAR(100),
   birth_date DATE,
   birth_place VARCHAR(100),
   category VARCHAR(50),
   id_number VARCHAR(50),
   id_issue_date DATE,
   id_issue_place VARCHAR(100),
   phone_number VARCHAR(20) NULL,
   hire_date DATE,
   job_title VARCHAR(100) NULL,
   contract_end_date DATE NULL,
   status VARCHAR(50) DEFAULT 'Active',
   site_id VARCHAR(50) NOT NULL,
   gender_id VARCHAR(50) NOT NULL,
   contract_type_id VARCHAR(50) NULL,
   direction_id VARCHAR(50) NOT NULL,
   department_id VARCHAR(50),
   service_id VARCHAR(50),
   unit_id VARCHAR(50),
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME,
   PRIMARY KEY(employee_id),
   UNIQUE(employee_code),
   FOREIGN KEY(site_id) REFERENCES site(site_id),
   FOREIGN KEY(gender_id) REFERENCES genders(gender_id),
   FOREIGN KEY(contract_type_id) REFERENCES contract_types(contract_type_id),
   FOREIGN KEY(direction_id) REFERENCES direction(direction_id),
   FOREIGN KEY(department_id) REFERENCES department(department_id),
   FOREIGN KEY(service_id) REFERENCES service(service_id),
   FOREIGN KEY(unit_id) REFERENCES units(unit_id)
);


CREATE TABLE categories_of_employee(
   employee_id VARCHAR(50),
   employee_category_id VARCHAR(50),
   created_at DATE,
   updated_at DATE,
   PRIMARY KEY(employee_id, employee_category_id),
   FOREIGN KEY(employee_id) REFERENCES employees(employee_id),
   FOREIGN KEY(employee_category_id) REFERENCES employee_categories(employee_category_id)
);

CREATE TABLE user_availability (
    user_id VARCHAR(250) PRIMARY KEY,
    status VARCHAR(20) NOT NULL DEFAULT 'disponible' CHECK (status IN ('disponible', 'absent')),
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE validators_flow (
    validator_id VARCHAR(50) PRIMARY KEY,
    validator_type VARCHAR(50) NOT NULL,
    user_id VARCHAR(250) NOT NULL,
    department VARCHAR(50) NOT NULL,
    backup_order INT DEFAULT 0,
    superior_id VARCHAR(250),
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (superior_id) REFERENCES users(user_id)
);

-- ============================
-- NOTIFICATIONS
-- ============================

CREATE TABLE notifications (
   notification_id VARCHAR(50),
   title VARCHAR(255) NOT NULL, 
   message TEXT NOT NULL, 
   type VARCHAR(50) NOT NULL,
   status VARCHAR(50) DEFAULT 'pending',
   related_table VARCHAR(255), 
   related_menu VARCHAR(100),
   related_id VARCHAR(50), 
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME,
   priority INT DEFAULT 1,
   PRIMARY KEY(notification_id)
);

CREATE TABLE notification_recipients (
   notification_id VARCHAR(50),
   user_id VARCHAR(250),
   status VARCHAR(50) DEFAULT 'pending',
   sent_at DATETIME, 
   read_at DATETIME,
   created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
   updated_at DATETIME,
   PRIMARY KEY(notification_id, user_id),
   FOREIGN KEY(notification_id) REFERENCES notifications(notification_id),
   FOREIGN KEY(user_id) REFERENCES users(user_id)
);


CREATE TABLE tmp_employee(
   tmp_employee_id VARCHAR(250) PRIMARY KEY,
   site VARCHAR(50),
   mle VARCHAR(50),
   nom VARCHAR(100),
   prenom VARCHAR(100),
   date_naissance DATE,
   lieu_naissance VARCHAR(100),
   numero_cin VARCHAR(50),
   date_cin DATE,
   lieu_cin VARCHAR(100),
   sexe VARCHAR(50),
   nationalite VARCHAR(50),
   telephone VARCHAR(20),
   date_anciennete DATE,
   type_contrat VARCHAR(50),
   intitule_poste VARCHAR(100),
   categorie VARCHAR(50),
   unite VARCHAR(100),
   service VARCHAR(100),
   department VARCHAR(100),
   direction VARCHAR(100),
   date_fin_contrat DATE
);

