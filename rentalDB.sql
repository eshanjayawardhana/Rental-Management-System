CREATE DATABASE  IF NOT EXISTS `stock_management` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `stock_management`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: stock_management
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `emp_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `id_number` bigint DEFAULT NULL,
  `phone_no` bigint DEFAULT NULL,
  PRIMARY KEY (`emp_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'John Doe','Colombo','john.doe@example.com',200532123454,753421183),(2,'Jane Smith','456 Elm St, Kandy','jane.smith@example.com',200123454323,753212832),(3,'Michael Johnson','789 Pine St, Galle','michael.j@example.com',200934532123,721234543),(4,'Emily Davis','321 Oak St, Jaffna','emily.d@example.com',200123456789,785432123),(5,'William Brown','654 Birch St, Negombo','william.b@example.com',200543123454,745412345),(6,'Olivia Wilson','987 Cedar St, Matara','olivia.w@example.com',200321853456,784519183),(7,'James Anderson','147 Spruce St, Anuradhapura','james.a@example.com',200432564532,752309184),(8,'Sophia Martinez','258 Maple St, Ratnapura','sophia.m@example.com',200012675423,751245832),(13,'Gihan Jayasena','Thalduwa','gihanjay@gmail.com',200134231266,740756543);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `order_item_id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int DEFAULT NULL,
  `unit_price_per_day` double DEFAULT NULL,
  `order_id` bigint DEFAULT NULL,
  `product_id` bigint DEFAULT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `rental_order` (`id`),
  CONSTRAINT `order_item_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (5,6,100,3,1),(6,3,60,3,6),(7,5,100,4,1),(8,20,100,5,1),(9,10,100,6,5),(10,1,100,7,5),(29,1,100,25,1),(30,1,50,25,2),(31,1,150,25,3),(32,1,120,25,4),(33,1,100,25,5),(34,1,60,25,6),(35,1,120,25,7),(36,1,100,26,1),(37,1,50,26,2),(38,3,150,26,3),(39,2,120,26,4),(40,1,100,26,5),(41,3,60,26,6),(42,1,120,26,7),(43,1,100,27,1),(44,1,100,28,1),(45,1,120,29,7),(46,2,120,29,4),(47,6,100,30,1),(48,10,120,7,7),(49,7,120,32,7);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `item_code` varchar(255) DEFAULT NULL,
  `item_name` varchar(255) DEFAULT NULL,
  `quantity` int NOT NULL,
  `rest_quantity` int NOT NULL,
  `unit_price_per_day` double NOT NULL,
  `barcode` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'LED10W','LED Light 10W',100,20,100,4792210101870),(2,'SPK100W','Speaker 100W',50,48,50,7224707656156),(3,'MIC01','Microphone',75,58,150,4792024016193),(4,'AMP200W','Amplifier 200W',30,24,120,8888075053846),(5,'STG-RGB','Stage Light RGB',40,9,100,4792192848428),(6,'LED006','LED Light Tape',300,196,60,4792345238777),(7,'BoxL001','Box Light',250,217,120,9789353334734);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rental_order`
--

DROP TABLE IF EXISTS `rental_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` datetime(6) DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `nic_no` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `rental_period` int DEFAULT NULL,
  `total_price` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rental_order`
--

LOCK TABLES `rental_order` WRITE;
/*!40000 ALTER TABLE `rental_order` DISABLE KEYS */;
INSERT INTO `rental_order` VALUES (3,'2025-02-08 03:14:52.330467','Eshan','Colombo','200245643267','eshan.@example.com','0754356784',3,2340),(4,'2025-02-08 03:27:16.068783','Amal Perera','Kandy','984534235v','amal.@example.com','0754356784',1,500),(5,'2025-02-08 03:31:18.303968','Sadun Jayaweera','Negambo','995634543v','sadun.@example.com','0764116456',2,4000),(6,'2025-02-08 03:33:44.946653','Perera','Yatiyantota','200043567843','perera.@example.com','0750873232',2,2000),(7,'2025-02-27 17:11:07.659431','Nayani Jayasooriya','Gampaha','200034321288','nayaniJay34@gmail.com','0754323456',1,1200),(25,'2025-02-26 22:03:58.684156','Kalhara','Ampara','200345342196','kalhara232@gmail.com','0703423154',2,1400),(26,'2025-02-26 22:32:41.188643','Lahiru Sahan','Kandy','200323456545','lahirusahan232@gmail.com','0703423154',6,7440),(27,'2025-02-26 22:45:16.589061','Sahan','Kandy','200545347634','sahan786@gmail.com','0754632156',6,600),(28,'2025-02-26 22:53:38.469105','Saman','awissawella','200543423761','sahan111@gmail.com','0764321456',6,600),(29,'2025-02-26 23:12:06.743248','Nimsha','Ihara Parussalla','200343123378','nimshaeshan45@gmail.com','0712343270',1,360),(30,'2025-02-27 16:22:01.957357','Gayani Perera','kandy','200123432356','gayaniperera345@gmail.com','0754653156',1,600),(31,'2025-02-27 17:11:07.659431','Nayani Jayasooriya','Gampaha','200034321288','nayaniJay34@gmail.com','0754323456',1,600),(32,'2025-02-27 17:41:26.700204','Nayani Jayasooriya','Gampaha','200034321288','nayaniJay34@gmail.com','0754323456',1,840);
/*!40000 ALTER TABLE `rental_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'john@example.com','password123','john_doe'),(2,'eshan34@gmail.com','eshan@123','eshan'),(3,'nayaniJay34@gmail.com','nayani123','Nayani'),(4,'gihanjay@gmail.com','gihan123','Gihan'),(5,'thami@gmail.com','thami@123','Thamishka');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-06 16:35:53
