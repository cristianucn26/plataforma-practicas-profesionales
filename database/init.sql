CREATE TABLE IF NOT EXISTS programa (
  id_programa SERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  facultad VARCHAR(120) NOT NULL
);
CREATE TABLE IF NOT EXISTS estudiante (
  id_estudiante SERIAL PRIMARY KEY,
  id_programa INTEGER NOT NULL REFERENCES programa(id_programa),
  nombres VARCHAR(120) NOT NULL,
  apellidos VARCHAR(120) NOT NULL,
  correo_institucional VARCHAR(160) NOT NULL UNIQUE,
  semestre SMALLINT NOT NULL CHECK (semestre BETWEEN 1 AND 12)
);
CREATE TABLE IF NOT EXISTS empresa (
  id_empresa SERIAL PRIMARY KEY,
  razon_social VARCHAR(160) NOT NULL,
  nit VARCHAR(30) NOT NULL UNIQUE,
  correo_contacto VARCHAR(160) NOT NULL
);
CREATE TABLE IF NOT EXISTS oferta (
  id_oferta SERIAL PRIMARY KEY,
  id_empresa INTEGER NOT NULL REFERENCES empresa(id_empresa),
  titulo VARCHAR(160) NOT NULL,
  descripcion TEXT NOT NULL,
  cupos INTEGER NOT NULL CHECK (cupos > 0),
  modalidad VARCHAR(30) NOT NULL DEFAULT 'Presencial',
  fecha_cierre DATE NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'Publicada'
    CHECK (estado IN ('Publicada','Cerrada'))
);
CREATE TABLE IF NOT EXISTS postulacion (
  id_postulacion SERIAL PRIMARY KEY,
  id_estudiante INTEGER NOT NULL REFERENCES estudiante(id_estudiante),
  id_oferta INTEGER NOT NULL REFERENCES oferta(id_oferta),
  fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado VARCHAR(25) NOT NULL DEFAULT 'Enviada'
    CHECK (estado IN ('Enviada','En revisión','Aceptada','Rechazada')),
  UNIQUE (id_estudiante, id_oferta)
);
CREATE TABLE IF NOT EXISTS tutor (
  id_tutor SERIAL PRIMARY KEY,
  nombres VARCHAR(120) NOT NULL,
  correo VARCHAR(160) NOT NULL UNIQUE,
  facultad VARCHAR(120) NOT NULL
);
CREATE TABLE IF NOT EXISTS practica (
  id_practica SERIAL PRIMARY KEY,
  id_postulacion INTEGER NOT NULL UNIQUE REFERENCES postulacion(id_postulacion),
  id_tutor INTEGER REFERENCES tutor(id_tutor),
  fecha_inicio DATE,
  fecha_fin DATE,
  estado VARCHAR(25) NOT NULL DEFAULT 'Pendiente de legalización'
);
CREATE TABLE IF NOT EXISTS informe (
  id_informe SERIAL PRIMARY KEY,
  id_practica INTEGER NOT NULL REFERENCES practica(id_practica),
  tipo VARCHAR(30) NOT NULL,
  fecha_entrega DATE NOT NULL,
  archivo_url TEXT,
  estado VARCHAR(25) NOT NULL DEFAULT 'Entregado'
);

INSERT INTO programa(nombre, facultad)
SELECT 'Tecnología en Desarrollo de Software','Facultad de Ingeniería'
WHERE NOT EXISTS (SELECT 1 FROM programa WHERE nombre='Tecnología en Desarrollo de Software');

INSERT INTO estudiante(id_programa,nombres,apellidos,correo_institucional,semestre)
SELECT p.id_programa,'Laura','Martínez','laura.martinez@ucn.edu.co',6
FROM programa p WHERE p.nombre='Tecnología en Desarrollo de Software'
AND NOT EXISTS (SELECT 1 FROM estudiante WHERE correo_institucional='laura.martinez@ucn.edu.co');

INSERT INTO empresa(razon_social,nit,correo_contacto)
SELECT 'Soluciones Digitales S.A.S.','900123456-1','talento@solucionesdigitales.com'
WHERE NOT EXISTS (SELECT 1 FROM empresa WHERE nit='900123456-1');

INSERT INTO oferta(id_empresa,titulo,descripcion,cupos,modalidad,fecha_cierre)
SELECT e.id_empresa,'Practicante de desarrollo web','Apoyo en desarrollo de aplicaciones web y pruebas funcionales.',2,'Híbrida',CURRENT_DATE + INTERVAL '30 days'
FROM empresa e WHERE e.nit='900123456-1'
AND NOT EXISTS (SELECT 1 FROM oferta WHERE titulo='Practicante de desarrollo web' AND id_empresa=e.id_empresa);
