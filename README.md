## Platforma de control Empresa ABC - MVP Microservicios

Sistema de gestión de pedidos basado en arquitectura de microservicios.

![Angular](https://img.shields.io/badge/Angular-17-red?logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?logo=docker)

## Descripción General

Este proyecto es un **MVP técnico** que demuestra la transición de una plataforma monolítica hacia una arquitectura de microservicios. Incluye:

**Frontend** - Aplicación Angular con autenticación, roles y tema oscuro/claro
**Backend** - 3 microservicios independientes (Usuarios, Pedidos, Pagos)
**Base de datos** - MongoDB en contenedor
**Containerización** - Docker y Docker Compose

## Diagrama de Arquitectura

                     ┌─────────────────┐
                     │   CLIENTE WEB   │
                     │   (Angular)     │
                     │   Puerto: 4200  │
                     └────────┬────────┘
                              │
      ┌───────────────────────┼───────────────────────┐
      ▼                       ▼                       ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ USUARIOS        │ │ PEDIDOS         │ │ PAGOS           │
│ Puerto: 3001    │ │ Puerto: 3002    │ │ Puerto: 3003    │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             ▼
                   ┌─────────────────────┐
                   │ MongoDB             │
                   │ Puerto: 27017       │
                   └─────────────────────┘


## Justificación de Decisiones Técnicas

## Frontend

**Angular 17** - Framework robusto con TypeScript nativo, ideal para aplicaciones empresariales
**CSS Puro** - Mayor control sobre estilos, sin dependencias adicionales
**RxJS** - Manejo reactivo de estados y llamadas HTTP
**Guards** - Control de acceso basado en autenticación y roles

## Backend

**Node.js + Express** - Ligero, rápido y excelente para APIs REST
**MongoDB** - Flexibilidad de esquema, ideal para MVP
**Microservicios independientes** - Escalabilidad y despliegue independiente
**REST API** - Simplicidad y compatibilidad universal

### Base de Datos

**MongoDB** - Esquema flexible para datos de usuarios, pedidos y pagos

## Pasos para Ejecutar

## Prerrequisitos

Docker Desktop instalado
Git

## Ejecución

**1. Clonar el repositorio**

git clone https://github.com/camibass222/prueba-fullstack-toyota.git

**2. Construir y ejecutar con Docker Compose**

docker-compose up --build

**3. Iniciar el frontEnd**

cd abc-frontend
ng serve

**4. Acceder a la aplicación**

**Frontend** - http://localhost:4200
**Usuarios API** - http://localhost:3001
**Pedidos API** - http://localhost:3002
**Pagos API** - http://localhost:3003

## Credenciales de Prueba

**Usuario** - admin **Clave** -	123456 **Rol** - Administrador
**Usuario** - usuario **Clave** - 123456 **Rol** - Usuario

## API Pública Utilizada

JSONPlaceholder - https://jsonplaceholder.typicode.com

API REST gratuita para pruebas y prototipos que proporciona:

Posts
Usuarios
Todos
Comentarios

## Estructura del proyecto

prueba-fullstack-toyota/
├── abc-frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   └── models/
│   │   └── styles.css
│   ├── Dockerfile
│   └── nginx.conf
├── abc-backend/
│   ├── usuarios/
│   │   ├── src/index.js
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── pedidos/
│   │   ├── src/index.js
│   │   ├── Dockerfile
│   │   └── package.json
│   └── pagos/
│       ├── src/index.js
│       ├── Dockerfile
│       └── package.json
├── mongo-init/
│   └── init-db.js
├── capturas/
├── docker-compose.yml
├── .gitignore
└── README.md

### Endpoints de los Microservicios

## Servicio de Usuarios (Puerto 3001)

Método - Endpoint - Descripción
GET - /health - Health check
GET - /status - Estado detallado
GET - /api/users - Listar usuarios
GET - /api/users/:id - Obtener usuario
POST - /api/users - Crear usuario

## Servicio de Pedidos (Puerto 3002)

Método - Endpoint - Descripción
GET - /health - Health check
GET - /status - Estado detallado
GET - /api/orders - Listar pedidos
GET - /api/orders/:id - Obtener pedido
POST - /api/orders - Crear pedido
PUT - /api/orders/:id/status - Actualizar estado

## Servicio de Pagos (Puerto 3003)

Método - Endpoint - Descripción
GET - /health - Health check
GET - /status - Estado detallado
GET - /api/payments - Listar pagos
GET - /api/payments/:id - Obtener pago
POST - /api/payments - Procesar pago
POST - /api/payments/:id/refund - Reembolsar

## Detener los Servicios

docker-compose down

## Para eliminar también los volúmenes:

docker-compose down -v

## Autor

Juan Camilo Céspedes Henao
Desarrollado como MVP técnico para Desarrollaror FullStack Toyota.

## Licencia

MIT License