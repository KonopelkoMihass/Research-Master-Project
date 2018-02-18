CREATE DATABASE IF NOT EXISTS ProjectOrganiser;
USE ProjectOrganiser;

-- Table `ProjectOrganiser`.`Users`
CREATE TABLE IF NOT EXISTS `ProjectOrganiser`.`Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `github_username` VARCHAR(45) NOT NULL,
  `github_email` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `surname` VARCHAR(45) NOT NULL,
  `noun` VARCHAR(45) NOT NULL,
  `password` VARCHAR(32) NOT NULL,
  `role` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`id`));

CREATE UNIQUE INDEX `email_UNIQUE` ON `ProjectOrganiser`.`Users` (`email` ASC);

-- creating dummy teacher
INSERT INTO ProjectOrganiser.Users (email, github_username, github_email, name, surname, noun, password, role)
VALUES ('q','q','q','q','q','q','q','teacher'),  ('w','w','w','w','w','w','w','student') ;


-- Table `ProjectOrganiser`.`Assignments`
CREATE TABLE IF NOT EXISTS `ProjectOrganiser`.`Assignments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(63) NOT NULL,
  `deadline_date` VARCHAR(16) NOT NULL,
  `deadline_time` VARCHAR(16) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`));

CREATE UNIQUE INDEX `deadline_date_UNIQUE` ON `ProjectOrganiser`.`Assignments` (`name` ASC);

-- Table `ProjectOrganiser`.`Submissions`
CREATE TABLE IF NOT EXISTS `ProjectOrganiser`.`Submissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(3) NOT NULL,
  `assignment_id` VARCHAR(3) NOT NULL,
  `github_link` VARCHAR(63) NOT NULL,
  PRIMARY KEY (`id`));

