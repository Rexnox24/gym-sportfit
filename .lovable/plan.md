# Gym Sportfit

## Objetivo
Crear una web inmersiva de Gym Sportfit con las fotos proporcionadas, un escaparate de equipamiento y un portal privado de miembros.

## Diseño e identidad
- Mejorar con IA la nitidez del logo adjunto mediante edición de la imagen original: conservar el tiburón, las letras «GYM» y «SPORT FIT», los colores y su disposición. Extraer únicamente el logo, sin la interfaz de Instagram, y revisar el resultado antes de incorporarlo.
- Usar ese mismo logo en la cabecera y como icono de la web.
- Fondos oscuros, acento amarillo neón inspirado en el logo y tipografía moderna gruesa, sin serifas.
- Utilizar las fotos reales del gimnasio, con recortes cuidados y filtros sutiles que mantengan visible el equipo.
- Adaptar la experiencia a móvil y ordenador, con animaciones fluidas y una alternativa sin movimiento.

## Páginas y experiencia
1. **Inicio:** Gym Sportfit como título principal sobre una fotografía panorámica del gimnasio; botones para explorar el equipo y acceder al portal de miembros.
2. **Equipamiento:** galería filtrable por zona o grupo muscular, tarjetas con inclinación al mover el cursor y detalles al pulsar cada máquina. Mostrar su función sin inventar especificaciones no confirmadas.
3. **Planes:** espacio preparado para la comparación de membresías. Como los planes y precios todavía no están definidos, mostrar «Próximamente», sin tarifas, beneficios comerciales ni compras ficticias.
4. **Acceso:** registro, inicio de sesión, confirmación por correo y recuperación de contraseña.
5. **Portal privado:** nombre, correo, membresía y estado de pago del miembro. Los nuevos registros quedarán sin membresía asignada y con pago sin registrar; registrarse no activará una membresía ni simulará un cobro.

## Datos y seguridad
- Activar Lovable Cloud para cuentas de acceso y almacenamiento permanente de perfiles.
- Crear automáticamente un perfil privado al registrarse.
- Permitir que cada miembro consulte únicamente sus datos y edite su nombre; impedir cambios propios en membresía y estado de pago.
- Preparar consultas por identificador e índices adecuados para una base de 10.000 miembros o más. La capacidad de usuarios simultáneos dependerá del servicio contratado y requerirá pruebas de carga antes de prometerla.
- No incluir cobros en línea ni un panel administrativo: no se han solicitado para esta fase.

## Detalles técnicos
- Implementar con React, Tailwind y Framer Motion sobre TanStack Start, el framework compatible con este proyecto, en lugar de Next.js.
- Sustituir la página inicial de plantilla en `/`; crear páginas públicas para equipamiento, planes y acceso, y una página protegida para el portal.
- Usar los servicios de autenticación de Lovable Cloud y políticas de acceso por propietario para los perfiles.
- Servir las fotos mediante el almacenamiento de recursos del proyecto y mantener las claves privadas fuera del navegador.
- Añadir títulos y descripciones propios a cada página.
- Al empezar la implementación, registrar las tareas en una lista de trabajo e incorporar la mejora del logo.

## Comprobación y entrega
- Verificar la galería, filtros, detalles de máquinas y navegación en móvil y ordenador.
- Probar registro, confirmación, acceso, recuperación de contraseña y lectura del perfil desde una sesión real.
- Comprobar que un miembro no puede consultar perfiles ajenos ni alterar su estado de pago.
- Entregar una guía paso a paso en español sobre la conexión de Lovable Cloud, la estructura de perfiles y las consideraciones para crecer a 10.000 miembros.
- Dejar planes, precios y moneda pendientes hasta que se definan; no publicar la web sin una petición explícita.