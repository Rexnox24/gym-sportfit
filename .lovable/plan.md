# Entregar el código de Gym Sportfit en un archivo ZIP para publicar en tu dominio

## Qué voy a hacer

1. **Preparar el paquete del código fuente**
   - Copiar todo el código del proyecto a una carpeta limpia temporal.
   - Excluir lo que no sirve para publicar: historial de versiones (.git), dependencias instaladas (node_modules) y archivos generados de compilación.
   - Verificar la lista completa de archivos incluidos antes de comprimir.

2. **Crear el ZIP y entregarlo**
   - Comprimir como `Gym-Sportfit-codigo.zip` y guardarlo en tus Archivos para descargarlo.
   - Revisar el contenido del ZIP para confirmar que está completo y limpio.

3. **Incluir una guía de publicación en español**
   - Un documento `Guia-Publicacion.md` dentro del ZIP (y también en tus Archivos) con los pasos para subirlo a tu hospedaje y apuntar tu dominio.

## Importante que debes saber

- **El código viaja, pero el "motor" no**: el registro de miembros, el inicio de sesión, los pagos con PayPal y los avisos de vencimiento funcionan hoy gracias al backend de Lovable Cloud. Si subes el ZIP a otro hospedaje, esas partes dejarán de funcionar hasta configurar un backend propio (base de datos, claves y servidor). La guía lo explica con detalle.
- **La opción sin complicaciones sigue disponible**: publicar desde Lovable y conectar tu dominio propio toma minutos y todo (pagos, registros, avisos) sigue funcionando igual. Si cambias de opinión, dímelo y lo hacemos así.
- Las fotos, el logo, los planes, las promociones y las redes sociales van incluidos en el ZIP tal como están en la página.

## Detalles técnicos

- Ensamblado en `/tmp` con rsync excluyendo `.git`, `node_modules`, `dist`, `.output` y archivos de build.
- Listado recursivo verificado (incluidos archivos ocultos) antes de copiar a `/mnt/documents`.
- El ZIP se crea en `/tmp`, se inspeccionan sus entradas y luego se copia a Archivos.
- No se publica nada en internet ni se toca el dominio: solo se entrega el archivo.
