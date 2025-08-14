-- Create database tables for PetClinic

CREATE TABLE IF NOT EXISTS types (
  id   INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80)
);

CREATE INDEX IF NOT EXISTS types_name ON types (name);

CREATE TABLE IF NOT EXISTS specialties (
  id   INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(80)
);

CREATE INDEX IF NOT EXISTS specialties_name ON specialties (name);

CREATE TABLE IF NOT EXISTS vets (
  id         INTEGER PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name  VARCHAR(30)
);

CREATE INDEX IF NOT EXISTS vets_last_name ON vets (last_name);

CREATE TABLE IF NOT EXISTS vet_specialties (
  vet_id       INTEGER NOT NULL,
  specialty_id INTEGER NOT NULL
);

ALTER TABLE vet_specialties ADD CONSTRAINT IF NOT EXISTS fk_vet_specialties_vets FOREIGN KEY (vet_id) REFERENCES vets (id);
ALTER TABLE vet_specialties ADD CONSTRAINT IF NOT EXISTS fk_vet_specialties_specialties FOREIGN KEY (specialty_id) REFERENCES specialties (id);

CREATE TABLE IF NOT EXISTS owners (
  id         INTEGER PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name  VARCHAR(30),
  address    VARCHAR(255),
  city       VARCHAR(80),
  telephone  VARCHAR(20)
);

CREATE INDEX IF NOT EXISTS owners_last_name ON owners (last_name);

CREATE TABLE IF NOT EXISTS pets (
  id         INTEGER PRIMARY KEY AUTO_INCREMENT,
  name       VARCHAR(30),
  birth_date DATE,
  type_id    INTEGER NOT NULL,
  owner_id   INTEGER NOT NULL
);

ALTER TABLE pets ADD CONSTRAINT IF NOT EXISTS fk_pets_owners FOREIGN KEY (owner_id) REFERENCES owners (id);
ALTER TABLE pets ADD CONSTRAINT IF NOT EXISTS fk_pets_types FOREIGN KEY (type_id) REFERENCES types (id);

CREATE INDEX IF NOT EXISTS pets_name ON pets (name);

CREATE TABLE IF NOT EXISTS visits (
  id          INTEGER PRIMARY KEY AUTO_INCREMENT,
  pet_id      INTEGER NOT NULL,
  visit_date  DATE,
  description VARCHAR(255)
);

ALTER TABLE visits ADD CONSTRAINT IF NOT EXISTS fk_visits_pets FOREIGN KEY (pet_id) REFERENCES pets (id);