# Skill: Inventory Recipe Math

## Objetivo
Aplicar formulas de costeo por receta y descuento automatico de stock por venta/produccion.

## Alcance
- Inventario, recetas (escandallos), mermas y compras.

## Entradas
- Recetas con ingredientes y unidades.
- Movimientos de venta, ajuste, recepcion y merma.

## Reglas
- Cada item vendido descuenta componentes de receta.
- Conversiones de unidades deben estar normalizadas.
- Alertar stock minimo y sugerir orden de compra.

## Implementacion sugerida
- Tabla de conversion de unidades por ingrediente.
- Costo teorico vs costo real por periodo.
- KPI: margen bruto, merma porcentual, rotacion.

## Criterios de aceptacion
- Venta impacta stock en tiempo real o casi real.
- Reporte de costo por plato disponible por tenant.
- Umbrales de reposicion generan recomendaciones.

