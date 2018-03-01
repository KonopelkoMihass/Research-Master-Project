CREATE DATABASE IF NOT EXISTS MihassGProject;
USE MihassGProject;

-- Table `ProjectOrganiser`.`Users`
CREATE TABLE IF NOT EXISTS `MihassGProject`.`Users` (
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

CREATE UNIQUE INDEX `email_UNIQUE` ON `MihassGProject`.`Users` (`email` ASC);

-- creating dummy teacher
INSERT INTO MihassGProject.Users (email, github_username, github_email, name, surname, noun, password, role)
VALUES ('q','q','q','q','q','q','q','teacher'),  ('w','w','w','w','w','w','w','student') ,  ('e','e','e','e','e','e','e','student'),  ('r','r','r','r','r','r','r','student');


-- Table `ProjectOrganiser`.`Assignments`
CREATE TABLE IF NOT EXISTS `MihassGProject`.`Assignments` (
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

CREATE UNIQUE INDEX `deadline_date_UNIQUE` ON `MihassGProject`.`Assignments` (`name` ASC);

-- Table `ProjectOrganiser`.`Submissions`
CREATE TABLE IF NOT EXISTS `MihassGProject`.`Submissions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `assignment_id` INT NOT NULL,
  `submission_data` MEDIUMTEXT NOT NULL,
  `is_complete` INT NOT NULL,
  `iteration` INT NOT NULL,
  `reviewers_ids` MEDIUMTEXT,
  `feedbacks` MEDIUMTEXT,
  PRIMARY KEY (`id`, `user_id`, `assignment_id`));

