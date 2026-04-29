# Skill: Tenant Resolver (NestJS)

## Objetivo
Resolver el tenant en cada request y propagarlo al contexto de aplicacion.

## Alcance
- Middleware/Guard NestJS.
- Integracion con JWT y headers/subdominio.

## Entradas
- `Host`, `X-Tenant-Id`, claims JWT, metadata de usuario.

## Reglas
- Fuente de verdad de tenant definida y documentada.
- Rechazar request sin tenant valido.
- Soportar superadmin con switch controlado y auditado.

## Implementacion sugerida
- `TenantResolverMiddleware` para extraer tenant.
- `TenantContextProvider` request-scoped.
- Decorador `@Tenant()` para controladores/servicios.

## Criterios de aceptacion
- Tenant se resuelve en todos los endpoints protegidos.
- Errores de resolucion devuelven status consistente.
- Auditoria registra tenant y actor.

