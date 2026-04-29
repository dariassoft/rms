# AGENTS.md - Especificacion Maestra Unificada (RMS)

## 0. Identidad del Sistema
- **Nombre:** RMS - Restaurant Management System
- **Definicion:** Una plataforma dual que funciona como un **catalogo publico de restaurantes** para comensales y como un **sistema integral de gestion (SaaS)** para cada restaurante. Automatiza el ciclo completo: descubrimiento, reserva, pedido, cocina, pago y fidelizacion.
- **Paradigma:** SaaS multi-tenant con un portal publico unificado. Aislamiento estricto por `tenant_id` para la gestion interna de cada restaurante.
- **Stack base:** NestJS (backend), React + Tailwind (frontend), PostgreSQL, Redis.
- **Enfoque UX:** PWA mobile-first para comensales y staff operativo.
- **Internacionalizacion (i18n):** Soporte nativo para Ingles, Espanol y Frances.

## 1. Objetivos de Producto
- **Para el Comensal:** Ofrecer un catalogo centralizado para descubrir restaurantes, explorar menus, reservar y pagar de forma agil.
- **Para el Restaurante:** Unificar la operacion de sala, cocina, caja e inventario en una sola plataforma para reducir tiempos, errores y costos.
- Habilitar reservas inteligentes con seleccion de mesa y pre-pedidos.
- Fomentar la interaccion social y el marketing a traves de valoraciones y compartidos en redes.
- Mantener continuidad operativa ante cortes breves de internet (modo offline-ready).
- Escalar desde un local pequeno hasta cadenas con multiples sucursales.

## 2. Arquitectura de Modulos Core (Big Picture)

### 2.1 Catalogo Publico y Descubrimiento
- Buscador de restaurantes y platos por proximidad, valoracion y tipo de cocina.
- Perfiles de restaurantes con menus visuales (fotos, videos), valoraciones y criticas.
- Funcionalidad para compartir platos y perfiles en redes sociales (Instagram, Facebook, WhatsApp, TikTok).

### 2.2 Motor de Reservas y Mapa de Mesas
- Editor visual de plano de mesas (drag and drop) para el administrador del restaurante.
- Logica de reserva que permite al comensal elegir una mesa especifica.
- Reserva dinamica por cantidad de plazas (adultos, ninos, bebes).
- Modulo de pre-ordering opcional vinculado a la reserva.

### 2.3 POS System y Operaciones de Sala
- **Comensal:** Escaneo de QR en mesa para ver el menu, ordenar y pagar.
- **Mozo (mobile-first):** Toma de pedidos, adicion de detalles a comandas y gestion de mesas desde tablet/smartphone.
- Cierre de mesa con generacion de factura y opcion de anadir propina.

### 2.4 Kitchen Display System (KDS)
- Comandas digitales en pantallas tactiles con priorizacion inteligente.
- Estados visuales (en preparacion, listo, entregado).
- Avisos de "plato listo" con notificaciones push y voz sintetizada.

### 2.5 CRM, Valoraciones y Fidelizacion
- Sistema de valoracion por plato, servicio y restaurante.
- Distincion entre "comensal titular" (reserva) y "comensales invitados".
- Perfiles de clientes registrados con historial, preferencias y puntos.

### 2.6 Back-Office y Gestion (Tenant)
- **Admin Local:** Gestion de perfil publico, menu, precios, promociones y turnos.
- **Inventario y Cost Control:** Descuento automatico de insumos por receta.
- **Workforce Management:** Gestion de roles (administrador, mozo, cocinero) y horarios.

### 2.7 SuperAdmin SaaS
- Dashboard global para gestion de suscripciones, analitica multi-tenant y onboarding de nuevos restaurantes.

## 3. Experiencia por Rol (User Stories)

### 3.1 Comensal (PWA publica)
- **Como** comensal, **quiero** buscar platos especificos cerca de mi para descubrir nuevos restaurantes.
- **Como** comensal, **quiero** reservar una mesa especifica para 4 adultos y 1 bebe, y pre-ordenar las bebidas.
- **Como** comensal, **quiero** escanear un QR en la mesa para pedir postre sin llamar al mozo.
- **Como** comensal titular, **quiero** valorar el plato que pedi y el servicio del mozo.
- **Como** comensal invitado, **quiero** registrarme para poder valorar mi propio plato.
- **Como** comensal, **quiero** compartir el link del plato que me encanto en mi Instagram.

### 3.2 Mozo (mobile-first)
- **Como** mozo, **quiero** tomar un pedido desde mi celular y anadir una nota "sin picante" a un plato.
- **Como** mozo, **quiero** recibir una alerta en mi dispositivo cuando el plato de la mesa 5 este listo.
- **Como** mozo, **quiero** cerrar la mesa 7, generar la factura y registrar la propina.

### 3.3 Cocinero / Jefe de Cocina (KDS)
- **Como** cocinero, **quiero** ver las comandas ordenadas por prioridad y tiempo de espera.
- **Como** jefe de cocina, **quiero** supervisar todas las comandas y marcar un plato como "listo" para notificar al mozo.

### 3.4 Admin Local (Tenant Admin)
- **Como** admin, **quiero** arrastrar y soltar mesas en un plano para replicar la distribucion de mi salon.
- **Como** admin, **quiero** actualizar el menu del dia con fotos nuevas y poner el "plato del dia" en promocion.
- **Como** admin, **quiero** ver las valoraciones de los clientes para entender que platos son los mas populares.

### 3.5 SuperAdmin (Owner del SaaS)
- **Como** SuperAdmin, **quiero** ver cuantos restaurantes se han suscrito este mes y cual es el plan mas popular.
- **Como** SuperAdmin, **quiero** gestionar el onboarding de una nueva cadena de franquicias.

## 4. Fases de Desarrollo Detalladas

### Fase 1 - Core de Infraestructura y Landing (Semana 1)
- **Tarea 1.1:** Levantar `docker-compose` con `backend`, `frontend`, `postgres`, `redis`, `adminer`.
- **Tarea 1.2:** Implementar Tenant Resolver en NestJS para identificar restaurante/tenant.
- **Tarea 1.3:** Crear Landing Page React + Tailwind con SEO Schema.org `FoodEstablishment`.
- **Tarea 1.4:** Auth JWT para registro de propietarios y login multiplataforma.
- **Resultado esperado:** Cimientos del SaaS y acceso seguro inicial.

### Fase 2 - Catalogo Publico y Reservas (Semana 2)
- **Tarea 2.1:** Buscador de restaurantes y platos por proximidad.
- **Tarea 2.2:** Editor de plano de mesas drag and drop.
- **Tarea 2.3:** Logica de reserva por plazas + georadio (km/tiempo de llegada).
- **Tarea 2.4:** Modulo de pre-ordering vinculado a la reserva.
- **Resultado esperado:** Flujo catalogo -> reserva -> llegada operativo.

### Fase 3 - Operaciones de Restaurante (Semana 3)
- **Tarea 3.1:** POS de mozo con adicion rapida, lectura QR y envio a cocina.
- **Tarea 3.2:** Monitor de cocina KDS con cola de pedidos y temporizadores.
- **Tarea 3.3:** Sistema de valoracion por plato y servicio.
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
- **Internacionalizacion (i18n):** Deteccion automatica de idioma del navegador con opcion de cambio manual (ES, EN, FR).
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
- **Aislamiento de Datos:** Un tenant NUNCA debe poder leer/escribir datos de otro tenant.
- **Consistencia Publica:** Los datos publicos del catalogo deben ser consistentes con la gestion interna de cada tenant.
- **Trazabilidad Social:** Cada valoracion y compartido debe poder auditarse por usuario y tenant.
- **Resiliencia:** El staff debe poder seguir operando en red local ante caidas de internet.

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
- `i18n-react-implementation.md`

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
