CREATE DATABASE `dev_kalum_java_2025` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

-- dev_kalum_java_2025.alumno definition

CREATE TABLE `alumno` (
  `carne` varchar(8) NOT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`carne`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- dev_kalum_java_2025.cargo definition

CREATE TABLE `cargo` (
  `cargo_id` varchar(128) NOT NULL,
  `descripcion` varchar(128) NOT NULL,
  `prefijo` varchar(64) NOT NULL,
  `monto` decimal(10,2) DEFAULT '0.00',
  `genera_mora` bit(1) DEFAULT b'0',
  `porcentaje_mora` decimal(3,0) DEFAULT NULL,
  PRIMARY KEY (`cargo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- dev_kalum_java_2025.carrera_tecnica definition

CREATE TABLE `carrera_tecnica` (
  `carrera_id` varchar(255) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `test` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`carrera_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- dev_kalum_java_2025.examen_admision definition

CREATE TABLE `examen_admision` (
  `examen_id` varchar(128) NOT NULL,
  `fecha_examen` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`examen_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- dev_kalum_java_2025.jornada definition

CREATE TABLE `jornada` (
  `jornada_id` varchar(128) NOT NULL,
  `prefijo` varchar(2) NOT NULL,
  `descripcion` varchar(128) NOT NULL,
  PRIMARY KEY (`jornada_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- dev_kalum_java_2025.aspirante definition

CREATE TABLE `aspirante` (
  `no_expediente` varchar(12) NOT NULL,
  `apellidos` varchar(255) DEFAULT NULL,
  `nombres` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `estatus` varchar(255) DEFAULT NULL,
  `examen_id` varchar(128) DEFAULT NULL,
  `carrera_id` varchar(128) DEFAULT NULL,
  `jornada_id` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`no_expediente`),
  UNIQUE KEY `email` (`email`),
  KEY `FK_EXAMEN_ADMISION` (`examen_id`),
  KEY `FK_CARRERA_TECNICA` (`carrera_id`),
  KEY `FK_JORNADA` (`jornada_id`),
  CONSTRAINT `FK_CARRERA_TECNICA` FOREIGN KEY (`carrera_id`) REFERENCES `carrera_tecnica` (`carrera_id`),
  CONSTRAINT `FK_EXAMEN_ADMISION` FOREIGN KEY (`examen_id`) REFERENCES `examen_admision` (`examen_id`),
  CONSTRAINT `FK_JORNADA` FOREIGN KEY (`jornada_id`) REFERENCES `jornada` (`jornada_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- dev_kalum_java_2025.cuentas_x_cobrar definition

CREATE TABLE `cuentas_x_cobrar` (
  `cargo` varchar(129) NOT NULL,
  `anio` varchar(4) NOT NULL,
  `carne` varchar(8) NOT NULL,
  `cargo_id` varchar(128) NOT NULL,
  `descripcion` varchar(128) NOT NULL,
  `fecha_cargo` datetime DEFAULT CURRENT_TIMESTAMP,
  `fecha_aplica` datetime DEFAULT CURRENT_TIMESTAMP,
  `monto` decimal(10,2) DEFAULT '0.00',
  `mora` decimal(10,2) DEFAULT '0.00',
  `descuento` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`cargo`,`anio`,`carne`),
  KEY `FK_CARGO` (`cargo_id`),
  KEY `FK_ALUMNO` (`carne`),
  CONSTRAINT `FK_ALUMNO` FOREIGN KEY (`carne`) REFERENCES `alumno` (`carne`),
  CONSTRAINT `FK_CARGO` FOREIGN KEY (`cargo_id`) REFERENCES `cargo` (`cargo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- dev_kalum_java_2025.inscripcion definition

CREATE TABLE `inscripcion` (
  `incripcion_id` varchar(128) NOT NULL,
  `carne` varchar(8) NOT NULL,
  `carrera_id` varchar(128) NOT NULL,
  `jornada_id` varchar(128) NOT NULL,
  `ciclo` varchar(4) NOT NULL,
  `fecha_inscripcion` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`incripcion_id`),
  KEY `FK_ALUMNO_INSCRIPCION` (`carne`),
  KEY `FK_CARRERA_TECNICA_INSCRIPCION` (`carrera_id`),
  KEY `FK_JORNADA_INSCRIPCION` (`jornada_id`),
  CONSTRAINT `FK_ALUMNO_INSCRIPCION` FOREIGN KEY (`carne`) REFERENCES `alumno` (`carne`),
  CONSTRAINT `FK_CARRERA_TECNICA_INSCRIPCION` FOREIGN KEY (`carrera_id`) REFERENCES `carrera_tecnica` (`carrera_id`),
  CONSTRAINT `FK_JORNADA_INSCRIPCION` FOREIGN KEY (`jornada_id`) REFERENCES `jornada` (`jornada_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- dev_kalum_java_2025.inscripcion_pago definition

CREATE TABLE `inscripcion_pago` (
  `boleta_pago` varchar(128) NOT NULL,
  `no_expediente` varchar(12) NOT NULL,
  `anio` varchar(4) NOT NULL,
  `fecha_pago` datetime DEFAULT CURRENT_TIMESTAMP,
  `monto` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`boleta_pago`,`no_expediente`,`anio`),
  KEY `FK_INSCRIPCION_PAGO` (`no_expediente`),
  CONSTRAINT `FK_INSCRIPCION_PAGO` FOREIGN KEY (`no_expediente`) REFERENCES `aspirante` (`no_expediente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- dev_kalum_java_2025.inversion_carrera_tecnica definition

CREATE TABLE `inversion_carrera_tecnica` (
  `inversion_id` varchar(128) NOT NULL,
  `carrera_id` varchar(128) NOT NULL,
  `monto_inscripcion` decimal(10,2) DEFAULT '0.00',
  `numero_pagos` int DEFAULT '0',
  `monto_pagos` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`inversion_id`),
  KEY `FK_INVERSION_CARRERA_TECNICA` (`carrera_id`),
  CONSTRAINT `FK_INVERSION_CARRERA_TECNICA` FOREIGN KEY (`carrera_id`) REFERENCES `carrera_tecnica` (`carrera_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- dev_kalum_java_2025.resultado_examen_admision definition

CREATE TABLE `resultado_examen_admision` (
  `no_expediente` varchar(12) NOT NULL,
  `anio` varchar(4) NOT NULL,
  `descripcion` varchar(128) NOT NULL,
  `nota` int NOT NULL,
  PRIMARY KEY (`no_expediente`,`anio`),
  CONSTRAINT `FK_INSCRIPCION_RESULTADO` FOREIGN KEY (`no_expediente`) REFERENCES `aspirante` (`no_expediente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;