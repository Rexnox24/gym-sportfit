# Volver a las fotos originales (descartar el retoque)

## Qué va a cambiar

- La web mostrará tus fotos tal como las subiste, sin ningún retoque de IA.
- Desaparecen de la página las versiones generadas: tanto las retocadas como las re-generadas.
- Todo lo demás sigue exactamente igual: tarifas, promoción de $750, servicios, horarios, catálogo de máquinas, registro, acceso y portal de miembros.
- El logo nítido que ya aprobaste se queda. Si también lo quieres en su versión original, dímelo y lo revierto.

## Pasos

1. `src/lib/gym-data.ts`: las 14 fotos vuelven a apuntar a tus archivos originales, como estaban antes de retocar.
2. Se borran del proyecto las 14 imágenes generadas por IA (9 del gym, 4 máquinas y el cartel).
3. `roadmap.md`: las dos tareas de retoque se marcan como descartadas, no como pendientes.
4. Memoria del proyecto y `AGENTS.md`: se quita la indicación de retocar fotos; la regla queda como "usar las fotos originales tal cual".
5. Revisión en el navegador: inicio, equipamiento, planes, promociones y acceso, en pantalla grande y en teléfono.

## Detalles técnicos

- `gym-data.ts` recupera el patrón `import a1 from '@/assets/gym-1.jpg.asset.json'` y `.url` (estado previo al retoque, commit 1f0fb09). `photos` y `equipment[].image` siguen siendo texto con la ruta de la imagen, así que ninguna página necesita cambios.
- Se eliminan los 14 JPG generados (1.4–6.6 MB cada uno) de `src/assets/photography/`. `logo-sportfit.jpg`, `public/favicon.png` y los `.asset.json` originales no se tocan.
- Sin cambios de base de datos, permisos ni backend.
- Verificación con Playwright en `localhost:8080`: imágenes visibles sin errores en consola, filtros de equipamiento, precios en planes y cartel de promoción.
