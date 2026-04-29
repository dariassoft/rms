# Skill: Multi-Tenant Isolation

## Objetivo
Garantizar aislamiento total de datos entre restaurantes (tenants) en backend, consultas SQL, cache y eventos.

## Alcance
- NestJS API (guards, interceptors, providers).
- PostgreSQL por `schema` o filtrado por `tenant_id`.
- Redis namespacing por tenant.

## Entradas
- Identificador tenant desde subdominio, header, token o contexto autenticado.
- Usuario autenticado y permisos.

## Reglas
- Toda query debe ejecutar con contexto tenant obligatorio.
- Prohibido acceso cross-tenant, incluso para joins/reportes.
- Logs y auditoria deben incluir `tenant_id`.
- Pruebas obligatorias de fuga de datos (negative tests).

## Implementacion sugerida
- `TenantContext` por request.
- Middleware/guard para resolver tenant temprano.
- Repositorios con scope tenant por defecto.
- Convencion de claves Redis: `tenant:{tenantId}:{domain}:{key}`.

## Criterios de aceptacion
- Usuario de tenant A no puede leer/escribir en tenant B.
- Tests de seguridad pasan en endpoints criticos.
- Operaciones masivas respetan scope tenant.

