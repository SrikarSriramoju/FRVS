-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: frvsystem
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` varchar(255) NOT NULL,
  `content` text,
  `created_at` datetime(6) DEFAULT NULL,
  `downvotes` int NOT NULL,
  `feature_id` varchar(255) DEFAULT NULL,
  `parent_id` varchar(255) DEFAULT NULL,
  `upvotes` int NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES ('32a8bbc7-effd-44d1-b9ec-44922b2b406e','Its actually worst','2026-04-13 15:42:05.755878',0,'e690016d-c9c4-4f08-a7bd-597fd4e9cea1',NULL,0,'32da6dad-f363-4813-b583-a459e1e06a89','Guest User'),('713610b8-a386-40e8-91b0-6e10262d0be2','Dark Mode, its amazing!!','2026-04-15 08:10:32.492824',0,'4227128c-136a-4a63-b657-cb8bbb25a87f',NULL,0,'b8224fec-44a7-4d74-b7da-45b03a8c2cf5','Guest User'),('71f4f31b-20ad-4857-8f23-1f7832b3c3ef','Yeah This feature is absolutely amazing, I love it!','2026-04-12 09:13:23.507498',0,'a1de7785-cf65-4712-84fa-e5a8d8563c3e',NULL,0,'de2c7d14-4318-4c11-a1c7-e2060cc1edeb','Guest User'),('c28b80d7-2298-4ae6-ac83-3156b3968147','Yes it will look good','2026-04-15 07:56:55.658515',0,'bccedd0f-d770-43c8-b755-2301cf69367c',NULL,0,'b8224fec-44a7-4d74-b7da-45b03a8c2cf5','Guest User');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feature_cluster_tags`
--

DROP TABLE IF EXISTS `feature_cluster_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feature_cluster_tags` (
  `feature_cluster_id` varchar(255) NOT NULL,
  `tags` varchar(255) DEFAULT NULL,
  KEY `FKp1scnufx0qn2gbv7oux0iv5l0` (`feature_cluster_id`),
  CONSTRAINT `FKp1scnufx0qn2gbv7oux0iv5l0` FOREIGN KEY (`feature_cluster_id`) REFERENCES `feature_clusters` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feature_cluster_tags`
--

LOCK TABLES `feature_cluster_tags` WRITE;
/*!40000 ALTER TABLE `feature_cluster_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `feature_cluster_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feature_clusters`
--

DROP TABLE IF EXISTS `feature_clusters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feature_clusters` (
  `id` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `downvotes` int NOT NULL,
  `product_key` varchar(255) DEFAULT NULL,
  `status` enum('COMPLETED','IN_PROGRESS','OPEN','TODO') DEFAULT NULL,
  `summarized_description` text,
  `summarized_title` varchar(255) DEFAULT NULL,
  `upvotes` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feature_clusters`
--

LOCK TABLES `feature_clusters` WRITE;
/*!40000 ALTER TABLE `feature_clusters` DISABLE KEYS */;
INSERT INTO `feature_clusters` VALUES ('0a5ae16c-5213-4bfe-a3b0-a572c64ec362','2026-04-15 07:58:09.906985',0,'techcorp.inc.-5eaa','OPEN','Password manager will be better easy login','Password manager',0),('15b80edd-63e8-47f0-937f-e7765baa2dcb','2026-04-15 07:56:06.711014',0,'techcorp.inc.-5eaa','OPEN','Mobile app would be better','Mobile app',0),('62ba832e-4049-415e-bc63-f55437886d85','2026-04-12 09:12:01.088137',0,'techcorp.inc.-5eaa','OPEN','Dark mode will be better for eyes protection','Add dark mode for every component',0),('7906aee7-1946-4cb4-ad7d-672473cdca95','2026-04-11 07:28:34.249595',0,'techcorp.inc.-5eaa','IN_PROGRESS','add dark mode','Add dark mode',0),('aafc07fe-dc0d-4457-9e3e-0e8e022f1bb3','2026-04-11 07:19:39.231467',0,'default-org-key',NULL,'Initial Request: Dark mode will be better','Add Dark Mode',0),('eae3de9b-e7e0-40b4-9f22-ca4430180160','2026-04-13 15:40:38.498518',0,'techcorp.inc.-5eaa','OPEN','AI services are not that perfect that i expected','AI services should be better',0);
/*!40000 ALTER TABLE `feature_clusters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feature_requests`
--

DROP TABLE IF EXISTS `feature_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feature_requests` (
  `id` varchar(255) NOT NULL,
  `comment_count` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `downvotes` int NOT NULL,
  `product_key` varchar(255) DEFAULT NULL,
  `status` enum('COMPLETED','IN_PROGRESS','OPEN','TODO') DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `upvotes` int NOT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `cluster_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5u5nans7ha92rkcji941xqtr7` (`cluster_id`),
  CONSTRAINT `FK5u5nans7ha92rkcji941xqtr7` FOREIGN KEY (`cluster_id`) REFERENCES `feature_clusters` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feature_requests`
--

LOCK TABLES `feature_requests` WRITE;
/*!40000 ALTER TABLE `feature_requests` DISABLE KEYS */;
INSERT INTO `feature_requests` VALUES ('4227128c-136a-4a63-b657-cb8bbb25a87f',1,'2026-04-15 08:09:15.058228','Dark mode is wonderful',0,'techcorp.inc.-5eaa','OPEN','Add Dark mode for the UI',1,'guest-03dd4acc-6b57-330a-a148-5b1b87cdc16d@test.com','b8224fec-44a7-4d74-b7da-45b03a8c2cf5','Guest User','7906aee7-1946-4cb4-ad7d-672473cdca95'),('4d53dd6e-e873-4650-8776-85264efa9667',0,'2026-04-11 07:19:39.214367','Dark mode will be better',0,'default-org-key',NULL,'Add Dark Mode',0,'guest-aec0@test.com','1615cf5e-4b9d-4f36-9fa3-cf8a4af5cf08','Guest User','aafc07fe-dc0d-4457-9e3e-0e8e022f1bb3'),('6bb466fe-5e19-43a9-9629-f551a43abe37',0,'2026-04-15 07:56:04.544824','Mobile app would be better',0,'techcorp.inc.-5eaa','OPEN','Mobile app',0,'guest-03dd4acc-6b57-330a-a148-5b1b87cdc16d@test.com','b8224fec-44a7-4d74-b7da-45b03a8c2cf5','Guest User','15b80edd-63e8-47f0-937f-e7765baa2dcb'),('a1de7785-cf65-4712-84fa-e5a8d8563c3e',1,'2026-04-11 07:28:34.224968','add dark mode',0,'techcorp.inc.-5eaa','IN_PROGRESS','Add dark mode',2,'guest-ee7c@test.com','0e97a7ee-dce4-4360-981e-8ba18cf52d18','Guest User','7906aee7-1946-4cb4-ad7d-672473cdca95'),('bccedd0f-d770-43c8-b755-2301cf69367c',1,'2026-04-13 15:40:36.498197','AI services are not that perfect that i expected',0,'techcorp.inc.-5eaa','OPEN','AI services should be better',2,'guest-a7a0@test.com','32da6dad-f363-4813-b583-a459e1e06a89','Guest User','eae3de9b-e7e0-40b4-9f22-ca4430180160'),('e690016d-c9c4-4f08-a7bd-597fd4e9cea1',1,'2026-04-12 09:11:59.391380','Dark mode will be better for eyes protection',1,'techcorp.inc.-5eaa','OPEN','Add dark mode for every component',1,'guest-87e6@test.com','de2c7d14-4318-4c11-a1c7-e2060cc1edeb','Guest User','62ba832e-4049-415e-bc63-f55437886d85'),('ed7106fa-fa97-470f-97cb-03f9471a77ae',0,'2026-04-15 07:58:09.600946','Password manager will be better easy login',0,'techcorp.inc.-5eaa','OPEN','Password manager',0,'guest-03dd4acc-6b57-330a-a148-5b1b87cdc16d@test.com','b8224fec-44a7-4d74-b7da-45b03a8c2cf5','Guest User','0a5ae16c-5213-4bfe-a3b0-a572c64ec362');
/*!40000 ALTER TABLE `feature_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sentiment_scores`
--

DROP TABLE IF EXISTS `sentiment_scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sentiment_scores` (
  `id` varchar(255) NOT NULL,
  `cluster_id` varchar(255) DEFAULT NULL,
  `comment_id` varchar(255) DEFAULT NULL,
  `confidence` double NOT NULL,
  `negative` double NOT NULL,
  `neutral` double NOT NULL,
  `overall` enum('NEGATIVE','NEUTRAL','POSITIVE') DEFAULT NULL,
  `positive` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sentiment_scores`
--

LOCK TABLES `sentiment_scores` WRITE;
/*!40000 ALTER TABLE `sentiment_scores` DISABLE KEYS */;
INSERT INTO `sentiment_scores` VALUES ('388627bc-6d32-45cd-ad4d-111d165e58fb','7906aee7-1946-4cb4-ad7d-672473cdca95','713610b8-a386-40e8-91b0-6e10262d0be2',1,0,0,'POSITIVE',1),('998889ff-48df-425b-beb7-c7e4de0eeba6','eae3de9b-e7e0-40b4-9f22-ca4430180160','c28b80d7-2298-4ae6-ac83-3156b3968147',1,0,0,'POSITIVE',1),('9f53bafe-b609-4a9a-8ee5-8691160ac718','62ba832e-4049-415e-bc63-f55437886d85','32a8bbc7-effd-44d1-b9ec-44922b2b406e',1,1,0,'NEGATIVE',0),('cc4ee6fe-990d-43b2-9251-4c8660d9c175','7906aee7-1946-4cb4-ad7d-672473cdca95','71f4f31b-20ad-4857-8f23-1f7832b3c3ef',1,0,0,'POSITIVE',1);
/*!40000 ALTER TABLE `sentiment_scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `organization` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `product_key` varchar(255) DEFAULT NULL,
  `role` enum('DEVELOPER','USER') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('0e97a7ee-dce4-4360-981e-8ba18cf52d18','guest-ee7c@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('11b6af83-8025-4b27-9a13-e74f4fe83f8d','guest-8f1e@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('1615cf5e-4b9d-4f36-9fa3-cf8a4af5cf08','guest-aec0@test.com','Guest User',NULL,NULL,'default-org-key','USER'),('32da6dad-f363-4813-b583-a459e1e06a89','guest-a7a0@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('35a14a14-d114-4cee-9365-d065c29679b1','guest-7b36@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('3a2344b1-6215-42ca-bc54-05463e104d34','guest-e970@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('49d33203-d839-4ddf-99bb-c8c3dfafa30f','guest-314b@test.com','Guest User',NULL,NULL,'default-org-key','USER'),('54214827-1193-4b35-988a-b8d3b61e9799','guest-bc27@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('5e85b78f-f129-4d9a-849b-75085135c60f','guest-df36@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('68e8576d-c193-41f1-9c08-33841dafae58','guest-f850@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('7546d556-bfdb-467d-af14-602bd3e9da82','dev@techcorp.com','jane smith','TechCorp.Inc.','$2a$10$rIOQc2YbF1rEl3OLkI0wred6Og5xsFlxwTUZaPY7SdCyntZJBanLe','techcorp.inc.-5eaa','DEVELOPER'),('7f547970-3f1f-46ff-8366-7548569b900a','guest-8464@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('a2ea63ea-74a8-475a-ab5c-f3e14a6a12f9','guest-3bed@test.com','Guest User',NULL,NULL,'default-org-key','USER'),('aa5bd2f1-71d9-447b-ae1a-30e0e1b5799a','guest-8aeb@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('b456db90-d76b-4ffb-acce-fd2cbd4afe97','guest-cca2@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('b8224fec-44a7-4d74-b7da-45b03a8c2cf5','guest-03dd4acc-6b57-330a-a148-5b1b87cdc16d@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER'),('de2c7d14-4318-4c11-a1c7-e2060cc1edeb','guest-87e6@test.com','Guest User',NULL,NULL,'techcorp.inc.-5eaa','USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `votes` (
  `id` varchar(255) NOT NULL,
  `target_id` varchar(255) DEFAULT NULL,
  `target_type` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `vote_type` enum('DOWNVOTE','UPVOTE') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES ('0156bfcf-3e3c-4661-ab03-c3fd4dcc010c','e690016d-c9c4-4f08-a7bd-597fd4e9cea1','FEATURE','aa5bd2f1-71d9-447b-ae1a-30e0e1b5799a','DOWNVOTE'),('16f3bd53-3263-4c2a-897b-cbaceff0561b','e690016d-c9c4-4f08-a7bd-597fd4e9cea1','FEATURE','aa5bd2f1-71d9-447b-ae1a-30e0e1b5799a','DOWNVOTE'),('1b01aa58-e5ed-4711-9e74-909684dc56f7','4227128c-136a-4a63-b657-cb8bbb25a87f','FEATURE','b8224fec-44a7-4d74-b7da-45b03a8c2cf5','UPVOTE'),('1c95a3af-4ca8-4592-a2ad-af257e8c4fc5','a1de7785-cf65-4712-84fa-e5a8d8563c3e','FEATURE','de2c7d14-4318-4c11-a1c7-e2060cc1edeb','UPVOTE'),('2fd0e609-a4e3-4727-8f4e-1031051df61c','a1de7785-cf65-4712-84fa-e5a8d8563c3e','FEATURE','11b6af83-8025-4b27-9a13-e74f4fe83f8d','UPVOTE'),('620894c0-f336-44f2-88f4-269c1651cb2b','e690016d-c9c4-4f08-a7bd-597fd4e9cea1','FEATURE','b8224fec-44a7-4d74-b7da-45b03a8c2cf5','UPVOTE'),('67a0f478-8bd5-4d17-a127-12de2857b183','e690016d-c9c4-4f08-a7bd-597fd4e9cea1','FEATURE','aa5bd2f1-71d9-447b-ae1a-30e0e1b5799a','DOWNVOTE'),('b9c6e478-20bc-445e-81e6-2620119bccfa','bccedd0f-d770-43c8-b755-2301cf69367c','FEATURE','b8224fec-44a7-4d74-b7da-45b03a8c2cf5','UPVOTE'),('c09aa9e7-c8df-41b6-8ce0-a77e4c6e767d','bccedd0f-d770-43c8-b755-2301cf69367c','FEATURE','11b6af83-8025-4b27-9a13-e74f4fe83f8d','UPVOTE');
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-03 19:50:31
