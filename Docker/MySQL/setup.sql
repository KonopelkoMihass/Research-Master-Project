CREATE DATABASE IF NOT EXISTS ProjectOrganiser;
USE ProjectOrganiser;

-- Table `ProjectOrganiser`.`Users`
CREATE TABLE IF NOT EXISTS `ProjectOrganiser`.`Users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `surname` VARCHAR(45) NOT NULL,
  `team_name` VARCHAR(45) NOT NULL,
  `noun` VARCHAR(45) NOT NULL,
  `password` VARCHAR(32) NOT NULL,
  `role` VARCHAR(32) NOT NULL,
  PRIMARY KEY (`id`));

CREATE UNIQUE INDEX `email_UNIQUE` ON `ProjectOrganiser`.`Users` (`email` ASC);

-- creating dummy teacher

INSERT INTO ProjectOrganiser.Users (email, team_name, name, surname, noun, password, role)
VALUES ('q','teacher','John','Doe','Potato','q','teacher'),
  ('w','1','w','w','Bed','w','student'),
  ('e','1','e','e','Chair','e','student'),
  ('r','2','r','r','Pizza','r','student'),
  ('t','2','t','t','Grass','t','student');


-- Table `ProjectOrganiser`.`Assignments`
CREATE TABLE IF NOT EXISTS `ProjectOrganiser`.`Assignments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(63) NOT NULL,
  `deadline_date` VARCHAR(16) NOT NULL,
  `deadline_time` VARCHAR(16) NOT NULL,
  `review_till_date` VARCHAR(16) NOT NULL,
  `review_till_time` VARCHAR(16) NOT NULL,
  `reviewers_amount` INT NOT NULL,
  `status` VARCHAR(32) NOT NULL,
  `description` VARCHAR(255) NOT NULL,

  PRIMARY KEY (`id`));

CREATE UNIQUE INDEX `deadline_date_UNIQUE` ON `ProjectOrganiser`.`Assignments` (`name` ASC);

-- Table `ProjectOrganiser`.`Submissions`
CREATE TABLE IF NOT EXISTS `ProjectOrganiser`.`Submissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `assignment_id` INT NOT NULL,
  `submission_data` MEDIUMTEXT NOT NULL,
  `is_complete` INT NOT NULL,
  `iteration` INT NOT NULL,
  `reviewers_ids` MEDIUMTEXT,
  `feedbacks` MEDIUMTEXT,
  PRIMARY KEY (`id`, `user_id`, `assignment_id`));

-- Table `ProjectOrganiser`.`Standards`
CREATE TABLE IF NOT EXISTS `ProjectOrganiser`.`Standards` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `category` VARCHAR(255),
  `sub_category` VARCHAR(255),
  `description` MEDIUMTEXT,
  PRIMARY KEY (`id`));

CREATE UNIQUE INDEX `deadline_date_UNIQUE` ON `ProjectOrganiser`.`Standards` (`category`, `sub_category` ASC);