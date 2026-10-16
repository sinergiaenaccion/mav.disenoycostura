// Verifica un pago aprobado en Mercado Pago y devuelve links de descarga firmados.
// GET /api/confirm?payment_id=123  ->  { status, links: [{ title, url }] }
const crypto = require('crypto');
const { PRODUCTS } = require('../lib/products');

const DAYS = 7;

function sign(payload, secret) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  return data + '.' + sig;
}

module.exports = async (req, res) => {
  const token = process.env.MP_ACCESS_TOKEN;
  const secret = process.env.DOWNLOAD_SECRET;
  if (!token || !secret) return res.status(503).json({ error: 'La entrega todavía no está configurada.' });

  const paymentId = String((req.query && req.query.payment_id) || '').replace(/[^0-9]/g, '');
  if (!paymentId) return res.status(400).json({ error: 'Falta el número de pago.' });

  try {
    const r = await fetch('https://api.mercadopago.com/v1/payments/' + paymentId, {
      headers: { Authorization: 'Bearer ' + token },
    });
    if (!r.ok) return res.status(404).json({ error: 'No encontramos ese pago.' });
    const p = await r.json();

    if (p.status !== 'approved') {
      return res.status(200).json({ status: p.status, links: [] });
    }

    const ids = String((p.metadata && p.metadata.products) || '')
      .split(',')
      .filter((id) => PRODUCTS[id]);
    const products = ids.includes('pack') ? ['pack'] : ids;

    // Expande el pack a sus cuatro archivos.
    const files = [];
    products.forEach((id) => {
      const list = PRODUCTS[id].includes ? PRODUCTS[id].includes : [id];
      list.forEach((fid) => { if (!files.includes(fid)) files.push(fid); });
    });

    const exp = Date.now() + DAYS * 24 * 60 * 60 * 1000;
    const links = files.map((fid) => {
      const t = sign({ f: fid, pid: paymentId, exp }, secret);
      return { title: PRODUCTS[fid].title, url: '/api/download?t=' + encodeURIComponent(t) };
    });

    return res.status(200).json({ status: 'approved', links, expires_in_days: DAYS });
  } catch (e) {
    console.error('confirm failed', e && e.message);
    return res.status(502).json({ error: 'No pudimos verificar el pago. Probá de nuevo en un momento.' });
  }
};
