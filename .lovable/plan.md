# Gym Sportfit: marquesina y herramientas del dueño

## Qué vas a ver
1. **Franja en movimiento en la portada**: FUERZA ✦ DISCIPLINA ✦ EVOLUCIÓN ✦ GYM SPORTFIT ✦ SIN LÍMITES se desplaza sin cortes hacia la izquierda. «GYM SPORTFIT» va en una cápsula negra con letras amarillas, más gruesa y con borde. Si el teléfono tiene activada la opción de reducir movimiento, la franja se queda quieta.
2. **Editar socios en Gestión de clientes**: cada cliente tiene un botón «Editar» que abre un formulario con nombre, plan, fecha de vencimiento y un interruptor de cuenta activa o desactivada, más un botón «Guardar cambios» que muestra un aviso de confirmación. Una cuenta desactivada no puede entrar a su perfil, pero conserva su historial. «Dar de baja definitiva» sigue ahí y pide confirmación.
3. **Historial de movimientos**: un botón «Historial» muestra los cambios recientes (alta, renovación, cambio de plan, suspensión, reactivación, desactivación y pagos con PayPal), con la fecha, el socio y la nueva fecha de vencimiento. Cada cambio se guarda solo.
4. **Exportar a CSV**: descarga la lista que tienes en pantalla, con los filtros que hayas aplicado (nombre, correo, plan, vencimiento, estado, al corriente o vencido). Se abre en Excel.
5. **Preguntas en tus palabras**: escribe algo como «vencidos hace más de 15 días» y la lista se filtra sola, con un resumen corto de lo que encontró. La IA solo traduce tu pregunta a filtros y nunca ve los datos de tus clientes. Cada consulta usa un poco de tus créditos de IA.

## Detalles técnicos
- La marquesina usa en `.ticker` dos copias de la secuencia con `@keyframes` translateX(-50%). El elemento `.ticker-brand` usa los tokens `bg-background`, `text-primary` y `border-primary`.
- La migración agrega `profiles.account_active boolean default true` y la tabla `membership_logs` (id, user_id, actor_id, action, membership, expires_at, created_at), con grants, RLS que solo deja leer al admin vía has_role, y escritura solo desde el servidor. Un trigger en profiles registra los cambios de membresía, vigencia o cuenta activa, y la acción se calcula a partir de los valores anteriores y nuevos. Al crear el perfil se registra «alta».
- En admin.functions: `updateMember` (nombre, plan, vigencia, activo), `listLogs` y `interpretQuery`. Esta última llama a la IA (openai/gpt-6-astra, /v1/responses con salida json_schema estricta) y devuelve { status[], planIncludes, minDaysOverdue, maxDaysUntil, summary }. Los filtros se aplican en el navegador. Los errores 402, 403 y 429 muestran un aviso en español.
- Si `account_active=false`, getProfile del portal manda un bloqueo y el portal muestra «Cuenta desactivada, contacta al gimnasio». Además, la acción de desactivar banea al usuario en el sistema de acceso, y reactivar lo desbanea.
- El CSV se genera como Blob en el navegador con BOM UTF-8.
- Pruebas: la lógica del filtro de IA y la de la acción del log en un helper puro, con tests de vitest.
