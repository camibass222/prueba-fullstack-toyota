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

<img width="608" height="634" alt="Image" src="https://github.com/user-attachments/assets/aee016db-af2a-4482-b5dd-6204b520d665" />

## Diagrama de arquitectura

┌─────────────────────────────────────────────────────────────────────────┐
│                          ARQUITECTURA                                   │
│                         Microservicios                                  │
└─────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   Usuario   │
                              └──────┬──────┘
                                     │
                              ┌──────▼──────┐        ┌───────────────┐
                              │   FRONTEND  │        │  API          │
                              │   Angular   │◄──────►│ Externa       │
                              │  Port: 4200 │        │JSONPlaceholder│
                              └──────┬──────┘        └───────────────┘
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                                                     │
          │            Docker Network (abc-network)             │
          │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
          │  │ USUARIOS    │  │ PEDIDOS     │  │ PAGOS       │  │
          │  │ Node.js     │  │ Node.js     │  │ Node.js     │  │
          │  │ Port: 3001  │  │ Port: 3002  │  │ Port: 3003  │  │
          │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  │
          │         │                │                │         │
          │         └────────────────┼────────────────┘         │
          │                          │                          │
          │                   ┌──────▼──────┐                   │
          │                   │ MongoDB     │                   │
          │                   │ Port: 27017 │                   │
          │                   └─────────────┘                   │
          └─────────────────────────────────────────────────────┘

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

<img width="246" height="621" alt="Image" src="https://github.com/user-attachments/assets/8862991f-d4be-4240-8f68-27b56260e33b" />

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

## Capturas de pantalla del proyecto

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/4ce39162-c142-4ae8-ac47-2ceaaf5663e2" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/ab734a9a-1f9f-4676-ba8d-9da18bfba32a" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/8fdb94f5-7e28-432e-84f6-f9cc6b6119f4" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/182d69ae-e18e-4d90-a817-c3bf85eb97ee" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/17016564-97ae-4ad7-be5f-bdbecd099ea8" />

<img width="1367" height="767" alt="Image" src="https://github.com/user-attachments/assets/eca55664-3c85-47bc-bf39-dcba28a25e65" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/6f8fdda5-8c6a-4fd6-a05c-4942c6a21413" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/bfdc0213-41d3-4abe-8482-f68d03509726" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/4cc1eddd-6caa-4052-b4f9-81a57f4a4678" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/b3f1d0ae-4b56-4641-ae5d-3575efe375a1" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/00d11c8a-a54f-490e-9426-072bf4eeb74d" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/64d83280-b473-44d6-8e34-34a577008a87" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/2e5162bf-65ea-4a2b-bb9c-e9ed6e9436a5" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/214499aa-28b1-472d-8ccd-838503f37d7c" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/5a4f1959-4abd-4490-902a-1be5b75783a3" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/9bc7a012-fafe-449b-b57e-79d65e799fa4" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/848024f3-58c2-4d6b-ae9e-cc05c5f24f6c" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/b0b8d79f-8e3e-41f0-93ea-9d653002b9c8" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/355d58b9-9357-41c0-8b02-febb03393612" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/4afa22a1-94a8-4d0f-850e-05b41750ee10" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/8565b325-e90b-4df9-9070-5ca4746e70bb" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/4a08f5fe-a681-4ef9-bc21-1da5031533e6" />

<img width="1365" height="767" alt="Image" src="https://github.com/user-attachments/assets/9bd78b2f-3e0f-4994-a612-729dd3d3408e" />

## Licencia

MIT License