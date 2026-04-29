# AGENTS.md - Plan Maestro del RMS Multi-Tenant

## 0. Identidad del Sistema
* **Nombre Sugerido:** FlowTable RMS
* **Stack:** NestJS (Back) + React (Front) + PostgreSQL + Redis.
* **Paradigma:** Multi-tenant (Aislamiento total por Schema o TenantID).

## 1. Fases de Desarrollo Detalladas

### Fase 1: Core de Infraestructura y Landing (Semana 1)
* **Tarea 1.1:** Levantar Docker-compose: `backend`, `frontend`, `postgres`, `redis`, `adminer`.
* **Tarea 1.2:** Implementar el "Tenant Resolver" en NestJS para identificar cada restaurante.
* **Tarea 1.3:** Crear Landing Page (React + Tailwind) con SEO basado en Schema.org (FoodEstablishment).
* **Tarea 1.4:** Auth JWT: Registro de propietarios y login multiplataforma.

### Fase 2: El Motor de Reservas y Mapa (Semana 2)
* **Tarea 2.1:** Editor de plano de mesas (Drag & Drop en React).
* **Tarea 2.2:** Lógica de reservas: Selección de sillas (adultos/niños/bebés) + Geoposicionamiento (distancia/tiempo).
* **Tarea 2.3:** Notificaciones Push para "Cliente en camino".

### Fase 3: Operaciones de Restaurante (Semana 3)
* **Tarea 3.1:** POS de Mozo: Adición rápida, lectura de QR para comensales y envío a cocina.
* **Tarea 3.2:** Monitor de Cocina (KDS): Interfaz de pedidos pendientes con temporizadores de prioridad.
* **Tarea 3.3:** Módulo de Pre-ordering: Permitir al cliente elegir el menú desde la reserva.

### Fase 4: Back-Office y Finanzas (Semana 4)
* **Tarea 4.1:** Gestión de Inventario: Carga de insumos, proveedores y recetas.
* **Tarea 4.2:** Facturación Electrónica e integración de pagos (QR/Pasarelas).
* **Tarea 4.3:** Dashboard del SuperAdmin: Control de suscripciones y analítica global.

## 2. Definición de Usuarios y Acciones
| Rol | Interacción Principal | Dispositivo Ideal |
| :--- | :--- | :--- |
| **Comensal** | Reserva, Pre-pedido, Pago QR | Smartphone (PWA) |
| **Mozo** | Adición, Gestión de Mesa, Cobro | Smartphone / Tablet |
| **Cocinero** | Gestión de Comandas, Notificación de Listo | Tablet 10" / TV |
| **Admin Local** | Inventario, Turnos, Precios | Laptop / PC |
| **SuperAdmin** | Gestión de Ventas SaaS, Soporte | PC |

## 3. Especificaciones de Diseño
* **Mobile-First:** La interfaz debe ser operable con una sola mano para mozos.
* **Offline-Ready:** Sincronización mediante Redis para que el sistema siga operando si internet falla brevemente (Wi-Fi local).
* **Accesibilidad:** Notificaciones auditivas para eventos críticos (nueva comanda, plato listo).