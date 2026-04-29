# AGENTS.md - Especificacion Maestra Unificada (RMS Multi-Tenant)

## 0. Identidad del Sistema
- **Nombre sugerido:** FlowTable RMS / CoreRest SaaS.
- **Definicion:** Plataforma integral de gestion de restaurantes (RMS) para automatizar reservas, pre-ordering, pedidos, cocina, inventario y cobros.
- **Paradigma:** SaaS multi-tenant con aislamiento estricto por `schema` o `tenant_id`.
- **Stack base:** NestJS (backend), React + Tailwind (frontend), PostgreSQL, Redis.
- **Enfoque UX:** PWA mobile-first para comensal y staff operativo.

## 1. Objetivos de Producto
- Unificar operacion de sala, cocina, caja e inventario en una sola plataforma.
- Reducir tiempos de servicio con POS de mozo y KDS en tiempo real.
- Habilitar reservas inteligentes con geofencing y pre-pedido.
- Mantener continuidad operativa ante cortes breves de internet (modo offline-ready).
- Escalar desde un local pequeno hasta cadenas con multiples sucursales.

## 2. Arquitectura de Modulos Core (Big Picture)

### 2.1 POS System (Hub Central)
- Gestion de pedidos para mesa, delivery y take-away.
- Interfaz tactil optimizada para carga rapida de items y modificaciones.
- Cobro multicanal: QR, efectivo, transferencia y pasarelas.
- Facturacion electronica con integraciones fiscales (ej. AFIP/Factura A con CUIT).

### 2.2 Kitchen Display System (KDS)
- Comandas digitales en pantallas tactiles (sin tickets de papel).
- Priorizacion por hora de llegada estimada y tipo de preparacion.
- Temporizadores de prioridad por pedido.
- Avisos de "plato listo" con notificaciones push y voz sintetizada.

### 2.3 Reservas, Mapa de Mesas y Geoposicion
- Editor visual de plano de mesas (drag and drop).
- Reserva dinamica por cantidad de plazas (adultos, ninos, bebes).
- Geolocalizacion por distancia/tiempo para deteccion de llegada.
- Evento "cliente en camino" para anticipar operacion de sala/cocina.

### 2.4 Inventario y Cost Control
- Descuento automatico de insumos por receta/escandallo.
- Gestion de proveedores, recepcion y ordenes de compra por umbrales minimos.
- Control de mermas y analitica de desperdicio.

### 2.5 Workforce Management
- Programacion inteligente de turnos segun forecasting de ventas.
- Control de presentismo con QR personal.
- Reglas transparentes para distribucion de propinas (pooling).

### 2.6 CRM y Fidelizacion
- Perfiles de clientes con historial, alergias y preferencias.
- Programas de puntos y automatizaciones de marketing.

### 2.7 Back-Office y SuperAdmin SaaS
- Dashboard global para ventas de suscripciones y analitica multi-tenant.
- Gestion de marcas, sucursales/franquicias y soporte.
- Logistica central y remitos digitales entre sucursales.

## 3. Experiencia por Rol (User Stories)

### 3.1 Comensal (PWA publica)
- Reserva mesa con plazas y preferencia horaria.
- Realiza pre-order desde la reserva.
- Solicita adicionales y paga cuenta/propina via QR desde mesa.

### 3.2 Mozo (mobile-first)
- Toma pedidos desde celular/tablet sin terminal fija.
- Gestiona mesa, adicionales y cobro.
- Recibe alertas push/voz cuando cocina libera platos.

### 3.3 Cocinero (KDS)
- Visualiza comandas pendientes por prioridad y tiempo.
- Marca estados (en preparacion, listo, entregado).
- Dispara notificaciones de plato listo a sala.

### 3.4 Admin Local (Tenant Admin)
- Configura mapa de mesas y sectores.
- Administra menu, precios, promociones y turnos.
- Controla inventario, finanzas y metricas de rendimiento.

### 3.5 SuperAdmin (Owner del SaaS)
- Controla suscripciones por plan (inicial/intermedio/superior).
- Supervisa salud operativa y KPIs globales.
- Administra onboarding de nuevos restaurantes.

## 4. Fases de Desarrollo Detalladas

### Fase 1 - Core de Infraestructura y Landing (Semana 1)
- **Tarea 1.1:** Levantar `docker-compose` con `backend`, `frontend`, `postgres`, `redis`, `adminer`.
- **Tarea 1.2:** Implementar Tenant Resolver en NestJS para identificar restaurante/tenant.
- **Tarea 1.3:** Crear Landing Page React + Tailwind con SEO Schema.org `FoodEstablishment`.
- **Tarea 1.4:** Auth JWT para registro de propietarios y login multiplataforma.
- **Resultado esperado:** Cimientos del SaaS y acceso seguro inicial.

### Fase 2 - Motor de Reservas y Mapa (Semana 2)
- **Tarea 2.1:** Editor de plano de mesas drag and drop.
- **Tarea 2.2:** Logica de reserva por plazas + georadio (km/tiempo de llegada).
- **Tarea 2.3:** Notificaciones push para estado "cliente en camino".
- **Resultado esperado:** Flujo reserva -> llegada operativo.

### Fase 3 - Operaciones de Restaurante (Semana 3)
- **Tarea 3.1:** POS de mozo con adicion rapida, lectura QR y envio a cocina.
- **Tarea 3.2:** Monitor de cocina KDS con cola de pedidos y temporizadores.
- **Tarea 3.3:** Modulo pre-ordering vinculado a la reserva.
- **Resultado esperado:** Ciclo operativo sala-cocina completamente digital.

### Fase 4 - Back-Office y Finanzas (Semana 4)
- **Tarea 4.1:** Inventario (insumos, proveedores, recetas).
- **Tarea 4.2:** Facturacion electronica + pagos QR/pasarelas.
- **Tarea 4.3:** Dashboard SuperAdmin (suscripciones + analitica global).
- **Resultado esperado:** Gestion financiera y control central del negocio.

## 5. Matriz de Usuarios y Dispositivos
| Rol | Interaccion principal | Dispositivo ideal |
| :--- | :--- | :--- |
| Comensal | Reserva, pre-pedido, pago QR | Smartphone (PWA) |
| Mozo | Adicion, gestion de mesa, cobro | Smartphone / Tablet |
| Cocinero | Gestion de comandas, aviso de listo | Tablet 10" / TV |
| Admin Local | Inventario, turnos, precios | Laptop / PC |
| SuperAdmin | Ventas SaaS, soporte, analitica | PC |

## 6. Especificaciones de Diseno y Operacion
- **Mobile-first:** Operable con una mano para mozos.
- **Offline-ready:** Sincronizacion local via Redis para tolerar cortes breves de internet.
- **Accesibilidad:** Alertas auditivas para eventos criticos (nueva comanda/plato listo).
- **Tiempo real:** WebSockets para POS/KDS/notificaciones.

## 7. Stack Tecnologico y Entorno
- **Backend:** NestJS modular por dominio.
- **Frontend:** React + Tailwind, con estrategia PWA (Vite/Workbox).
- **DB:** PostgreSQL multi-tenant por schema (o `tenant_id` donde aplique).
- **Cache y mensajeria:** Redis para sesiones, eventos realtime y colas.
- **Infraestructura:** Docker, Adminer, Nginx reverse proxy.

## 8. Reglas de Negocio Criticas
- **Seguridad:** Un tenant nunca puede leer/escribir datos de otro tenant.
- **Resiliencia:** El staff debe poder seguir operando en red local ante caidas de internet.
- **Escalabilidad:** Arquitectura apta para crecimiento de 1 local a multiples cadenas.
- **Trazabilidad:** Cada evento operativo clave debe poder auditarse por tenant/sucursal/usuario.

## 9. Skills y OpenSpec en `/skills`
### Skills core (propuestas originales)
- `multi-tenant-isolation.md`
- `geo-radius-logic.md`
- `kds-voice-engine.md`
- `pwa-offline-sync.md`
- `inventory-recipe-math.md`

### Skills complementarias (derivadas del plan maestro)
- `tenant-resolver-nestjs.md`
- `table-map-editor-dnd.md`
- `qr-ordering-payment-flow.md`

## 10. Mapa de Trazabilidad (Modulo -> Fase -> Skill)
- **Tenant resolver y seguridad de datos:** Fase 1 -> `multi-tenant-isolation.md`, `tenant-resolver-nestjs.md`
- **Reservas + geolocalizacion + mapa:** Fase 2 -> `geo-radius-logic.md`, `table-map-editor-dnd.md`
- **POS/KDS/notificaciones:** Fase 3 -> `kds-voice-engine.md`, `qr-ordering-payment-flow.md`
- **Inventario/costos/offline operativo:** Fase 4 y transversal -> `inventory-recipe-math.md`, `pwa-offline-sync.md`

## 11. Agent Instructions (para implementacion)
- Usar este archivo como referencia maestra antes de implementar cualquier modulo.
- Verificar alineacion con: modulo core, fase de roadmap, rol impactado y skill asociada.
- Priorizar primero seguridad multi-tenant y estabilidad operativa.
- En cada entrega, incluir: alcance, riesgos, pruebas minimas y trazabilidad con este AGENTS.
- Ante conflictos entre detalle funcional y velocidad, preservar reglas criticas de negocio.

