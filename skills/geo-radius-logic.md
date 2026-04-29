# Skill: Geo Radius Logic

## Objetivo
Calcular distancia y tiempo estimado de llegada del comensal para activar eventos de reserva y pre-order.

## Alcance
- Backend de reservas y eventos de proximidad.
- Geocoding y calculo Haversine/servicio de rutas.

## Entradas
- Coordenadas del restaurante.
- Coordenadas del cliente (consentidas).
- Umbrales por tenant (km/minutos).

## Reglas
- Activar estado "cliente en camino" cuando cumpla umbral.
- Evitar spam con debounce y ventanas de actualizacion.
- Registrar ultima posicion valida con timestamp.

## Implementacion sugerida
- Fallback Haversine para distancia directa.
- Si hay API de rutas, priorizar ETA por trafico.
- Motor de reglas: `far`, `approaching`, `near`, `arrived`.

## Criterios de aceptacion
- Estado cambia correctamente con datos simulados.
- Notificaciones se emiten una sola vez por transicion.
- Soporta configuracion por tenant/sucursal.

