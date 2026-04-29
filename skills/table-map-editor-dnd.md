# Skill: Table Map Editor (Drag and Drop)

## Objetivo
Permitir a cada local disenar su plano de mesas y sectores de forma visual.

## Alcance
- Frontend React.
- Persistencia de layout por tenant/sucursal.

## Entradas
- Dimensiones de sala, tipos de mesa, capacidad, sector.

## Reglas
- Snap-to-grid para alineacion rapida.
- Validar colisiones y limites de area.
- Versionar layout para rollback basico.

## Implementacion sugerida
- Libreria DnD en React con estado serializable.
- Modelo `FloorPlan -> Zones -> Tables`.
- Guardado incremental con autosave.

## Criterios de aceptacion
- Admin local crea/edita/elimina mesas.
- Cambios persisten y se reflejan en modulo de reservas.
- Layout es exclusivo del tenant/sucursal.

