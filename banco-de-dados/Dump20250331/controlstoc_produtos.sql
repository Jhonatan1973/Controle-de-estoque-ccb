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
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `produto_id` int NOT NULL AUTO_INCREMENT,
  `nome_produto` varchar(255) NOT NULL,
  `uni_compra` varchar(100) DEFAULT NULL,
  `uni_media` varchar(100) DEFAULT NULL,
  `quantidade` int NOT NULL DEFAULT '0',
  `categoria` varchar(100) DEFAULT NULL,
  `validade` date DEFAULT NULL,
  `estoque` json NOT NULL,
  PRIMARY KEY (`produto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (2,'Arroz','Uni','Cx',30062,'S','2025-12-10','{\"max\": 8, \"med\": 4, \"min\": 2}'),(3,'feijão','Pc','Cx',165,'S','2025-03-07','{\"max\": 12, \"med\": 212, \"min\": 1234}'),(4,'macarrao','Pc','Cx',95,'M','2025-03-10','{\"max\": 20, \"med\": 50, \"min\": 90}'),(5,'macarrao','Pc','Cx',94,'M','2025-03-10','{\"max\": 24, \"med\": 50, \"min\": 90}'),(6,'Sal ','Pc','Fd',96,'S','2025-03-10','{\"max\": 20, \"med\": 50, \"min\": 90}'),(7,'Açúcar','Pc','Cx',97,'M','2025-03-10','{\"max\": 24, \"med\": 50, \"min\": 100}'),(8,'banana','kg','kg',96,'hort frutas','2025-03-14','{\"max\": 5, \"med\": 3, \"min\": 1}'),(9,'Coco Ralado','unidade','kg',97,'S','2025-03-17','{\"max\": 100, \"med\": 50, \"min\": 25}'),(10,'Arroz Integral','unidade','kg',97,'S','2025-03-17','{\"max\": 400, \"med\": 250, \"min\": 125}'),(11,'Compota de Abobora','kg','kg',95,'Hort','2025-03-20','{\"max\": 15, \"med\": 8, \"min\": 2}'),(12,'Toast','unidade','ml',94,'S','2025-03-18','{\"max\": 100, \"med\": 50, \"min\": 20}'),(13,'Craker','caixa','unidade',97,'S','2025-03-18','{\"max\": 100, \"med\": 50, \"min\": 25}'),(14,'Pão','unidade','g',97,'S','2025-05-21','{\"max\": 1000, \"med\": 200, \"min\": 50}'),(15,'Bisteca','unidade','kg',6,'CAR.','2026-01-28','{\"max\": 150, \"med\": 100, \"min\": 50}'),(16,'Tomate','kg','unidade',199,'C','2025-03-28','{\"max\": 100, \"med\": 50, \"min\": 19}');
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-31 11:29:05
