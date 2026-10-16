# MAV Diseño & Costura — Corte y Confección

Sitio de **MAV Diseño & Costura**, preparado para evolucionar desde una web institucional hacia un ecosistema de clases presenciales/virtuales y productos digitales.

## Propuesta
- Clases de corte y confección desde nivel inicial.
- Modalidad presencial en Villa Allende.
- Modalidad virtual configurable.
- Turnero con días, franjas horarias y cupos configurables.
- Cursos digitales, moldes, workbooks y tutoriales.
- Futuro catálogo de productos físicos.

## Próximas integraciones
- Turnero real con disponibilidad configurable.
- Confirmación y reprogramación de reservas.
- Mercado Pago para cursos/productos digitales (workbooks: en esta rama).
- Entrega segura de archivos digitales.
- Panel de administración.
- Integración futura con Google Meet/Zoom.
- Catálogo físico cuando existan productos disponibles.

## Identidad
Instagram: @mav.disenoycostura  
Ubicación: Villa Allende, Córdoba  
WhatsApp: +54 9 351 212-3856

## Tienda de workbooks
- Carrito en el navegador (localStorage). Los precios que cobra el servidor están en `lib/products.js`.
- `api/checkout.js` crea la preferencia de Mercado Pago. Requiere `MP_ACCESS_TOKEN`.
- `api/confirm.js` verifica el pago aprobado y devuelve links firmados. Requiere `MP_ACCESS_TOKEN` y `DOWNLOAD_SECRET`.
- `api/download.js` entrega el PDF. Los archivos están fuera del repositorio: `PDF_URL_W1..W4` (y `PDF_AUTH_HEADER` si el almacenamiento lo pide).
- Nunca subir los PDF pagos al repositorio: es público.

## Estado
Primera versión visual y funcional de la landing. El repositorio es **sinergiaenaccion/mav.disenoycostura**.
