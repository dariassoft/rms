# Skill: KDS Voice Engine

## Objetivo
Notificar eventos criticos de cocina (nueva comanda, plato listo) con voz y alertas visuales.

## Alcance
- Front KDS (tablet/TV).
- Eventos realtime (WebSocket/Redis pub-sub).

## Entradas
- Evento de pedido con prioridad, mesa y timestamps.
- Configuracion de audio por tenant/sucursal.

## Reglas
- Prioridad alta debe interrumpir cola de voz si aplica.
- Evitar repeticion de anuncios por idempotencia de evento.
- Mantener modo silencioso configurable por horario.

## Implementacion sugerida
- Web Speech API como capa primaria en navegador.
- Fallback a audio pregrabado cuando no haya speech support.
- Cola local de anuncios con deduplicacion por `order_id:event_type`.

## Criterios de aceptacion
- Eventos criticos generan alerta visual y auditiva.
- No hay duplicados ante reconexion de socket.
- Tiempo de propagacion apto para operacion de cocina.

