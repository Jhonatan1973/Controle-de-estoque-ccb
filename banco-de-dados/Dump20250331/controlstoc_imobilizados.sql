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
-- Table structure for table `imobilizados`
--

DROP TABLE IF EXISTS `imobilizados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imobilizados` (
  `codigo_imobilizados` varchar(50) NOT NULL,
  `nome_imobilizados` varchar(255) NOT NULL,
  `quantidade_imobilizados` int NOT NULL,
  `fornecedor_imobilizados` varchar(255) NOT NULL,
  `dependencia` varchar(255) NOT NULL,
  `dt_aquisicao` date NOT NULL,
  `status` enum('Ativo','Depreciativo') NOT NULL,
  PRIMARY KEY (`codigo_imobilizados`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imobilizados`
--

LOCK TABLES `imobilizados` WRITE;
/*!40000 ALTER TABLE `imobilizados` DISABLE KEYS */;
INSERT INTO `imobilizados` VALUES ('21-1097 / 003969','27.002 - CARRINHO INOX 1 PRAT 0,47 X 0,67',2,'NC','CT - HORTIFRUTI ','2025-03-18','Ativo'),('21-1097 / 004051','27.002 - CARRINHO PORTA BANDEJAS 1,32 ALT',1,'NC','CT - PADARIA','2005-12-31','Depreciativo'),('21-1097 / 004127','11.001 - ESTANTE DE ACO INOX 4 PRAT 1,55 X 1,18 X 1,49',15,'NC','CT - HORTIFRUTI ','2025-03-18','Ativo'),('21-1097 / 004129','27.002 - CARRINHO INOX 0,47 X 0,68',1,'NC','CT - HORTIFRUTI ','2025-03-18','Ativo');
/*!40000 ALTER TABLE `imobilizados` ENABLE KEYS */;
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
