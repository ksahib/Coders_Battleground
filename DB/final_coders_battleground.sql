-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 25, 2025 at 01:58 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `final_coders_battleground`
--

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `name` varchar(50) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`name`, `email`, `password`) VALUES
('Admin', 'Admin@gmail.com', 'Admin'),
('Google', 'g@gmail.com', '123'),
('ssa', 'ssa', '123');

-- --------------------------------------------------------

--
-- Table structure for table `company_locations`
--

CREATE TABLE `company_locations` (
  `location_id` varchar(64) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_locations`
--

INSERT INTO `company_locations` (`location_id`, `name`) VALUES
('123', 'Google'),
('124', 'Google'),
('125', 'Google'),
('127', 'ssa');

-- --------------------------------------------------------

--
-- Table structure for table `company_problems`
--

CREATE TABLE `company_problems` (
  `problem_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company_problems`
--

INSERT INTO `company_problems` (`problem_id`, `name`) VALUES
(1, 'Google'),
(1, 'ssa'),
(8, 'Google');

-- --------------------------------------------------------

--
-- Table structure for table `contest`
--

CREATE TABLE `contest` (
  `id` int(50) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `company_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest`
--

INSERT INTO `contest` (`id`, `name`, `company_name`, `description`, `start`, `end`) VALUES
(345, 'Google Code', 'Google', 'jjjjjjjjjjj', '2025-07-14 00:00:00', '2025-07-16 00:00:00'),
(1435424, 'Code Jam', 'Google', 'looooooooooooooooooooooooool', '2025-07-17 00:00:00', '2025-07-26 00:00:00'),
(2782842, 'Coders Battleground Weekly 10', 'Admin', 'ewfef', '2025-07-25 00:00:00', '2025-07-26 00:00:00'),
(7108680, 'First One', 'Admin', 'Welcome', '2025-07-25 00:00:00', '2025-07-26 00:00:00'),
(7799829, 'Coders Battleground Weekly 99', 'Google', 'vefef', '2025-07-26 00:00:00', '2025-07-27 00:00:00'),
(7930236, 'Coders Battleground Weekly 4', 'Admin', 'gd', '2025-07-26 00:00:00', '2025-07-26 00:00:00'),
(9422201, 'Coders Battleground Weekly 1', 'Admin', 'No cheating or using AI', '2025-07-26 00:00:00', '2025-07-27 00:00:00'),
(9570486, 'Coders Battleground Weekly 2', 'Admin', 'Welcome again', '2025-07-26 00:00:00', '2025-07-27 00:00:00'),
(9594785, 'Coders Battleground Weekly 3', 'Admin', 'efw', '2025-07-26 00:00:00', '2025-07-28 00:00:00'),
(530263527, 'nnklj', 'ssa', 'kujgbiugbu', '2025-09-09 00:00:00', '2025-09-09 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `contest_questions`
--

CREATE TABLE `contest_questions` (
  `contest_id` int(50) NOT NULL,
  `problem_id` int(11) NOT NULL,
  `problem_title` varchar(100) DEFAULT NULL,
  `score` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_questions`
--

INSERT INTO `contest_questions` (`contest_id`, `problem_id`, `problem_title`, `score`) VALUES
(345, 1, 'Two Sum Problem', 15),
(1435424, 1, 'Two Sum Problem', 15),
(2782842, 8, 'Sum', 100),
(7108680, 1, 'add', 100),
(7799829, 8, 'Sum', 100),
(7930236, 1, 'Sum', 100),
(9422201, 6, 'Chess Tiles', 100),
(9570486, 1, 'Sum', 100),
(9594785, 1, 'Sum', 100);

-- --------------------------------------------------------

--
-- Table structure for table `contest_rating`
--

CREATE TABLE `contest_rating` (
  `contest_id` int(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `rating_change` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contest_rating`
--

INSERT INTO `contest_rating` (`contest_id`, `email`, `rating_change`) VALUES
(345, 'AdminUser@gmail.com', 15),
(345, 's@gmail.com', 17),
(1435424, 'AdminUser@gmail.com', 23),
(1435424, 's@gmail.com', 83);

-- --------------------------------------------------------

--
-- Table structure for table `interview`
--

CREATE TABLE `interview` (
  `interview_id` int(64) NOT NULL,
  `company_name` varchar(50) NOT NULL,
  `position_open` varchar(100) DEFAULT NULL,
  `location_id` varchar(64) NOT NULL,
  `job_description` varchar(255) DEFAULT NULL,
  `start` date DEFAULT NULL,
  `job_type` varchar(50) DEFAULT 'Full-time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interview`
--

INSERT INTO `interview` (`interview_id`, `company_name`, `position_open`, `location_id`, `job_description`, `start`, `job_type`) VALUES
(1234, 'Google', 'Software Engineer II', '123', 'MERN stack', '2025-07-16', 'Full-time'),
(730095, 'Admin', 'Systems Engineer', '124', 'Variable kinds of work', '2025-07-26', 'Internship'),
(742547, 'Google', 'Sales', '123', 'Sell', '2025-07-28', 'Contract');

-- --------------------------------------------------------

--
-- Table structure for table `interview_apply`
--

CREATE TABLE `interview_apply` (
  `interview_id` int(64) NOT NULL,
  `email` varchar(50) NOT NULL,
  `job_status` varchar(50) DEFAULT 'Applied'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interview_apply`
--

INSERT INTO `interview_apply` (`interview_id`, `email`, `job_status`) VALUES
(1234, 's@gmail.com', 'Applied'),
(730095, 's@gmail.com', 'Applied');

-- --------------------------------------------------------

--
-- Table structure for table `interview_round`
--

CREATE TABLE `interview_round` (
  `round_id` int(11) NOT NULL,
  `interview_id` int(64) NOT NULL,
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `round_name` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `interview_round`
--

INSERT INTO `interview_round` (`round_id`, `interview_id`, `start`, `end`, `round_name`) VALUES
(1, 1234, '2025-07-16 10:00:00', '2025-07-16 11:00:00', 'Technical Round 1'),
(2, 1234, '2025-07-16 14:00:00', '2025-07-16 15:30:00', 'Technical Round 2'),
(3, 1234, '2025-07-17 10:00:00', '2025-07-17 11:00:00', 'HR Round'),
(4, 730095, '2025-07-31 08:27:00', '2025-07-31 09:27:00', 'Behavioral'),
(5, 742547, '2025-07-30 17:55:00', '2025-07-31 17:55:00', 'Behavioral');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `location_id` varchar(64) NOT NULL,
  `area` varchar(100) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`location_id`, `area`, `city`, `country`) VALUES
('123', 'Mountain View', 'California', 'USA'),
('124', 'New York', 'New York', 'USA'),
('125', 'Bangalore', 'Karnataka', 'India'),
('126', 'London', 'Greater London', 'UK'),
('127', 'Dhaka', 'Dhaka', 'Bangladesh');

-- --------------------------------------------------------

--
-- Table structure for table `participants`
--

CREATE TABLE `participants` (
  `email` varchar(50) NOT NULL,
  `contest_id` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `participants`
--

INSERT INTO `participants` (`email`, `contest_id`) VALUES
('s@gmail.com', 345);

-- --------------------------------------------------------

--
-- Table structure for table `points_dist`
--

CREATE TABLE `points_dist` (
  `difficulty` varchar(20) NOT NULL,
  `points` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `points_dist`
--

INSERT INTO `points_dist` (`difficulty`, `points`) VALUES
('Easy', 5),
('Hard', 25),
('Medium', 15);

-- --------------------------------------------------------

--
-- Table structure for table `problems`
--

CREATE TABLE `problems` (
  `problem_id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `difficulty` varchar(20) NOT NULL,
  `input` text DEFAULT NULL,
  `output` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `problems`
--

INSERT INTO `problems` (`problem_id`, `name`, `description`, `difficulty`, `input`, `output`) VALUES
(1, 'two sum', 'Given two arrays of different sizes , try to merge them into a sorted list', 'Medium', 'Two integer arrays nums1 and nums2\nExample: nums1 = [1,3,5], nums2 = [2,4,6]', 'Merged sorted array\nExample: [1,2,3,4,5,6]'),
(2, 'Palindrome Check', 'Check if a given string is a palindrome', 'Easy', 'A string s\nExample: \"racecar\"', 'Boolean true/false\nExample: true'),
(3, 'Binary Tree Max Depth', 'Find the maximum depth of a binary tree', 'Medium', 'Root node of a binary tree', 'Integer representing max depth'),
(4, 'Graph Shortest Path', 'Find shortest path between two nodes in a weighted graph', 'Hard', 'Graph adjacency list and start/end nodes', 'Shortest path distance or -1 if no path exists'),
(5, 'Sum', 'Introduction to coding', 'Easy', '3\n1 1\n2 3\n0 0', '2\n5\n0'),
(6, 'Chess', 'Black and white spaces count', 'Easy', '4\n1\n2\n3\n4', '1\n4\n9\n16'),
(7, 'sum', 'sum all numbers', 'Easy', '3\n1 2 3', '6'),
(8, 'Final', 'Deathmatch', 'Easy', '5\n1 2 3 8 0', '1\n1\n1\n1\nnot valid');

-- --------------------------------------------------------

--
-- Table structure for table `problem_tags`
--

CREATE TABLE `problem_tags` (
  `tag_name` varchar(50) DEFAULT NULL,
  `problem_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `problem_tags`
--

INSERT INTO `problem_tags` (`tag_name`, `problem_id`) VALUES
('array', 1),
('linked list', 1),
('recursion', 1),
('math', 5),
('math', 6),
('math', 7),
('simple', 8);

-- --------------------------------------------------------

--
-- Table structure for table `round_questions`
--

CREATE TABLE `round_questions` (
  `question_id` int(11) NOT NULL,
  `question_name` varchar(200) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `round_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `round_questions`
--

INSERT INTO `round_questions` (`question_id`, `question_name`, `type`, `description`, `round_id`) VALUES
(1, 'Reverse a Linked List', 'Coding', 'Write a function to reverse a singly linked list', 1),
(2, 'System Design', 'Design', 'Design a URL shortening service like bit.ly', 2),
(3, 'Behavioral Questions', 'Behavioral', 'Tell me about a time you faced a challenging situation', 3),
(4, 'Being fired', 'Behavioral', 'What would you do in case of being fired', 4),
(5, 'You\'re fired', 'Behavioral', 'react', 5);

-- --------------------------------------------------------

--
-- Table structure for table `solutions`
--

CREATE TABLE `solutions` (
  `email` varchar(50) NOT NULL,
  `problem_id` int(11) NOT NULL,
  `runtime` double DEFAULT NULL,
  `memory_usage` double DEFAULT NULL,
  `submission_time` datetime DEFAULT current_timestamp(),
  `language` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `solutions`
--

INSERT INTO `solutions` (`email`, `problem_id`, `runtime`, `memory_usage`, `submission_time`, `language`) VALUES
('s@gmail.com', 5, 9.8, 8.9, '2025-07-15 09:15:00', 'C++');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `email` varchar(50) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `subscription_type` varchar(10) DEFAULT 'free',
  `role` varchar(10) DEFAULT 'user',
  `created_at` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`email`, `password`, `name`, `subscription_type`, `role`, `created_at`) VALUES
('AdminUser@gmail.com', 'AdminUser', 'AdminUser', 'free', 'user', '2025-07-25'),
('g@gmail.com', '123', 'Google', 'free', 'company', '2025-07-14'),
('s@gmail.com', 'sss', 'sahib', 'free', 'user', '2025-07-13');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `company_locations`
--
ALTER TABLE `company_locations`
  ADD PRIMARY KEY (`location_id`,`name`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `company_problems`
--
ALTER TABLE `company_problems`
  ADD PRIMARY KEY (`problem_id`,`name`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `contest`
--
ALTER TABLE `contest`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_name` (`company_name`);

--
-- Indexes for table `contest_questions`
--
ALTER TABLE `contest_questions`
  ADD PRIMARY KEY (`contest_id`,`problem_id`),
  ADD KEY `problem_id` (`problem_id`);

--
-- Indexes for table `contest_rating`
--
ALTER TABLE `contest_rating`
  ADD PRIMARY KEY (`contest_id`,`email`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `interview`
--
ALTER TABLE `interview`
  ADD PRIMARY KEY (`interview_id`),
  ADD KEY `company_name` (`company_name`),
  ADD KEY `location_id` (`location_id`);

--
-- Indexes for table `interview_apply`
--
ALTER TABLE `interview_apply`
  ADD PRIMARY KEY (`interview_id`,`email`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `interview_round`
--
ALTER TABLE `interview_round`
  ADD PRIMARY KEY (`round_id`),
  ADD KEY `interview_id` (`interview_id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`location_id`);

--
-- Indexes for table `participants`
--
ALTER TABLE `participants`
  ADD PRIMARY KEY (`email`,`contest_id`),
  ADD KEY `contest_id` (`contest_id`);

--
-- Indexes for table `points_dist`
--
ALTER TABLE `points_dist`
  ADD PRIMARY KEY (`difficulty`);

--
-- Indexes for table `problems`
--
ALTER TABLE `problems`
  ADD PRIMARY KEY (`problem_id`),
  ADD KEY `difficulty` (`difficulty`);

--
-- Indexes for table `problem_tags`
--
ALTER TABLE `problem_tags`
  ADD KEY `problem_id` (`problem_id`),
  ADD KEY `tag_name` (`tag_name`);

--
-- Indexes for table `round_questions`
--
ALTER TABLE `round_questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `round_id` (`round_id`);

--
-- Indexes for table `solutions`
--
ALTER TABLE `solutions`
  ADD PRIMARY KEY (`email`,`problem_id`),
  ADD KEY `email` (`email`),
  ADD KEY `problem_id` (`problem_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `interview_round`
--
ALTER TABLE `interview_round`
  MODIFY `round_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `problems`
--
ALTER TABLE `problems`
  MODIFY `problem_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `round_questions`
--
ALTER TABLE `round_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `company_locations`
--
ALTER TABLE `company_locations`
  ADD CONSTRAINT `company_locations_ibfk_1` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `company_locations_ibfk_2` FOREIGN KEY (`name`) REFERENCES `company` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `company_problems`
--
ALTER TABLE `company_problems`
  ADD CONSTRAINT `company_problems_ibfk_1` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`problem_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `company_problems_ibfk_2` FOREIGN KEY (`name`) REFERENCES `company` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `contest`
--
ALTER TABLE `contest`
  ADD CONSTRAINT `contest_ibfk_1` FOREIGN KEY (`company_name`) REFERENCES `company` (`name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `contest_questions`
--
ALTER TABLE `contest_questions`
  ADD CONSTRAINT `contest_questions_ibfk_1` FOREIGN KEY (`contest_id`) REFERENCES `contest` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contest_questions_ibfk_2` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`problem_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `contest_rating`
--
ALTER TABLE `contest_rating`
  ADD CONSTRAINT `contest_rating_ibfk_1` FOREIGN KEY (`contest_id`) REFERENCES `contest` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `contest_rating_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `interview`
--
ALTER TABLE `interview`
  ADD CONSTRAINT `interview_ibfk_1` FOREIGN KEY (`company_name`) REFERENCES `company` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `interview_ibfk_2` FOREIGN KEY (`location_id`) REFERENCES `locations` (`location_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `interview_apply`
--
ALTER TABLE `interview_apply`
  ADD CONSTRAINT `interview_apply_ibfk_1` FOREIGN KEY (`interview_id`) REFERENCES `interview` (`interview_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `interview_apply_ibfk_2` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `interview_round`
--
ALTER TABLE `interview_round`
  ADD CONSTRAINT `interview_round_ibfk_1` FOREIGN KEY (`interview_id`) REFERENCES `interview` (`interview_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `participants`
--
ALTER TABLE `participants`
  ADD CONSTRAINT `participants_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `participants_ibfk_2` FOREIGN KEY (`contest_id`) REFERENCES `contest` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `problems`
--
ALTER TABLE `problems`
  ADD CONSTRAINT `problems_ibfk_1` FOREIGN KEY (`difficulty`) REFERENCES `points_dist` (`difficulty`) ON UPDATE CASCADE;

--
-- Constraints for table `problem_tags`
--
ALTER TABLE `problem_tags`
  ADD CONSTRAINT `problem_tags_ibfk_1` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`problem_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `round_questions`
--
ALTER TABLE `round_questions`
  ADD CONSTRAINT `round_questions_ibfk_1` FOREIGN KEY (`round_id`) REFERENCES `interview_round` (`round_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `solutions`
--
ALTER TABLE `solutions`
  ADD CONSTRAINT `solutions_ibfk_1` FOREIGN KEY (`email`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `solutions_ibfk_2` FOREIGN KEY (`problem_id`) REFERENCES `problems` (`problem_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
