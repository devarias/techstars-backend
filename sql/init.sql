-- CREATE USER api_admin WITH LOGIN PASSWORD 'ts';
-- ALTER USER api_admin CREATEDB;
-- SET ROLE api_admin;
-- CREATE DATABASE ts_api;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE mentors (
	mentor_id uuid DEFAULT uuid_generate_v4(),
	mentor VARCHAR NOT NULL CHECK (mentor <> ''),
	email VARCHAR NOT NULL CHECK (email <> ''),
	PRIMARY KEY (mentor_id)
);

--Can be replaced by POST with JSON--
-- INSERT INTO mentors (
--     mentor,
--     email
-- )
-- VALUES
--     (
--         'John Smith',
--         'john.smith@example.com'
--     ),
--     (
--         'Jane Maclaren',
--         'jane.maclaren@example.com'
--     ),
--     (
--         'Alex Quintero',
--         'alex.quintero@example.com'
--     );
-- GRANT SELECT ON mentors TO api_admin;
-- GRANT INSERT ON mentors TO api_admin;
-- GRANT DELETE ON mentors TO api_admin;
-- GRANT UPDATE ON mentors TO api_admin;
CREATE TABLE companies (
    company_id uuid DEFAULT uuid_generate_v4(),
    company VARCHAR NOT NULL CHECK (company <> ''),
    email VARCHAR NOT NULL CHECK (email <> ''),
    PRIMARY KEY (company_id)
);
-- INSERT INTO companies (company, email)
-- VALUES
--     ('ABG', 'abg@gmail.com'),
--     ('Tech', 'tech@gmail.com'),
--     ('BigCom', 'bigc@gmail.com');
-- GRANT SELECT ON companies TO api_admin;
-- GRANT INSERT ON companies TO api_admin;
-- GRANT DELETE ON companies TO api_admin;
-- GRANT UPDATE ON companies TO api_admin;
-- GRANT ALL PRIVILEGES ON DATABASE ts_admin TO api_admin;

CREATE TABLE mentor_survey (
    survey_id uuid DEFAULT uuid_generate_v4(),
    vote INTEGER,
    feedback TEXT,
    ranking INTEGER,
    --preference INTEGER,
    PRIMARY KEY (survey_id),
    mentor_id uuid REFERENCES mentors(mentor_id),
    company_id uuid REFERENCES companies(company_id)
);

-- GRANT SELECT ON mentor_survey TO api_admin;
-- GRANT INSERT ON mentor_survey TO api_admin;
-- GRANT DELETE ON mentor_survey TO api_admin;
-- GRANT UPDATE ON mentor_survey TO api_admin;

CREATE TABLE company_survey (
    survey_id uuid DEFAULT uuid_generate_v4(),
    vote INTEGER,
    feedback TEXT,
    ranking INTEGER,
    --preference INTEGER,
    PRIMARY KEY (survey_id),
    mentor_id uuid REFERENCES mentors(mentor_id),
    company_id uuid REFERENCES companies(company_id)
);
CREATE TABLE IF NOT EXISTS days (
    day_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    day varchar(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS blocks (
    block_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    block varchar(10) NOT NULL
);

-- CREATE TABLE IF NOT EXISTS companies (
--     company_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
--     company varchar(100) NOT NULL,
--     email varchar(100)
-- );

CREATE TABLE IF NOT EXISTS slots (
    slot_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    slot time(0) NOT NULL
);

-- CREATE TABLE IF NOT EXISTS mentors (
--     mentor_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
--     mentor varchar(100) NOT NULL,
--     email varchar(100)
-- );

CREATE TABLE IF NOT EXISTS schedule (
    meet_id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    mentor_id uuid REFERENCES mentors ON DELETE CASCADE ON UPDATE CASCADE,
    day_id uuid REFERENCES days ON DELETE CASCADE ON UPDATE CASCADE,
    block_id uuid REFERENCES blocks ON DELETE CASCADE ON UPDATE CASCADE,
    company_id uuid REFERENCES companies ON DELETE CASCADE ON UPDATE CASCADE,
    slot_id uuid REFERENCES slots ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

INSERT INTO days (day)
VALUES
    ('Monday'),
    ('Tuesday'),
    ('Wednesday'),
    ('Thursday'),
    ('Friday');

INSERT INTO blocks (block)
VALUES
    ('AM'),
    ('PM');

INSERT INTO slots (slot)
VALUES
    ('08:00:00'),
    ('08:20:00'),
    ('08:40:00'),
    ('09:00:00'),
    ('09:20:00'),
    ('09:40:00'),
    ('10:00:00'),
    ('10:20:00'),
    ('10:40:00'),
    ('11:00:00'),
    ('11:20:00'),
    ('11:40:00'),
    ('13:10:00'),
    ('13:30:00'),
    ('13:50:00'),
    ('14:10:00'),
    ('14:30:00'),
    ('14:50:00'),
    ('15:10:00'),
    ('15:30:00'),
    ('15:50:00'),
    ('16:10:00'),
    ('16:30:00'),
    ('16:50:00');
