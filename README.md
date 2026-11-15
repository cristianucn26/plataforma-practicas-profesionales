# Plataforma de gestión de prácticas profesionales — Taller Integrador Unidad 3

Prototipo académico que continúa los Talleres 1 y 2. Implementa dos módulos principales:
1. Gestión de estudiantes y empresas.
2. Gestión de ofertas y postulaciones.

Tecnologías: React + TypeScript (frontend), Node.js + Express + TypeScript (API), PostgreSQL (persistencia).

## Requisitos
- Node.js 20 o superior
- npm
- PostgreSQL 14 o superior (o Docker Desktop)

## 1. Base de datos
Desde la carpeta raíz:
```bash
docker compose up -d db
```
Esto crea la base `practicas_db` en `localhost:5432` con usuario `practicas` y contraseña `practicas_dev`. Son credenciales SOLO para desarrollo local; cámbialas antes de cualquier despliegue.

El esquema y datos de demostración se crean desde `database/init.sql`.

## 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```
API: http://localhost:3001
Comprobación: http://localhost:3001/api/health

## 3. Frontend
En otra terminal:
```bash
cd frontend
npm install
npm run dev
```
Abrir la URL que indique Vite (normalmente http://localhost:5173).

## 4. Pruebas unitarias
Desde `backend`:
```bash
npm test
```
Las pruebas usan el ejecutor nativo `node:test` y validan reglas puras del dominio sin requerir conexión a PostgreSQL.

## 5. Endpoints
- `GET /api/health`
- `GET /api/estudiantes`
- `POST /api/estudiantes`
- `GET /api/empresas`
- `POST /api/empresas`
- `GET /api/ofertas`
- `POST /api/ofertas`
- `POST /api/postulaciones`
- `GET /api/postulaciones`

## 6. Datos de demostración
El SQL carga programas, estudiantes, empresas y ofertas de ejemplo. Las postulaciones se crean desde la interfaz.

## 7. GitHub
1. Crea un repositorio vacío en GitHub.
2. En esta carpeta ejecuta:
```bash
git init
git add .
git commit -m "Entrega inicial Taller Integrador Unidad 3"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```
Sustituye la URL por la de tu repositorio real. No se ha creado un repositorio remoto desde este entorno.

## Alcance y límites
Es un prototipo académico. No implementa autenticación real, carga segura de documentos, firma electrónica ni integración con sistemas académicos institucionales. Los formularios permiten demostrar los flujos principales. No usar datos personales reales. Para producción se requieren autenticación/autorización, gestión de secretos, validación adicional, HTTPS, auditoría, backups y revisión de seguridad.
