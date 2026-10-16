// Entrega el PDF de un workbook si el link firmado es válido y no venció.
// Los archivos viven fuera del repositorio (almacenamiento privado), en las variables PDF_URL_W1..W4.
// Si el almacenamiento necesita autenticación, se usa PDF_AUTH_HEADER (por ejemplo "Bearer ...").
const crypto = require('crypto');
const { PRODUCTS } = require('../lib/products');

function verify(t, secret) {
  const [data, sig] = String(t || '').split('.');
  if (!data || !sig) return null;
  const expected = crypto.createHmac('sha256', secret).update(data).digest('base64url');
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload;
  try { payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8')); } catch (e) { return null; }
  if (!payload || !payload.exp || Date.now() > payload.exp) return null;
  return payload;
}

module.exports = async (req, res) => {
  const secret = process.env.DOWNLOAD_SECRET;
  if (!secret) return res.status(503).send('La descarga todavía no está configurada.');

  const payload = verify(req.query && req.query.t, secret);
  if (!payload || !PRODUCTS[payload.f] || !PRODUCTS[payload.f].file) {
    return res.status(403).send('El link de descarga venció o no es válido. Escribinos por WhatsApp y te lo reenviamos.');
  }

  const source = process.env[PRODUCTS[payload.f].file];
  if (!source) return res.status(503).send('El archivo todavía no está disponible.');

  const headers = process.env.PDF_AUTH_HEADER ? { Authorization: process.env.PDF_AUTH_HEADER } : {};
  const r = await fetch(source, { headers });
  if (!r.ok) return res.status(502).send('No pudimos traer el archivo. Probá de nuevo.');

  const name = 'MAV_' + payload.f + '.pdf';
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="' + name + '"');
  res.setHeader('Cache-Control', 'private, no-store');
  res.status(200).send(Buffer.from(await r.arrayBuffer()));
};
