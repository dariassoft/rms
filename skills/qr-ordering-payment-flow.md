# Skill: QR Ordering and Payment Flow

## Objetivo
Habilitar flujo self-service por QR: ver menu, pedir adicionales y pagar desde la mesa.

## Alcance
- Front PWA comensal.
- Backend de ordenes, pagos y estados de mesa.

## Entradas
- QR de mesa con token seguro.
- Carrito, metodo de pago y propina.

## Reglas
- Token QR debe expirar y poder rotarse.
- Validar estado de mesa/sesion antes de cobrar.
- Conciliar pago con POS para evitar doble cobro.

## Implementacion sugerida
- Deep link con `table_session_token`.
- Checkout desacoplado con webhook de pasarela.
- Estado de orden: `draft`, `sent`, `in_kitchen`, `served`, `paid`.

## Criterios de aceptacion
- Comensal puede ordenar y pagar sin intervencion de mozo.
- POS y cocina reciben evento en tiempo real.
- Transacciones quedan conciliadas y auditadas.

