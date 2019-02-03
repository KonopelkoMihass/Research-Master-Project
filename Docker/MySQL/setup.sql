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
  `password` VARCHAR(128) NOT NULL,
  `role` VARCHAR(32) NOT NULL,
  `std_internalisation` MEDIUMTEXT,
  `gamification` VARCHAR(1) NOT NULL,

  `got_instruction_emails` VARCHAR(255),
  `std_internalisation_changes` MEDIUMTEXT,
  `focus` MEDIUMTEXT,
  `challenge_mode_only` VARCHAR(1) NOT NULL,
  `challenge_performance` MEDIUMTEXT,


  PRIMARY KEY (`id`));

CREATE UNIQUE INDEX `email_UNIQUE` ON `ProjectOrganiser`.`Users` (`email` ASC);

-- creating dummy teacher

INSERT INTO ProjectOrganiser.Users (email, team_name, name, surname, noun, password, role, std_internalisation,
                                    gamification, `challenge_mode_only`, got_instruction_emails, std_internalisation_changes, focus )
VALUES ('c00157576@itcarlow.ie','teacher','Mihass','Konopelko','Potato','22021993','teacher', '{}', '0', 'y', '{}', '{}', '{}'),
  ('w','1','w','w','Bed','w','student', '{}', 'y', 'y', '{}', '{}', '{}'),
  ('e','1','e','e','Chair','e','student', '{}', 'y', 'y', '{}', '{}', '{}'),
  ('r','2','r','r','Pizza','r','student', '{}', 'n', 'y', '{}', '{}', '{}'),
  ('t','2','t','t','Grass','t','student', '{}', 'n', 'y', '{}', '{}', '{}'),
  ('p','3','p','p','Hay','p','student', '{}', 'r', 'y', '{}', '{}', '{}');


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
  `standard_used` VARCHAR(32) NOT NULL,
  `language` VARCHAR(16) NOT NULL,
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



-- Table `ProjectOrganiser`.`Logs`
CREATE TABLE IF NOT EXISTS `ProjectOrganiser`.`Logs` (
  `user_id` INT NOT NULL ,
  `logs` MEDIUMTEXT);

CREATE UNIQUE INDEX `user_id_UNIQUE` ON `ProjectOrganiser`.`Logs` (`user_id` ASC);

-- Table `ProjectOrganiser`.`Challenges`
CREATE TABLE IF NOT EXISTS `ProjectOrganiser`.`Challenges` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` MEDIUMTEXT NOT NULL,
  `issues` MEDIUMTEXT,
  `average_time_seconds` VARCHAR(6),
  `standard` VARCHAR(64),
  `language` VARCHAR(16),
  `difficulty` VARCHAR(16),
  PRIMARY KEY (`id`));


-- Table `ProjectOrganiser`.`Standards`
CREATE TABLE IF NOT EXISTS `ProjectOrganiser`.`Standards` (
  `category` VARCHAR(126) NOT NULL,
  `sub_category` VARCHAR(126) NOT NULL,
  `description` MEDIUMTEXT,
  `name` VARCHAR(64) NOT NULL,
  `reward_score` INT,
  `penalty_score` INT,
  `enabled` VARCHAR(16),
  `id` INT,
  `unlocked_at_level` INT,
  PRIMARY KEY (`category`, `sub_category`));