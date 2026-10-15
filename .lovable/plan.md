# Gym Sportfit lista para publicar en Netlify

## Qué vas a recibir

Un solo archivo `Gym-Sportfit-Netlify.zip` con la página completa (portada, equipamiento, planes y promociones, registro, login, portal de miembros y los botones de PayPal) más una guía en español paso a paso para subirla a Netlify con tu dominio.

## Cómo funciona, para que decidas informado

- La página no cabe en un solo archivo HTML: el registro, el portal de miembros y el pago con PayPal necesitan un servidor. Netlify sí lo ejecuta, así que ahí todo funciona.
- La base de datos se queda donde está ahora (Lovable Cloud). La copia de Netlify apunta a la misma base, así que los miembros, pagos y avisos de vencimiento son los mismos en los dos sitios. No hay que migrar datos.
- Las 14 fotos que se ven en la página viajan dentro del archivo.
- Lo que no viaja: las claves secretas. Esas las pegas tú en Netlify siguiendo la guía, por seguridad.

## Pasos que haré

1. **Configurar Netlify** sin tocar nada de lo que ya se ve igual aquí: archivo `netlify.toml` y un comando de preparación del sitio para Netlify, además del que ya usa la vista previa.
2. **Armar la carpeta limpia** que va al archivo: código de las páginas, componentes, estilos, las 14 fotos que sí se usan, las migraciones de la base de datos y un `.env.example` con los campos exactos que hay que llenar.
3. **Probarla antes de entregártela**: construir la versión de Netlify y abrirla en un navegador local para comprobar que cargan portada, equipamiento, planes y promociones, que el registro y el login responden, y que el portal pide sesión en vez de dejarte entrar suelto.
4. **Entregarte el archivo** con la guía: crear cuenta en Netlify, subir la carpeta, pegar los valores, conectar tu dominio y comprobar que la página ya vive en tu dirección.

## Lo que necesito de tu parte

- **Cuenta en Netlify** (gratis) y decirme si prefieres conectar Netlify con GitHub o subir la carpeta directamente desde tu computadora. La guía cubre las dos.
- **Las claves de PayPal** (aún no las tengo). Sin ellas, la página se ve y funciona igual, pero los botones de pago siguen diciendo que aún no están disponibles.
- **El nombre final del sitio** (por ejemplo `gym-sportfit.netlify.app` o tu dominio propio). Con esa dirección autorizo el acceso con Google y los correos; sin ella, el login con Google falla al llegar a Netlify.
- **El correo del dueño** para las copias de los avisos de vencimiento.

## Detalles técnicos

- Compilación con `NITRO_PRESET=netlify` (Nitro 3.0.260603-beta ya trae el preset `netlify`). La vista previa de aquí sigue usando Cloudflare, así que nada cambia en lo que ves hoy.
- Variables que hay que pegar en Netlify → Environment variables: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (estas dos últimas se incrustan al compilar) y `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_ENV`.
- El archivo no incluye `node_modules`, ni la carpeta oculta del editor, ni las 16 fotos de versiones anteriores que ya no usa ninguna página (siguen aquí por si las quieres).
- El aviso diario de vencimiento se ejecuta en el servidor actual; mientras la base de datos siga ahí, los avisos del portal y la ruta programada siguen funcionando sin tocar nada.
- Tamaño del archivo: unos 60 MB, casi todo por las fotos en alta resolución. Si lo quieres más ligero, puedo dejar una copia optimizada para web (misma imagen, menos peso) y bajarlo a unos 12 MB, con carga más rápida en celular.
- No borro ni muevo nada del proyecto actual.

## Queda sin verificar

- Que el pago con PayPal capture de verdad (faltan tus claves).
- El portal con una cuenta real confirmada: nadie ha terminado su registro todavía.
- Los avisos por correo: necesitan tu dominio de correo y el correo del dueño.
