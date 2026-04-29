# Skill: PWA Offline Sync

## Objetivo
Permitir continuidad operativa local cuando falla internet, con sincronizacion segura al recuperar conectividad.

## Alcance
- POS, KDS y acciones criticas de sala.
- Estrategia de cache y cola offline en PWA.

## Entradas
- Acciones de usuario (pedidos, cambios de estado, cobros pendientes).
- Estado de conectividad y version de datos.

## Reglas
- Operaciones criticas deben persistir en cola local durable.
- Reintentos con backoff y control de idempotencia.
- Resolver conflictos por timestamp + reglas de dominio.

## Implementacion sugerida
- Service Worker + IndexedDB para cola transaccional.
- Politica cache-first para assets, network-first para datos sensibles.
- `sync_status` por entidad: `pending`, `synced`, `conflict`.

## Criterios de aceptacion
- Se pueden tomar pedidos sin internet.
- Al volver la red, cola se sincroniza sin duplicar transacciones.
- Conflictos quedan auditados y resolubles.

