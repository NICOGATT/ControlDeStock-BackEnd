-- MySQL dump 10.13  Distrib 9.6.0, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: control_stock_db
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'b5f7d31d-008a-11f1-83c5-00155d259481:1-8543';

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `telefono` varchar(255) NOT NULL,
  `cuit` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `nombreEmpresa` varchar(255) NOT NULL,
  `condicionTributaria` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Juan Pearez','1198765432','20-12345678-9','juan.perez@example.com','Empresa Juan SRL Modificada','Monotribudddtista'),(2,'Juan Perez','1234567890','20-15678901-2','juan@example.com','Perez SRL','Responsable Inscripto');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colores`
--

DROP TABLE IF EXISTS `colores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colores`
--

LOCK TABLES `colores` WRITE;
/*!40000 ALTER TABLE `colores` DISABLE KEYS */;
/*!40000 ALTER TABLE `colores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direcciones`
--

DROP TABLE IF EXISTS `direcciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direcciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `direccion` varchar(255) NOT NULL,
  `clienteId` int NOT NULL,
  `codigoPostal` varchar(255) NOT NULL,
  `ciudad` varchar(255) NOT NULL,
  `provincia` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `direccion` (`direccion`),
  KEY `clienteId` (`clienteId`),
  CONSTRAINT `direcciones_ibfk_1` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direcciones`
--

LOCK TABLES `direcciones` WRITE;
/*!40000 ALTER TABLE `direcciones` DISABLE KEYS */;
INSERT INTO `direcciones` VALUES (1,'Av. Libertad 46',1,'1425','Buenos Aires','CABA'),(2,'Av. Libertad 1023',1,'1425','Buenos Aires','CABA'),(3,'Av. Libertad 123',2,'1425','Buenos Aires','Buenos Aires');
/*!40000 ALTER TABLE `direcciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prefacturaproductos`
--

DROP TABLE IF EXISTS `prefacturaproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prefacturaproductos` (
  `preFacturaId` int NOT NULL,
  `productoId` varchar(255) NOT NULL,
  `talleId` int NOT NULL,
  `colorId` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`preFacturaId`,`productoId`,`talleId`,`colorId`),
  UNIQUE KEY `PK_PreFacturaProductos` (`preFacturaId`,`productoId`,`talleId`,`colorId`),
  KEY `productoId` (`productoId`),
  KEY `talleId` (`talleId`),
  KEY `colorId` (`colorId`),
  CONSTRAINT `prefacturaproductos_ibfk_1` FOREIGN KEY (`preFacturaId`) REFERENCES `prefacturas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `prefacturaproductos_ibfk_2` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `prefacturaproductos_ibfk_3` FOREIGN KEY (`talleId`) REFERENCES `talles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `prefacturaproductos_ibfk_4` FOREIGN KEY (`colorId`) REFERENCES `colores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prefacturaproductos`
--

LOCK TABLES `prefacturaproductos` WRITE;
/*!40000 ALTER TABLE `prefacturaproductos` DISABLE KEYS */;
/*!40000 ALTER TABLE `prefacturaproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prefacturas`
--

DROP TABLE IF EXISTS `prefacturas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prefacturas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `clienteId` int DEFAULT NULL,
  `direccionId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `clienteId` (`clienteId`),
  KEY `direccionId` (`direccionId`),
  CONSTRAINT `prefacturas_ibfk_1` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `prefacturas_ibfk_2` FOREIGN KEY (`direccionId`) REFERENCES `direcciones` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prefacturas`
--

LOCK TABLES `prefacturas` WRITE;
/*!40000 ALTER TABLE `prefacturas` DISABLE KEYS */;
INSERT INTO `prefacturas` VALUES (1,'2026-03-22 19:02:27',2,3),(2,'2026-03-22 19:02:34',2,3),(3,'2026-03-22 19:02:36',2,3);
/*!40000 ALTER TABLE `prefacturas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `tipoDePrendaId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `tipoDePrendaId` (`tipoDePrendaId`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`tipoDePrendaId`) REFERENCES `tipodeprendas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20260202231745-create-talle.js'),('20260204193232-create-color.js'),('20260205192839-create-pre-factura.js'),('20260207145153-create-cliente.js'),('20260209193550-create-tipo-de-prenda.js'),('20260210185701-create-producto.js'),('20260211212428-create-pre-factura-producto.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stockproductos`
--

DROP TABLE IF EXISTS `stockproductos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stockproductos` (
  `productoId` varchar(255) NOT NULL,
  `talleId` int NOT NULL,
  `colorId` int NOT NULL,
  `stock` int NOT NULL,
  `precio` int NOT NULL,
  PRIMARY KEY (`productoId`,`talleId`,`colorId`),
  UNIQUE KEY `PK_StockProductos` (`productoId`,`talleId`,`colorId`),
  KEY `talleId` (`talleId`),
  KEY `colorId` (`colorId`),
  CONSTRAINT `stockproductos_ibfk_1` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stockproductos_ibfk_2` FOREIGN KEY (`talleId`) REFERENCES `talles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `stockproductos_ibfk_3` FOREIGN KEY (`colorId`) REFERENCES `colores` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stockproductos`
--

LOCK TABLES `stockproductos` WRITE;
/*!40000 ALTER TABLE `stockproductos` DISABLE KEYS */;
/*!40000 ALTER TABLE `stockproductos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `talles`
--

DROP TABLE IF EXISTS `talles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `talles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `talles`
--

LOCK TABLES `talles` WRITE;
/*!40000 ALTER TABLE `talles` DISABLE KEYS */;
/*!40000 ALTER TABLE `talles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipodeprendas`
--

DROP TABLE IF EXISTS `tipodeprendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipodeprendas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipodeprendas`
--

LOCK TABLES `tipodeprendas` WRITE;
/*!40000 ALTER TABLE `tipodeprendas` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipodeprendas` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-22 16:44:00
