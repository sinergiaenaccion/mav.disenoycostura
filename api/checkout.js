// Crea una preferencia de pago de Mercado Pago (Checkout Pro) con el carrito recibido.
// Requiere la variable de entorno MP_ACCESS_TOKEN (de prueba o producción).
const crypto = require('crypto');
const { PRODUCTS } = require('../lib/products');

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return null; }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return res.status(503).json({ error: 'Los pagos todavía no están configurados.' });

  const body = readBody(req);
  const ids = body && Array.isArray(body.items) ? [...new Set(body.items)] : [];
  if (!ids.length) return res.status(400).json({ error: 'El carrito está vacío.' });

  // Validación: solo IDs conocidos; el pack no se combina con workbooks sueltos.
  if (ids.some((id) => !PRODUCTS[id])) return res.status(400).json({ error: 'Hay un producto que no existe.' });
  if (ids.includes('pack') && ids.length > 1) {
    return res.status(400).json({ error: 'El pack reemplaza a los workbooks individuales. Quitá los sueltos para continuar.' });
  }

  const items = ids.map((id) => ({
    id,
    title: PRODUCTS[id].title,
    quantity: 1,
    currency_id: 'ARS',
    unit_price: PRODUCTS[id].price,
  }));

  const ref = 'mav-' + crypto.randomBytes(8).toString('hex');
  const base = 'https://' + (req.headers['x-forwarded-host'] || req.headers.host);

  const preference = {
    items,
    external_reference: ref,
    metadata: { products: ids.join(',') },
    back_urls: {
      success: base + '/gracias.html',
      pending: base + '/gracias.html',
      failure: base + '/#workbooks',
    },
    auto_return: 'approved',
    statement_descriptor: 'MAV COSTURA',
  };

  try {
    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': ref,
      },
      body: JSON.stringify(preference),
    });
    const j = await r.json();
    if (!r.ok) {
      console.error('MP preference error', r.status, JSON.stringify(j).slice(0, 300));
      return res.status(502).json({ error: 'No se pudo iniciar el pago. Probá de nuevo en un momento.' });
    }
    return res.status(200).json({ init_point: j.init_point, sandbox_init_point: j.sandbox_init_point });
  } catch (e) {
    console.error('MP fetch failed', e && e.message);
    return res.status(502).json({ error: 'No se pudo iniciar el pago. Probá de nuevo en un momento.' });
  }
};
