# Reglas de Operacion del Agente

Este documento contiene las reglas y directivas que el agente de IA debe seguir durante todo el ciclo de desarrollo del proyecto RMS Multi-Tenant.

## 1. Entorno y Ejecucion
- **Comandos Dockerizados:** Todos los comandos `npm`, `npx` o de cualquier otro gestor de paquetes deben ejecutarse exclusivamente dentro del contenedor Docker correspondiente (`backend` o `frontend`). No se deben ejecutar comandos en el host que afecten a los `node_modules` del proyecto.
- **Compilacion y Verificacion:** Antes de finalizar cualquier tarea que implique modificacion de codigo, se debe compilar tanto el `backend` como el `frontend`. Se deben revisar los logs de compilacion y corregir todos los errores de forma ciclica hasta que ambos compilen sin errores.

## 2. Integridad de Datos y Base de Datos
- **Verificacion de Nombres:** Antes de usar cualquier nombre de tabla o campo en el codigo (queries, modelos, entities), se debe verificar su existencia y nombre exacto. La fuente de verdad primaria es la base de datos (`adminer`), seguida por los archivos de definicion de entidades (`*.entity.ts`).
- **Integridad en Cambios:** Al modificar una tabla (ej. cambiar nombre de columna, anadir/quitar campo), se debe revisar y actualizar todo el codigo que la utiliza para mantener la integridad:
    - **Backend:** DTOs, servicios, controladores, repositorios.
    - **Migraciones:** Asegurarse de que los archivos de migracion reflejen los cambios y permitan recrear el esquema de forma consistente.
- **Persistencia en Desarrollo:** En el entorno local, los datos de la base de datos pueden ser volatiles y recrearse con cada reinicio de los contenedores para asegurar un estado limpio.

## 3. Pruebas y Calidad de Codigo
- **Roles y Usuarios de Prueba:** Se deben crear y mantener un conjunto de usuarios con diferentes roles (SuperAdmin, Admin Local, Mozo, etc.) para facilitar las pruebas funcionales durante el desarrollo.
- **Verificacion de Nombres de Variables:** Antes de dar por completada una tarea, se debe realizar una verificacion final para asegurar que no se esten utilizando variables o campos con nombres incorrectos o inexistentes.

## 4. Integridad del Ecosistema (Backend/Frontend)
- **Actualizacion de Contratos:** Cualquier cambio en el `backend` que afecte a la API (endpoints, DTOs, respuestas) debe ser documentado y se debe mantener actualizada la documentacion de Swagger.
- **Analisis de Impacto en Frontend:** Antes de aplicar un cambio en el `backend`, se debe analizar su impacto en el `frontend`. Se deben identificar todas las funcionalidades que dependen del endpoint o DTO a modificar, anotarlas y planificar las actualizaciones necesarias en el frontend para evitar romper funcionalidades existentes.

## 5. Generacion de Contenido de Valor
- **Speech de Venta y Marketing:** En cada prompt, se deben identificar ideas, terminos, analisis y caracteristicas que puedan ser utiles para un discurso de venta o para generar contenido de marketing. Esta informacion debe ser registrada y actualizada constantemente en el archivo `SALES_PITCH.md`.

