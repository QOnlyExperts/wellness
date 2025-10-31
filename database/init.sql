-- ================================================
-- PostgreSQL Schema Conversion
-- ================================================

CREATE SCHEMA IF NOT EXISTS mydb;
SET search_path TO mydb;

-- ================================================
-- ENUM TYPES
-- ================================================
CREATE TYPE status_enum AS ENUM ('available', 'borrowed', 'retired', 'maintenance');
CREATE TYPE condition_enum AS ENUM ('new');
CREATE TYPE request_status_enum AS ENUM ('requested', 'refused', 'accepted', 'finished');
CREATE TYPE login_status_enum AS ENUM ('success', 'failed');

-- ================================================
-- TABLES
-- ================================================

CREATE TABLE programs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  cod VARCHAR(45) NOT NULL,
  facult VARCHAR(45) NOT NULL,
  status BOOLEAN NOT NULL,
  date TIMESTAMP NOT NULL
);

CREATE TABLE info_persons (
  id SERIAL PRIMARY KEY,
  name1 VARCHAR(45) NOT NULL,
  name2 VARCHAR(45) NOT NULL,
  last_name1 VARCHAR(45) NOT NULL,
  last_name2 VARCHAR(45) NOT NULL,
  identification VARCHAR(10) UNIQUE NOT NULL,
  program_id INT NOT NULL REFERENCES programs(id)
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL,
  status BOOLEAN NOT NULL
);

CREATE TABLE logins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  salt VARCHAR(255) NOT NULL,
  is_verified BOOLEAN NOT NULL,
  is_active BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  last_login TIMESTAMP NOT NULL,
  info_person_id INT NOT NULL REFERENCES info_persons(id),
  rol_id INT NOT NULL REFERENCES roles(id)
);

CREATE TABLE phones (
  id SERIAL PRIMARY KEY,
  number BIGINT NOT NULL,
  info_person_id INT NOT NULL REFERENCES info_persons(id)
);

CREATE TABLE logs_logins (
  id SERIAL PRIMARY KEY,
  username_input VARCHAR(50),
  ip_address VARCHAR(45),
  user_agent TEXT,
  status login_status_enum,
  reason VARCHAR(255),
  created_at TIMESTAMP,
  login_id INT NOT NULL REFERENCES logins(id)
);

CREATE TABLE group_implements (
  id SERIAL PRIMARY KEY,
  prefix VARCHAR(45) NOT NULL,
  name VARCHAR(45) NOT NULL,
  max_hours INT NOT NULL,
  time_limit INT NOT NULL
);

CREATE TABLE update_infos (
  id SERIAL PRIMARY KEY,
  field VARCHAR(45) UNIQUE NOT NULL,
  text_field VARCHAR(45) NOT NULL,
  reason VARCHAR(45) NOT NULL,
  to_update BOOLEAN NOT NULL,
  info_person_id INT NOT NULL REFERENCES info_persons(id)
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45),
  description TEXT
);



CREATE TABLE implements (
  id SERIAL PRIMARY KEY,
  cod VARCHAR(45) NOT NULL,
  status status_enum NOT NULL,
  condition condition_enum NOT NULL,
  group_implement_id INT NOT NULL REFERENCES group_implements(id),
  categories_id INT NOT NULL REFERENCES categories(id)
);

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- para usar gen_random_uuid()

CREATE TABLE imgs (
  id SERIAL PRIMARY KEY,                      -- identificador interno
  file_name UUID NOT NULL DEFAULT gen_random_uuid(), -- nombre único automático
  file_path TEXT NOT NULL,                    -- ruta donde se guarda el archivo
  mime_type VARCHAR(50) NOT NULL,
  size_bytes BIGINT,
  description TEXT,
  implement_id INT REFERENCES implements(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  uploaded_by INT REFERENCES logins(id)
);

CREATE TABLE requests (
  id SERIAL PRIMARY KEY,
  status request_status_enum NOT NULL,
  created_at TIMESTAMP NOT NULL,
  finished_at TIMESTAMP,
  info_person_id INT NOT NULL REFERENCES info_persons(id),
  implement_id INT NOT NULL REFERENCES implements(id)
);

CREATE TABLE interfaces (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  route VARCHAR(150) NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL
);

CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE roles_permissions (
  id SERIAL PRIMARY KEY,
  is_permissioned BOOLEAN NOT NULL,
  created_at TIMESTAMP NOT NULL,
  roles_id INT NOT NULL REFERENCES roles(id),
  interfaces_id INT NOT NULL REFERENCES interfaces(id),
  permissions_id INT NOT NULL REFERENCES permissions(id)
);

CREATE TABLE audits (
  id SERIAL PRIMARY KEY,
  module VARCHAR(45),
  action VARCHAR(45),
  description TEXT,
  location VARCHAR(45),
  created_at TIMESTAMP,
  result_action VARCHAR(50),
  logins_id INT NOT NULL REFERENCES logins(id)
);
