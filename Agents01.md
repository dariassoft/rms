Este es el archivo AGENTS.md expandido con un nivel de detalle industrial, diseñado para servir como la especificación maestra para tu modelo de IA. He integrado todos los módulos operativos, flujos de negocio y requisitos técnicos de un RMS de clase mundial.

# ---

**AGENTS.md \- Especificación Maestra de Ingeniería: RMS Multi-Tenant**

## **1\. Visión del Producto**

**Nombre Sugerido:** FlowTable RMS / CoreRest SaaS.

**Definición:** Plataforma integral de gestión de restaurantes (RMS) orientada a la eficiencia operativa mediante la automatización de pedidos, reservas con geoposicionamiento y pre-ordering. Diseñada bajo un modelo SaaS Multi-tenant con arquitectura PWA Mobile-First.

## ---

**2\. Arquitectura de Módulos Core (The Big Picture)**

### **A. POS System (El Hub Central)**

* **Transacciones:** Gestión de pedidos de mesa, delivery y take-away.  
* **Interfaz staff:** Optimización táctil para registro rápido de ítems y modificaciones.  
* **Pagos:** Procesamiento multicanal (QR, Efectivo, Transferencia).  
* **Facturación Electrónica:** Integración automática con entes fiscales (ej. AFIP/Factura A con CUIT).

### **B. Kitchen Display System (KDS)**

* **Comandas Digitales:** Sustitución total de tickets de papel por monitores táctiles.  
* **Orquestación de Tiempos:** Notificación de "Plato Listo" con voz sintetizada.  
* **Priorización Inteligente:** Basada en la hora de llegada del comensal y el tipo de preparación.

### **C. Gestión de Inventario y Desperdicio (Cost Control)**

* **Stock Tracking:** Descuento automático de insumos mediante recetas predefinidas (Escandallos).  
* **Purchasing & Receiving:** Generación de órdenes de compra automáticas basadas en umbrales mínimos.  
* **Waste Management:** Monitoreo inteligente de mermas y analítica de uso para sostenibilidad.

### **D. Gestión de Personal (Workforce Management)**

* **Scheduling:** Programación inteligente de turnos basada en forecasting de ventas.  
* **Control de Presentismo:** Fichaje de entrada/salida mediante escaneo de QR personal.  
* **Tip Management:** Algoritmos de distribución de propinas (pooling) transparentes para el staff.

### **E. CRM y Fidelización**

* **Database:** Perfiles de clientes con historial de consumo, alergias y preferencias.  
* **Loyalty:** Programas de puntos y marketing automatizado para fomentar la recurrencia.

## ---

**3\. Experiencia de Usuario por Rol (User Stories)**

### **El Comensal (PWA de cara al público)**

* **Reserva Dinámica:** Selecciona mesa, número de sillas (adultos/bebés) y radio de distancia/tiempo.  
* **Pre-Order:** Elige el menú anticipadamente para que la comanda entre a cocina automáticamente al detectar su cercanía (Geofencing).  
* **Self-Service:** Pide adicionales desde la mesa y paga la cuenta/propina vía QR sin llamar al mozo.

### **El Mozo (Mobile-First Interface)**

* **Movilidad:** Adición de pedidos desde su propio celular o tablet sin ir a un terminal fijo.  
* **Sincronización:** Recibe alertas push/voz cuando el pedido de su mesa está listo en cocina.

### **El Administrador del Local (Tenant Admin)**

* **Diseño de Planta:** Editor gráfico para configurar sectores y disposición de mesas.  
* **Gestión de Precios:** Actualización instantánea de menús y promociones estacionales.  
* **Finanzas:** Acceso a reportes P\&L (Pérdidas y Ganancias) y métricas de rendimiento de empleados.

### **El SuperAdmin (Dueño del SaaS \- Tu Rol)**

* **SaaS Dashboard:** Supervisión de ventas de suscripciones (Planes Inicial, Intermedio, Superior).  
* **Multi-Branch Control:** Gestión de marcas con múltiples sucursales y franquicias.  
* **Logística Central:** Control de remitos digitales entre sucursales y pedidos a fábrica centralizada.

## ---

**4\. Stack Tecnológico y Entorno de Desarrollo**

### **Infraestructura (Dockerizada)**

1. **Backend:** Nest.js (Node.js) \- Arquitectura modular por dominio.  
2. **Frontend:** React.js \+ Tailwind CSS \- PWA (Vite/Workbox).  
3. **Base de Datos:** PostgreSQL (Multi-tenant por Schema).  
4. **Cache/Real-time:** Redis (Sesiones, WebSockets para KDS y cola de mensajes).  
5. **Herramientas:** Adminer (Gestión DB), Nginx (Reverse Proxy).

### **Skills y OpenSpec a Implementar en /skills**

* **multi-tenant-isolation.md:** Lógica de filtrado de datos por tenant\_id.  
* **geo-radius-logic.md:** Algoritmo de búsqueda por KM/Tiempo de llegada.  
* **kds-voice-engine.md:** Implementación de Web Speech API para notificaciones de cocina.  
* **pwa-offline-sync.md:** Estrategia de sincronización Wi-Fi interna (trabajo sin internet).  
* **inventory-recipe-math.md:** Fórmulas de costeo por plato y descuento de insumos.

## ---

**5\. Plan de Ejecución (Roadmap Detallado)**

### **Fase 1: Cimientos (Landing & Auth)**

* Homepage del servicio SaaS (Landing Page).  
* Sistema de Login/Registro con JWT.  
* Dashboard inicial del SuperAdmin para crear los primeros "Restaurantes".

### **Fase 2: Configuración del Local (Tenant Setup)**

* Carga de menú (Menu Management).  
* Editor de mapa de mesas y sectores.  
* Gestión de staff (Roles y permisos).

### **Fase 3: Ciclo de Operación (POS & KDS)**

* Flujo completo: Reserva \-\> Pre-pedido \-\> Notificación de cercanía.  
* Pantalla de Mozo (PWA) y Pantalla de Cocina (KDS).  
* Generación de tickets digitales y facturación electrónica.

### **Fase 4: Inteligencia de Negocio (Analytics & Inventory)**

* Reportes de ventas, stock y mermas.  
* Automatización de pedidos de compra.  
* Sistema de fidelización (CRM).

## ---

**6\. Reglas de Negocio Críticas**

* **Seguridad:** Aislamiento total entre tenants. Un restaurante "A" nunca debe ver datos de un restaurante "B".  
* **Resiliencia:** El sistema debe permitir tomar pedidos en tablets vía Wi-Fi local aunque se caiga la conexión a internet de banda ancha.  
* **Escalabilidad:** Preparado para soportar desde un pequeño café hasta una cadena nacional con cientos de sucursales.

---

**Instrucción para la IA:** Utiliza este archivo como guía de referencia para generar el código. Cada vez que implementes un módulo (ej. POS), consulta la sección correspondiente aquí para asegurar la alineación con los requerimientos de "Core Components".