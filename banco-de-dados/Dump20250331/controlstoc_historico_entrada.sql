-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: controlstoc
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `historico_entrada`
--

DROP TABLE IF EXISTS `historico_entrada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico_entrada` (
  `identrada` int NOT NULL AUTO_INCREMENT,
  `fornecedor` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_entrada` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantidade_entrada` int NOT NULL,
  `numero_nota` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valor_nota` decimal(10,2) DEFAULT NULL,
  `data_entrada` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`identrada`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico_entrada`
--

LOCK TABLES `historico_entrada` WRITE;
/*!40000 ALTER TABLE `historico_entrada` DISABLE KEYS */;
INSERT INTO `historico_entrada` VALUES (1,'Agrolaf','Arroz',23,'232',23.00,'2025-03-27 03:00:00'),(2,NULL,'banana',2,'97767430967097-43',100.00,'2025-03-10 03:00:00'),(3,NULL,'Arroz',25,'1231418461984601943',123.00,'2025-03-10 03:00:00'),(4,NULL,'Arroz',125,'97767430967097-43',141.00,'2025-03-10 03:00:00'),(5,'Agrolaf','Arroz',142,'97767430967097-43',1412.00,'2025-03-10 03:00:00'),(6,'Agrolaf','Arroz',20,'12312',12422.00,'2025-03-10 03:00:00'),(7,'Agrolaf','Arroz',500,'97767430967097-43',900.00,'2025-03-10 03:00:00'),(8,'Agrolaf','Arroz',5,'12312',12.00,'2025-03-24 03:00:00');
/*!40000 ALTER TABLE `historico_entrada` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-31 11:29:06
