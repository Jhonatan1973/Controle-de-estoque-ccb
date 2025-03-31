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
-- Table structure for table `historico_saida`
--

DROP TABLE IF EXISTS `historico_saida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico_saida` (
  `idsaida` int NOT NULL AUTO_INCREMENT,
  `nome_saida` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `quantidade_retirada` int NOT NULL,
  `evento` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_saida` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `quem_retirou` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`idsaida`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico_saida`
--

LOCK TABLES `historico_saida` WRITE;
/*!40000 ALTER TABLE `historico_saida` DISABLE KEYS */;
INSERT INTO `historico_saida` VALUES (1,'Arroz',1,'RGE','2025-03-10 03:00:00','Jhonatan'),(2,'Arroz',30,'ANCIÃES','2025-03-10 03:00:00','gi'),(3,'Arroz',1000,'ANCIÃES','2025-03-10 03:00:00','Jhonatan'),(4,'Pãp',5,'RGE','2025-03-21 03:00:00','Jhonatan'),(5,'Pãp',5,'RGE','2025-03-21 03:00:00','Jhonatan'),(6,'Arroz',1,'Coord. Apoio Brasil','2025-03-24 03:00:00','Jhonatan'),(7,'Arroz',1,'Videoconf. Coordenadores DARPE','2025-03-24 03:00:00','Jhonatan'),(8,'Arroz',1,'Videoconf. Coordenadores DARPE','2025-03-24 03:00:00','Jhonatan'),(9,'Arroz',1,'Assembleia CF - Trimestral','2025-03-24 03:00:00','Jhonatan'),(10,'Arroz',1,'Gestão Estratégica DARPE','2025-03-24 03:00:00','Jhonatan'),(11,'Produto X',10,'Venda','2025-03-24 03:00:00','Usuário A'),(12,'Arroz',1,'Assembleia CF - Trimestral','2025-03-19 03:00:00','Jhon'),(13,'Arroz',1,'Assembleia CF - Trimestral','2025-03-27 03:00:00','Jhon'),(14,'feijão',1,'Assembleia CF - Trimestral','2025-03-27 03:00:00','Jhon'),(15,'Bisteca',1,'Assembleia CF - Trimestral','2025-03-20 03:00:00','Jhon'),(16,'Arroz',1,'Assembleia CF - Trimestral','2025-03-12 03:00:00','Gisline'),(17,'Toast',1,'Assembleia CF - Trimestral','2025-03-12 03:00:00','Gisline'),(18,'Arroz',1,'Assembleia CF - Trimestral','2025-03-04 03:00:00','Jhon'),(19,'Arroz',1,'Assembleia CF - Trimestral','2025-03-13 03:00:00','Jhon'),(20,'feijão',1,'Assembleia CF - Trimestral','2025-03-11 03:00:00','Jhon'),(21,'macarrao',1,'Assembleia CF - Trimestral','2025-03-05 03:00:00','Gisline'),(22,'feijão',1,'Assembleia CF - Trimestral','2025-03-19 03:00:00','Jhon'),(23,'Arroz',1,'Assembleia CF - Trimestral','2025-03-26 03:00:00','Jhon'),(24,'Arroz',1,'Assembleia CF - Trimestral','2025-02-26 03:00:00','Jhon'),(25,'Arroz',1,'Assembleia CF - Trimestral','2025-03-01 03:00:00','Gisline'),(26,'Tomate',1,'Assembleia CF - Trimestral','2025-03-14 03:00:00','Gisline'),(27,'feijão',1,'Assembleia CF - Trimestral','2025-03-18 03:00:00','Wander'),(28,'feijão',1,'Assembleia CF - Trimestral','2025-03-26 03:00:00','Wander'),(29,'feijão',1,'Assembleia CF - Trimestral','2025-03-27 03:00:00','Wander'),(30,'Arroz',1,'Assembleia CF - Trimestral','2025-03-18 03:00:00','Wander'),(31,'Arroz',1,'DCR','2025-03-31 03:00:00','Jhon');
/*!40000 ALTER TABLE `historico_saida` ENABLE KEYS */;
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
